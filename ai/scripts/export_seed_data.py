"""Generate database and backend seed data from the reviewed content files.

    python3 ai/scripts/export_seed_data.py

Writes two files, both committed:

    database/seed-generated.sql                  timeline + media rows for PostgreSQL
    backend/src/database/seed/generated-data.ts  the same rows for the in-memory repository

Sources of truth, neither of which is edited by hand afterwards:

    content/ai-ready/*-summary.md    the historical timeline tables
    content/media/media.json         verified, licensed images

Before this script existed, the timeline and media rows would have had to be
maintained by hand in two places that drift apart silently. Now the content team
edits the content, and both seeds are regenerated from it.
"""

import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from service import content_loader, textutils  # noqa: E402

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SQL_OUT = os.path.join(REPO, "database", "seed-generated.sql")
TS_OUT = os.path.join(REPO, "backend", "src", "database", "seed", "generated-data.ts")
MEDIA_JSON = os.path.join(REPO, "content", "media", "media.json")

# Locations in the MVP, in display order.
LOCATIONS = ["jerusalem", "bethlehem", "sebastia"]

# Wording that marks a timeline entry as tradition rather than documented history.
TRADITION_MARKERS = (
    "according to accounts",
    "according to tradition",
    "christian tradition",
    "islamic tradition",
    "is believed",
    "are believed",
    "popular",
)

# Rough era anchors used only to sort the timeline. Never displayed.
ERA_YEARS = [
    ("canaanite", -2000), ("early bronze", -3000), ("bronze age", -2000),
    ("ancient israelite", -1000), ("persian", -539), ("hellenistic", -332),
    ("roman era", -63), ("byzantine", 324), ("islamic conquest", 638),
    ("umayyad", 661), ("abbasid", 750), ("fatimid", 969), ("crusader", 1099),
    ("ayyubid", 1187), ("mamluk", 1250), ("ottoman", 1517),
    ("british mandate", 1917), ("modern", 1948), ("name origin", -1500),
]

_NUMBER_RE = re.compile(r"\d[\d,]*")


def sort_year(period_label):
    # type: (str) -> int
    """Approximate a year from a period label so the timeline can be ordered.

    The summaries phrase periods in several ways, and each needs different
    arithmetic before the entries will sort into chronological order:

        "586 BCE"                                    -> -586
        "Umayyad era (661-750 CE)"                   ->  661
        "16th century CE"                            ->  1550
        "Canaanite era (2nd millennium BCE)"         -> -2000
        "Canaanite era (... 4,000+ years ago)"       -> -2000
        "Name origin"                                -> era keyword lookup

    Taking the first number literally would put "4,000+ years ago" at year 4,
    i.e. after the Roman era, so the shape of the label has to be read first.
    The result orders the timeline and is never displayed.
    """
    lowered = period_label.lower()
    is_bce = "bce" in lowered
    numbers = [int(match.replace(",", "")) for match in _NUMBER_RE.findall(period_label)]

    if numbers:
        first = numbers[0]
        if "years ago" in lowered:
            # Roughly "now minus N", which lands in the BCE range for large N.
            return 2000 - first
        if "millennium" in lowered:
            return -(first * 1000) if is_bce else first * 1000
        if "century" in lowered:
            # 2nd century BCE spans -200..-101; 16th century CE spans 1500..1599.
            return -(first * 100) if is_bce else (first - 1) * 100 + 50
        return -first if is_bce else first

    for keyword, year in ERA_YEARS:
        if keyword in lowered:
            return year
    return 0


def is_tradition(period_label, description):
    # type: (str, str) -> bool
    text = (period_label + " " + description).lower()
    return any(marker in text for marker in TRADITION_MARKERS)


