"""Audience modes for story generation.

Sprint 2 requires at least ``student`` and ``tourist``; ``child``, ``short`` and
``historian`` are the extra modes. ``general`` is the balanced default.

Each mode carries both the instruction given to a language model and the shape
used by the offline extractive generator, so the two backends produce
recognisably similar output.
"""

import re
from typing import Dict, List, NamedTuple


class AudienceMode(NamedTuple):
    key: str
    label: str
    # Instruction inserted into the LLM prompt.
    style: str
    # Target length band for the narrative, in words.
    min_words: int
    max_words: int
    # Which parts of the reviewed summary the offline generator draws on,
    # in the order they appear in the narrative.
    sections: List[str]
    # How many timeline entries / landmarks / facts the offline generator uses.
    timeline_items: int
    landmark_items: int
    fact_items: int


MODES = {
    "student": AudienceMode(
        key="student",
        label="Student",
        style=(
            "Write for a school or university student. Use a clear educational tone. "
            "Explain the sequence of periods and why each mattered. Keep sentences "
            "moderate in length and define unfamiliar terms using only the source."
        ),
        min_words=180,
        max_words=320,
        sections=["overview", "timeline", "importance", "landmarks"],
        timeline_items=6,
        landmark_items=4,
        fact_items=4,
    ),
    "tourist": AudienceMode(
        key="tourist",
        label="Tourist",
        style=(
            "Write for a visitor standing at the site. Be engaging and descriptive, "
            "and point out what there is to see. Mention the landmarks by name and "
            "what makes each one worth looking at, using only the source."
        ),
        min_words=160,
        max_words=300,
        sections=["overview", "landmarks", "importance", "timeline"],
        timeline_items=4,
        landmark_items=6,
        fact_items=4,
    ),
    "child": AudienceMode(
        key="child",
        label="Child-friendly",
        style=(
            "Write for a child of about 8 to 11. Use very short sentences and simple "
            "vocabulary, and a gentle tone. Avoid complex political or military "
            "detail, wars, and violence. Keep it warm and concrete."
        ),
        min_words=90,
        max_words=170,
        sections=["overview", "landmarks", "facts"],
        timeline_items=2,
        landmark_items=3,
        fact_items=3,
    ),
    "short": AudienceMode(
        key="short",
        label="Short summary",
        style=(
            "Write a short summary of no more than five sentences. State only the "
            "most important points. No scene-setting, no elaboration."
        ),
        min_words=45,
        max_words=110,
        sections=["overview", "facts"],
        timeline_items=2,
        landmark_items=2,
        fact_items=3,
    ),
    "historian": AudienceMode(
        key="historian",
        label="Historian",
        style=(
            "Write for a reader who already knows the period. Use precise "
            "terminology, keep the chronology explicit, name the sources of "
            "authority the content gives, and mark clearly where the record is "
            "an attribution rather than an established fact. Do not simplify."
        ),
        min_words=220,
        max_words=400,
        sections=["overview", "timeline", "importance", "landmarks", "facts"],
        timeline_items=12,
        landmark_items=5,
        fact_items=6,
    ),
    "general": AudienceMode(
        key="general",
        label="General audience",
        style=(
            "Write for a general adult reader. Keep the tone balanced and accessible, "
            "neither academic nor simplified."
        ),
        min_words=150,
        max_words=280,
        sections=["overview", "timeline", "landmarks", "importance"],
        timeline_items=5,
        landmark_items=4,
        fact_items=4,
    ),
}

# Words the child mode must not carry through from the source. Matched on whole
# words only, so "war" does not trigger on "warm" and "exile" does not trigger
# on "exiled" unless that form is listed.
CHILD_UNSAFE_TERMS = (
    "attack", "attacked", "attacks",
    "besieged", "siege", "sieges",
    "conquer", "conquered", "conquest",
    "crusade", "crusader", "crusaders",
    "defensive", "defences", "defense", "defenses",
    "deport", "deported", "deportation",
    "destroy", "destroyed", "destruction",
    "exile", "exiled",
    "kill", "killed", "killing", "killings",
    "massacre", "massacres",
    "militarily", "military",
    "occupation", "occupied", "occupy",
    "revolt", "revolts", "revolution",
    "violence", "violent",
    "war", "wars", "warfare",
)

_UNSAFE_RE = re.compile(
    r"\b(?:%s)\b" % "|".join(sorted(CHILD_UNSAFE_TERMS, key=len, reverse=True)),
    re.IGNORECASE,
)


def unsafe_terms_in(text):
    # type: (str) -> List[str]
    """Whole-word matches of the child-unsafe vocabulary, de-duplicated."""
    return sorted({match.group(0).lower() for match in _UNSAFE_RE.finditer(text)})


def has_unsafe_terms(text):
    # type: (str) -> bool
    return bool(_UNSAFE_RE.search(text))


TONE_STYLE = {
    "neutral": "Keep the tone plain and factual.",
    "educational": "Keep the tone explanatory, as a teacher would.",
    "emotional": "Allow warmth and feeling in the telling, without overstating.",
    "storytelling": "Tell it as a story, with a natural flow between periods.",
}


def get(audience):
    # type: (str) -> AudienceMode
    """Return the mode definition, defaulting to ``general``."""
    return MODES.get(audience, MODES["general"])


def describe():
    # type: () -> Dict[str, str]
    """Machine-readable list of modes, used by the service ``/modes`` endpoint."""
    return dict((key, mode.label) for key, mode in MODES.items())
