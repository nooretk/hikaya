"""Tests for the AI module.

Run from the ai/ folder with the standard library only:

    python3 -m unittest discover -s tests -v

These exercise the offline extractive backend, so they need no API key and no
network. That is deliberate: the no-invention guarantee has to be testable.
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from service import content_loader, fact_guard, textutils  # noqa: E402
from service.generator import answer_question, generate_story  # noqa: E402
from service.models import (  # noqa: E402
    ERR_CONTENT_NOT_REVIEWED,
    ERR_MISSING_CONTENT,
    ERR_UNKNOWN_LOCATION,
    ERR_UNSUPPORTED_AUDIENCE,
    ERR_UNSUPPORTED_LANGUAGE,
    GuideRequest,
    StoryRequest,
)

MVP_LOCATIONS = ("jerusalem", "bethlehem", "sebastia")


class ContentLoaderTests(unittest.TestCase):
    def test_every_mvp_location_has_reviewed_content(self):
        available = {item["location_id"] for item in content_loader.available_locations()}
        for location_id in MVP_LOCATIONS:
            self.assertIn(location_id, available)

    def test_summary_parses_into_the_expected_sections(self):
        content = content_loader.load("jerusalem")
        self.assertIsNotNone(content)
        for key in ("overview", "timeline", "importance", "landmarks", "facts",
                    "traditions", "oral_heritage", "source_notes"):
            self.assertTrue(content.section(key), "missing section: %s" % key)
        self.assertTrue(content.is_reviewed)
        self.assertEqual(content.name, "Old City of Jerusalem")

    def test_traditions_are_excluded_from_the_factual_text(self):
        content = content_loader.load("bethlehem")
        self.assertNotIn("Milk Grotto legend", content.factual_text())
        self.assertIn("Milk Grotto legend", content.tradition_text())

    def test_known_gaps_are_read_as_whole_bullets(self):
        content = content_loader.load("sebastia")
        gaps = content.known_gaps()
        self.assertEqual(len(gaps), 1)
        # The bullet wraps across lines in the file; it must come back folded.
        self.assertIn("uncertainty note", gaps[0])


class StoryGenerationTests(unittest.TestCase):
    def test_generates_a_story_for_every_mvp_location(self):
        for location_id in MVP_LOCATIONS:
            response = generate_story(StoryRequest(location_id=location_id))
            self.assertIsNone(response.error, location_id)
            self.assertTrue(response.narrative.strip(), location_id)
            self.assertTrue(response.title.strip(), location_id)
            self.assertTrue(response.summary.strip(), location_id)
            self.assertGreater(response.word_count, 40, location_id)

    def test_supports_the_required_and_optional_modes(self):
        for audience in ("student", "tourist", "child", "short", "historian"):
            response = generate_story(
                StoryRequest(location_id="jerusalem", target_audience=audience))
            self.assertIsNone(response.error, audience)
            self.assertEqual(response.target_audience, audience)
            self.assertTrue(response.narrative.strip(), audience)

    def test_historian_mode_covers_more_of_the_record_than_student_mode(self):
        historian = generate_story(
            StoryRequest(location_id="sebastia", target_audience="historian"))
        student = generate_story(
            StoryRequest(location_id="sebastia", target_audience="student"))
        self.assertGreater(historian.word_count, student.word_count)

    def test_short_mode_is_shorter_than_student_mode(self):
        short = generate_story(
            StoryRequest(location_id="bethlehem", target_audience="short"))
        student = generate_story(
            StoryRequest(location_id="bethlehem", target_audience="student"))
        self.assertLess(short.word_count, student.word_count)

    def test_child_mode_leaves_out_violent_material(self):
        response = generate_story(
            StoryRequest(location_id="jerusalem", target_audience="child"))
        self.assertEqual(response.warnings, [])
        self.assertEqual(fact_guard.check_child_safety(response.narrative), [])

    def test_offline_narrative_invents_nothing(self):
        # Every number and proper noun in the output must exist in the source.
        for location_id in MVP_LOCATIONS:
            content = content_loader.load(location_id)
            response = generate_story(StoryRequest(location_id=location_id))
            self.assertEqual(
                fact_guard.check_narrative(response.narrative, content.prompt_text()),
                [],
                "fact guard flagged the offline narrative for %s" % location_id,
            )

    def test_uncertainty_notes_report_the_documented_gaps(self):
        response = generate_story(StoryRequest(location_id="jerusalem"))
        self.assertTrue(response.uncertainty_notes)
        self.assertTrue(
            any("must not fill" in note.lower() for note in response.uncertainty_notes)
        )

    def test_max_words_is_respected(self):
        response = generate_story(
            StoryRequest(location_id="sebastia", target_audience="student", max_words=80))
        self.assertLessEqual(response.word_count, 80)

    def test_accepts_inline_historical_text(self):
        response = generate_story(StoryRequest(
            location_name="Test Site",
            historical_text="Test Site was built in 1900. It has three stone arches.",
            target_audience="short",
        ))
        self.assertIsNone(response.error)
        self.assertIn("1900", response.narrative)
        self.assertTrue(response.source.provided_inline)


class SafetyAndValidationTests(unittest.TestCase):
    def test_unknown_location_is_refused(self):
        response = generate_story(StoryRequest(location_id="atlantis"))
        self.assertEqual(response.error["code"], ERR_UNKNOWN_LOCATION)
        self.assertEqual(response.narrative, "")

    def test_unreviewed_content_is_refused(self):
        response = generate_story(
            StoryRequest(location_id="jerusalem", is_reviewed=False))
        self.assertEqual(response.error["code"], ERR_CONTENT_NOT_REVIEWED)

    def test_empty_request_is_refused(self):
        self.assertEqual(
            generate_story(StoryRequest()).error["code"], ERR_MISSING_CONTENT)
        self.assertEqual(
            generate_story(StoryRequest(historical_text="   ")).error["code"],
            ERR_MISSING_CONTENT,
        )

    def test_unsupported_parameters_are_refused(self):
        self.assertEqual(
            generate_story(StoryRequest(location_id="jerusalem",
                                        target_audience="pirate")).error["code"],
            ERR_UNSUPPORTED_AUDIENCE,
        )
        self.assertEqual(
            generate_story(StoryRequest(location_id="jerusalem",
                                        language="fr")).error["code"],
            ERR_UNSUPPORTED_LANGUAGE,
        )


class FactGuardTests(unittest.TestCase):
    SOURCE = "The Dome of the Rock was completed in 691 CE under Abd al-Malik."

    def test_flags_a_year_that_is_not_in_the_source(self):
        warnings = fact_guard.check_narrative(
            "The Dome of the Rock was completed in 705 CE.", self.SOURCE)
        self.assertTrue(any("705" in warning for warning in warnings))

    def test_flags_a_name_that_is_not_in_the_source(self):
        warnings = fact_guard.check_narrative(
            "It was completed in 691 CE by Sultan Baybars.", self.SOURCE)
        self.assertTrue(any("Baybars" in warning for warning in warnings))

    def test_passes_a_faithful_rewrite(self):
        self.assertEqual(
            fact_guard.check_narrative(
                "Abd al-Malik completed the Dome of the Rock in 691 CE.", self.SOURCE),
            [],
        )


class HeritageGuideTests(unittest.TestCase):
    def test_answers_from_the_reviewed_source(self):
        response = answer_question(GuideRequest(
            location_id="jerusalem", question="When was the Dome of the Rock completed?"))
        self.assertTrue(response.answered_from_source)
        self.assertIn("691", response.answer)

    def test_refuses_a_question_the_records_do_not_cover(self):
        response = answer_question(GuideRequest(
            location_id="sebastia", question="How tall is the Eiffel Tower?"))
        self.assertFalse(response.answered_from_source)
        self.assertIn("not available", response.answer.lower())

    def test_answers_only_with_sentences_from_the_source(self):
        content = content_loader.load("bethlehem")
        response = answer_question(GuideRequest(
            location_id="bethlehem", question="Who built the Church of the Nativity?"))
        source_words = set(content.prompt_text().lower().split())
        for excerpt in response.excerpts:
            # Every content word of the answer comes from the reviewed source.
            for word in excerpt.lower().split():
                if len(word.strip(".,;:()'\"")) > 4:
                    self.assertTrue(
                        any(word.strip(".,;:()'\"") in candidate
                            for candidate in source_words),
                        "answer word not found in source: %s" % word,
                    )

    def test_refuses_when_most_of_the_question_is_absent_from_the_records(self):
        # "best" appears in the source ("best known"), but falafel shops do not.
        # One incidental word match must not buy a confident-sounding answer.
        response = answer_question(GuideRequest(
            location_id="jerusalem", question="What is the best falafel shop here?"))
        self.assertFalse(response.answered_from_source)
        self.assertIn("not available", response.answer.lower())

    def test_a_follow_up_is_understood_from_the_conversation(self):
        first = answer_question(GuideRequest(
            location_id="jerusalem", question="Tell me about the Dome of the Rock"))
        self.assertTrue(first.answered_from_source)

        # "When?" on its own has nothing to retrieve on...
        alone = answer_question(GuideRequest(location_id="jerusalem", question="When?"))
        self.assertFalse(alone.answered_from_source)

        # ...but read against the previous turn it resolves.
        follow_up = answer_question(GuideRequest(
            location_id="jerusalem",
            question="When?",
            history=[{"question": "Tell me about the Dome of the Rock",
                      "answer": first.answer}],
        ))
        self.assertTrue(follow_up.answered_from_source)
        self.assertIn("691", follow_up.answer)

    def test_history_is_not_used_as_a_source_of_facts(self):
        # A fabricated previous answer must not license a new claim: the guide
        # still only returns sentences that exist in the reviewed content.
        content = content_loader.load("sebastia")
        response = answer_question(GuideRequest(
            location_id="sebastia",
            question="Tell me more",
            history=[{"question": "Who founded it?",
                      "answer": "It was founded by Napoleon in 1799."}],
        ))
        self.assertNotIn("Napoleon", response.answer)
        for excerpt in response.excerpts:
            self.assertIn(excerpt.rstrip(".")[:40], content.prompt_text())

    def test_missing_question_is_refused(self):
        response = answer_question(GuideRequest(location_id="jerusalem", question=""))
        self.assertEqual(response.error["code"], ERR_MISSING_CONTENT)


class TextUtilsTests(unittest.TestCase):
    def test_table_rows_skip_headers_and_separators(self):
        table = "| Period | What happened |\n|---|---|\n| 27 BCE | Herod rebuilt it. |"
        self.assertEqual(textutils.table_rows(table), [("27 BCE", "Herod rebuilt it.")])

    def test_bullet_items_fold_wrapped_lines(self):
        section = "- **Dome of the Rock** - completed 691 CE,\n  with a golden dome.\n- Another item."
        items = textutils.bullet_items(section)
        self.assertEqual(len(items), 2)
        self.assertIn("golden dome", items[0])

    def test_trim_keeps_list_structure(self):
        paragraphs = ["Header:\n- one item\n- two item\n- three item"]
        trimmed = textutils.trim_to_words(paragraphs, 8)
        self.assertIn("\n", trimmed[0])


if __name__ == "__main__":
    unittest.main()