def collect_timeline():
    # type: () -> list
    rows = []
    for location_id in LOCATIONS:
        content = content_loader.load(location_id)
        if content is None:
            raise SystemExit("No reviewed summary for '%s'." % location_id)
        entries = textutils.table_rows(content.section("timeline"))
        if not entries:
            raise SystemExit("No timeline table in the summary for '%s'." % location_id)
        # The content files are already written in chronological order by the
        # documentation team, and that order is authoritative. Sorting by the
        # derived year instead would reorder entries whose period has no
        # explicit year ("Roman era") against ones that do ("27 BCE"), which
        # silently contradicts the reviewed source.
        for order, (period, event) in enumerate(entries):
            year = sort_year(period)
            rows.append({
                "id": "tl-%s-%02d" % (location_id, order + 1),
                "location_id": location_id,
                "period_label": period,
                "description": event,
                "sort_year": year,
                "sort_order": order,
                "is_tradition": is_tradition(period, event),
                "source_file": content.repo_path,
            })
    return rows


def load_media():
    # type: () -> list
    with open(MEDIA_JSON) as handle:
        document = json.load(handle)
    rows = []
    per_location = {}
    for record in document["media"]:
        location_id = record["location_id"]
        order = per_location.get(location_id, 0)
        per_location[location_id] = order + 1
        if not record.get("license") or not record.get("credit"):
            raise SystemExit("Media '%s' is missing licence or credit." % record["id"])
        rows.append(dict(record, sort_order=order))
    return rows


# --------------------------------------------------------------------------
# SQL output
# --------------------------------------------------------------------------

def sql_literal(value):
    if value is None or value == "":
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, int):
        return str(value)
    flattened = re.sub(r"\s+", " ", str(value)).strip()
    return "'" + flattened.replace("'", "''") + "'"


def write_sql(timeline, media):
    lines = [
        "-- =============================================================================",
        "-- Hikaya - GENERATED seed data. Do not edit by hand.",
        "-- =============================================================================",
        "-- Regenerate with:  python3 ai/scripts/export_seed_data.py",
        "--",
        "-- Sources:  content/ai-ready/*-summary.md   (timeline)",
        "--           content/media/media.json        (images)",
        "--",
        "-- Run after database/schema.sql and database/seed.sql:",
        "--   psql -d hikaya -f database/seed-generated.sql",
        "-- =============================================================================",
        "",
        "BEGIN;",
        "",
        "DELETE FROM timeline_events;",
        "DELETE FROM media;",
        "",
        "-- %d timeline events ---------------------------------------------------------" % len(timeline),
        "INSERT INTO timeline_events",
        "  (id, location_id, period_label, description, sort_year, sort_order, is_tradition, source_file)",
        "VALUES",
    ]
    values = []
    for row in timeline:
        values.append("  (%s, %s, %s, %s, %s, %s, %s, %s)" % (
            sql_literal(row["id"]), sql_literal(row["location_id"]),
            sql_literal(row["period_label"]), sql_literal(row["description"]),
            sql_literal(row["sort_year"]), sql_literal(row["sort_order"]),
            sql_literal(row["is_tradition"]), sql_literal(row["source_file"])))
    lines.append(",\n".join(values) + ";")
    lines.extend([
        "",
        "-- %d media records -----------------------------------------------------------" % len(media),
        "INSERT INTO media",
        "  (id, location_id, type, url, thumb_url, subject, description, era, pair_role,",
        "   credit, license, license_url, captured_at, source_url, sort_order)",
        "VALUES",
    ])
    values = []
    for row in media:
        values.append("  (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)" % (
            sql_literal(row["id"]), sql_literal(row["location_id"]), sql_literal(row["type"]),
            sql_literal(row["url"]), sql_literal(row["thumb_url"]), sql_literal(row["subject"]),
            sql_literal(row["caption"]), sql_literal(row["era"]), sql_literal(row["pair_role"]),
            sql_literal(row["credit"]), sql_literal(row["license"]), sql_literal(row["license_url"]),
            sql_literal(row["date"]), sql_literal(row["source_url"]), sql_literal(row["sort_order"])))
    lines.append(",\n".join(values) + ";")
    lines.extend(["", "COMMIT;", ""])

    with open(SQL_OUT, "w") as handle:
        handle.write("\n".join(lines))


# --------------------------------------------------------------------------
# TypeScript output
# --------------------------------------------------------------------------

