"""Prompt construction for the Hikaya AI module.

Implements Section 4 of ``ai/narrative-generation-workflow.md``. The system
instruction is fixed and not user-editable; only the source content and the
generation parameters vary.
"""

from typing import Dict, List, Optional

from . import audiences

SYSTEM_PROMPT = """You are the Hikaya AI Storyteller. Your task is to turn verified \
historical and cultural content about Palestinian locations into a short, engaging \
narrative.

STRICT RULES:
1. Use ONLY the facts given in the "Source Content" section below.
2. Do NOT add names, dates, numbers, or events that are not explicitly stated in the
   Source Content.
3. If the Source Content does not contain enough information to complete a request,
   say so clearly instead of guessing.
4. Content under "RELIGIOUS TRADITIONS" or "ORAL HERITAGE" must always be attributed
   ("according to Christian tradition", "a popular account says"). Never present it as
   established historical fact.
5. Adjust tone and vocabulary to match the requested audience and tone.
6. Write in the requested language.
7. Keep the narrative respectful, culturally sensitive, and factually grounded.

OUTPUT FORMAT - return exactly these four labelled blocks, nothing else:
TITLE: <a suggested title, one line>
SUMMARY: <one sentence>
NARRATIVE: <the narrative>
UNCERTAINTY: <one note per line, or the single word NONE>"""

GUIDE_SYSTEM_PROMPT = """You are the Hikaya AI Heritage Guide. Answer the user's \
question using ONLY the Source Content provided.

STRICT RULES:
1. If the answer is not contained in the Source Content, reply that this information is
   not available in the current records. Do not guess and do not use outside knowledge.
2. Religious traditions and oral heritage must be attributed, never asserted as fact.
3. Keep the answer short and direct.

OUTPUT FORMAT - return exactly these three labelled blocks, nothing else:
ANSWER: <the answer>
FROM_SOURCE: <YES if the source contained the answer, NO if it did not>
EXCERPT: <the sentence from the source you relied on, or NONE>"""


def build_story_prompt(content_text, location_name, audience, language, tone,
                       max_words=None, known_gaps=None):
    # type: (str, str, str, str, str, Optional[int], Optional[List[str]]) -> str
    """Populate the per-request user prompt (workflow doc, Section 4.2)."""
    mode = audiences.get(audience)
    word_ceiling = max_words or mode.max_words
    tone_style = audiences.TONE_STYLE.get(tone, audiences.TONE_STYLE["storytelling"])

    parts = [
        "Location: %s" % location_name,
        "Target Audience: %s" % mode.label,
        "Language: %s" % language,
        "Tone: %s" % tone,
        "",
        "Audience style: %s" % mode.style,
        "Tone style: %s" % tone_style,
        "Length: between %d and %d words." % (mode.min_words, word_ceiling),
    ]

    if audience == "child":
        parts.append(
            "Child-safety rule: leave out sieges, killings, destruction, wars and "
            "military detail entirely, even though they appear in the source."
        )

    if known_gaps:
        parts.append("")
        parts.append("Known gaps in the source - do not fill these, flag them instead:")
        for gap in known_gaps:
            parts.append("- %s" % gap)

    parts.extend([
        "",
        'Source Content (reviewed, use only this):',
        '"""',
        content_text,
        '"""',
        "",
        "Task: write the narrative for the target audience in the requested tone and "
        "language, then give a one-sentence summary, a suggested title, and any "
        "uncertainty notes where the source leaves gaps that the request needed.",
    ])
    return "\n".join(parts)


def build_guide_prompt(content_text, location_name, question, language, history=None):
    # type: (str, str, str, str, Optional[List[Dict[str, str]]]) -> str
    """Populate the Heritage Guide Q&A prompt (workflow doc, Section 4.3).

    Earlier turns are included so a follow-up question can be understood, with
    an explicit instruction that they are context only - the answer still has to
    come out of the Source Content.
    """
    parts = [
        "Location: %s" % location_name,
        "Language: %s" % language,
    ]

    if history:
        parts.extend([
            "",
            "Conversation so far (context only - NOT a source of facts):",
        ])
        for turn in history:
            parts.append("  Visitor: %s" % turn.get("question", ""))
            parts.append("  Guide: %s" % turn.get("answer", ""))

    parts.extend([
        "",
        "Source Content (reviewed, use only this):",
        '"""',
        content_text,
        '"""',
        "",
        "User Question: %s" % question,
    ])
    return "\n".join(parts)