def ts_literal(value):
    if value is None or value == "":
        return "undefined"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        return str(value)
    # Commons credit fields carry embedded newlines ("X.jpg: Author\nderivative
    # work: Author"), which would end the string literal mid-line.
    escaped = (
        str(value)
        .replace("\\", "\\\\")
        .replace("'", "\\'")
        .replace("\r\n", " ")
        .replace("\n", " ")
        .replace("\r", " ")
    )
    return "'" + re.sub(r"\s{2,}", " ", escaped).strip() + "'"


def write_ts(timeline, media):
    lines = [
        "import { MediaItem } from '../entities/media.entity';",
        "import { TimelineEvent } from '../entities/timeline-event.entity';",
        "",
        "/**",
        " * GENERATED FILE - do not edit by hand.",
        " *",
        " * Regenerate with:  python3 ai/scripts/export_seed_data.py",
        " *",
        " * Mirrors database/seed-generated.sql so the in-memory repositories serve",
        " * exactly the same timeline and media as PostgreSQL. Both are produced from",
        " * content/ai-ready/*-summary.md and content/media/media.json.",
        " */",
        "",
        "export const SEED_TIMELINE: TimelineEvent[] = [",
    ]
    for row in timeline:
        lines.append("  {")
        lines.append("    id: %s," % ts_literal(row["id"]))
        lines.append("    locationId: %s," % ts_literal(row["location_id"]))
        lines.append("    periodLabel: %s," % ts_literal(row["period_label"]))
        lines.append("    description: %s," % ts_literal(row["description"]))
        lines.append("    sortYear: %s," % ts_literal(row["sort_year"]))
        lines.append("    sortOrder: %s," % ts_literal(row["sort_order"]))
        lines.append("    isTradition: %s," % ts_literal(row["is_tradition"]))
        lines.append("    sourceFile: %s," % ts_literal(row["source_file"]))
        lines.append("  },")
    lines.extend(["];", "", "export const SEED_MEDIA: MediaItem[] = ["])
    for row in media:
        lines.append("  {")
        lines.append("    id: %s," % ts_literal(row["id"]))
        lines.append("    locationId: %s," % ts_literal(row["location_id"]))
        lines.append("    type: %s," % ts_literal(row["type"]))
        lines.append("    url: %s," % ts_literal(row["url"]))
        lines.append("    thumbUrl: %s," % ts_literal(row["thumb_url"]))
        lines.append("    subject: %s," % ts_literal(row["subject"]))
        lines.append("    description: %s," % ts_literal(row["caption"]))
        lines.append("    era: %s," % ts_literal(row["era"]))
        lines.append("    pairRole: %s," % ts_literal(row["pair_role"]))
        lines.append("    credit: %s," % ts_literal(row["credit"]))
        lines.append("    license: %s," % ts_literal(row["license"]))
        lines.append("    licenseUrl: %s," % ts_literal(row["license_url"]))
        lines.append("    capturedAt: %s," % ts_literal(row["date"]))
        lines.append("    sourceUrl: %s," % ts_literal(row["source_url"]))
        lines.append("    sortOrder: %s," % ts_literal(row["sort_order"]))
        lines.append("  },")
    lines.extend(["];", ""])

    with open(TS_OUT, "w") as handle:
        handle.write("\n".join(lines))


def main():
    timeline = collect_timeline()
    media = load_media()

    write_sql(timeline, media)
    write_ts(timeline, media)

    print("Generated from reviewed content:")
    print("  %-46s %3d timeline events, %2d media" % ("database/seed-generated.sql", len(timeline), len(media)))
    print("  %-46s same" % "backend/src/database/seed/generated-data.ts")
    for location_id in LOCATIONS:
        events = [row for row in timeline if row["location_id"] == location_id]
        images = [row for row in media if row["location_id"] == location_id]
        traditions = sum(1 for row in events if row["is_tradition"])
        print("    %-11s %2d events (%d flagged as tradition), %d images"
              % (location_id, len(events), traditions, len(images)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
