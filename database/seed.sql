-- =============================================================================
-- Hikaya - seed data for the Sprint 2 MVP
-- =============================================================================
-- Run after database/schema.sql:
--   psql -d hikaya -f database/seed.sql
--
-- Seeds the three MVP locations (Old City of Jerusalem, Bethlehem, Sebastia)
-- with categories, one reviewed story each, media metadata, and two approved
-- sample contributions.
--
-- Every fact below is taken from the reviewed content files in content/ and
-- their AI-ready summaries in content/ai-ready/. Nothing here is invented.
--
-- The script is re-runnable: it deletes the seeded rows first.
-- =============================================================================

BEGIN;

DELETE FROM quiz_questions;
DELETE FROM timeline_events;
DELETE FROM contributions;
DELETE FROM media;
DELETE FROM stories;
DELETE FROM location_categories;
DELETE FROM categories;
DELETE FROM locations;
DELETE FROM users WHERE email IN ('editor@hikaya.ps', 'content@hikaya.ps');

-- -----------------------------------------------------------------------------
-- users
-- -----------------------------------------------------------------------------
-- password_hash is intentionally NULL: no real credentials are committed to the
-- repository. Authentication is out of scope for the Sprint 2 MVP.
-- -----------------------------------------------------------------------------
INSERT INTO users (id, full_name, email, password_hash, role) VALUES
  ('user-editor',  'Hikaya Editorial Team',  'editor@hikaya.ps',  NULL, 'editor'),
  ('user-content', 'Content Documentation Team', 'content@hikaya.ps', NULL, 'editor');

-- -----------------------------------------------------------------------------
-- categories
-- -----------------------------------------------------------------------------
INSERT INTO categories (id, name, description) VALUES
  ('cat-historical',    'Historical Landmark',   'Sites whose main value is documented historical importance.'),
  ('cat-religious',     'Religious Landmark',    'Sites of religious significance to one or more faiths.'),
  ('cat-archaeological','Archaeological Site',   'Excavated sites with standing remains from earlier periods.'),
  ('cat-cultural',      'Cultural Heritage',     'Living heritage: crafts, markets, food, customs and oral memory.');

-- -----------------------------------------------------------------------------
-- locations
-- -----------------------------------------------------------------------------
INSERT INTO locations
  (id, name, arabic_name, city, country, latitude, longitude, description,
   cover_image_url, content_file, ai_summary_file, is_published)
VALUES
  (
    'jerusalem',
    'Old City of Jerusalem',
    'البلدة القديمة في القدس',
    'Jerusalem',
    'Palestine',
    31.778000,
    35.235400,
    'One of the oldest continuously inhabited cities in the world. Roughly 0.9 km² inside Ottoman walls built under Sultan Suleiman the Magnificent, with eight historic gates, four quarters, and more than 220 historical monuments. Inscribed on the UNESCO World Heritage List in 1981.',
    'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=1200',
    'content/oldCity.md',
    'content/ai-ready/old-city-jerusalem-summary.md',
    TRUE
  ),
  (
    'bethlehem',
    'Bethlehem',
    'بيت لحم',
    'Bethlehem',
    'Palestine',
    31.705400,
    35.202400,
    'A historic Palestinian city about 10 km south of Jerusalem, roughly 775 m above sea level. Known worldwide for the Church of the Nativity, completed around 339 CE and World Heritage listed in 2012, and for its olive-wood and mother-of-pearl crafts.',
    'https://images.unsplash.com/photo-1590076212879-11ef849646b5?auto=format&fit=crop&q=80&w=1200',
    'content/beth.md',
    'content/ai-ready/bethlehem-summary.md',
    TRUE
  ),
  (
    'sebastia',
    'Sebastia',
    'سبسطية',
    'Nablus',
    'Palestine',
    32.275800,
    35.197200,
    'An archaeological site about 12 km north-west of Nablus on a hill some 440 m above sea level. Capital of the northern Kingdom of Israel in the 9th century BCE, rebuilt by Herod the Great in 27 BCE and renamed after Emperor Augustus. Holds one of the best-preserved Roman streets in Palestine.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    'content/sebastia.md',
    'content/ai-ready/sebastia-summary.md',
    TRUE
  );

-- -----------------------------------------------------------------------------
-- location_categories
-- -----------------------------------------------------------------------------
INSERT INTO location_categories (location_id, category_id) VALUES
  ('jerusalem', 'cat-historical'),
  ('jerusalem', 'cat-religious'),
  ('jerusalem', 'cat-cultural'),
  ('bethlehem', 'cat-historical'),
  ('bethlehem', 'cat-religious'),
  ('bethlehem', 'cat-cultural'),
  ('sebastia',  'cat-archaeological'),
  ('sebastia',  'cat-historical'),
  ('sebastia',  'cat-cultural');

-- -----------------------------------------------------------------------------
-- stories
-- -----------------------------------------------------------------------------
-- One published story per location, written from the reviewed summaries and
-- checked by the editorial team. These are what GET /api/v1/stories/:locationId
-- returns before any new story is generated.
-- -----------------------------------------------------------------------------
INSERT INTO stories
  (id, location_id, author_id, title, summary, original_content, simplified_story,
   audience, language, tone, source, is_ai_generated, uncertainty_notes, status)
VALUES
  (
    'story-jerusalem-walls',
    'jerusalem',
    'user-editor',
    'The City Inside the Walls',
    'A walk through the Old City of Jerusalem, from its Canaanite beginnings to the Ottoman walls that still frame it today.',
    'content/ai-ready/old-city-jerusalem-summary.md',
    E'Step through Damascus Gate and you step into less than one square kilometre that has been lived in for thousands of years.\n\nThe Canaanites are believed to have founded the city, choosing high ground near the trade routes and drawing their water from the Gihon Spring. After them came empire after empire. The Babylonian king Nebuchadnezzar II destroyed the First Temple in 586 BCE. The Persians allowed a return, and the Second Temple rose around 516 BCE. Rome arrived in 63 BCE, and in 70 CE Titus destroyed the Second Temple, leaving the retaining wall known today as al-Buraq Wall, or the Western Wall.\n\nWhen Caliph Umar ibn al-Khattab entered the city in 638 CE, he came peacefully, at the request of Patriarch Sophronius, and issued a covenant guaranteeing the inhabitants their lives, their property and their places of worship. Half a century later the Dome of the Rock was completed, in 691-692 CE, and its golden dome has stood over the city ever since.\n\nThe walls you see now are younger than much of what they enclose: Sultan Suleiman the Magnificent rebuilt them in the 16th century. Inside them are four quarters, eight gates, more than 220 monuments, and markets like Khan al-Zeit where spices, olive oil, Nabulsi soap and embroidered cloth are still sold as they have been for centuries.\n\nUNESCO inscribed the Old City and its walls in 1981, and added them to the List of World Heritage in Danger in 1982.',
    'general',
    'en',
    'storytelling',
    'content/oldCity.md',
    FALSE,
    '{}',
    'published'
  ),
  (
    'story-bethlehem-nativity',
    'bethlehem',
    'user-editor',
    'The House of Bread',
    'How a Canaanite hill town 10 km south of Jerusalem became one of the most visited places on earth.',
    'content/ai-ready/bethlehem-summary.md',
    E'The name is Canaanite. "Bayt" means house or place; the second half is read by some researchers as an old Canaanite deity named Lakhm, and by others as "bread" - the house of bread.\n\nArchaeology places people here in the second millennium BCE, farming olives and vines, herding sheep, and trading along the routes that linked Jerusalem and Hebron to the south. What changed everything was a building. In the fourth century CE, Emperor Constantine I and his mother Helena ordered a church raised over the grotto that Christian tradition identifies as the birthplace of Jesus. It was finished around 339 CE, and Justinian I rebuilt parts of it in the sixth century after damage.\n\nEvery era that followed left its mark on that church and the town around it. The Crusaders restored it with mosaics and wall paintings and made Bethlehem a stop on the pilgrimage road. After Salah al-Din''s victory at Hattin in 1187 the city passed to Ayyubid rule, and the church kept working. Four Ottoman centuries brought olive groves, vineyards, almond orchards, and the olive-wood carving craft the city is still known for.\n\nWalk from Manger Square today and you pass the Mosque of Omar, built in the 19th century and named for the caliph who chose not to pray inside the church so it would remain a church. That is the coexistence Bethlehem is remembered for.\n\nThe Church of the Nativity and the Pilgrimage Route were inscribed by UNESCO in 2012, and removed from the danger list in 2019 once the conservation work was done.',
    'general',
    'en',
    'storytelling',
    'content/beth.md',
    FALSE,
    '{}',
    'published'
  ),
  (
    'story-sebastia-columns',
    'sebastia',
    'user-editor',
    'A Street of Columns Above the Olive Groves',
    'Sebastia gathers Canaanite, Roman, Byzantine, Crusader and Islamic remains on a single hill near Nablus.',
    'content/ai-ready/sebastia-summary.md',
    E'Twelve kilometres north-west of Nablus, on a hill about 440 metres high, one site holds the leftovers of nearly every civilisation that passed through Palestine.\n\nCanaanites settled here in the second millennium BCE, using the height to guard the trade routes and storing water in wells and cisterns. By the 9th century BCE the town, then called Shomron - Samaria - was the capital of the northern Kingdom of Israel. In 27 BCE Herod the Great rebuilt it and gave it the name it still carries: Sebastia, the Greek form of the title of the emperor Augustus, whom he honoured with a temple here.\n\nRome left the most visible ruins - a long colonnaded street lined with two rows of massive columns that once carried porticoes for merchants, and a semi-circular theatre on the eastern side. The Byzantines built a cathedral at the site associated with John the Baptist. The Crusaders rebuilt it larger and turned the town into a pilgrim stop. Under the Mamluks part of that same building became the Mosque of Nabi Yahya, which is why Christians and Muslims both hold the site in regard.\n\nUnder the Ottomans, Sebastia settled back into being a village of olives, figs, grapes and almonds - and European travellers kept arriving to describe the ruins in their books.\n\nThe olive groves still run right up to the columns. That is the thing worth noticing here: the site was never abandoned to become a museum. People kept living in it.',
    'general',
    'en',
    'storytelling',
    'content/sebastia.md',
    FALSE,
    '{}',
    'published'
  );

-- -----------------------------------------------------------------------------
-- media and timeline_events
-- -----------------------------------------------------------------------------
-- Both are GENERATED from the reviewed content, so they live in
-- database/seed-generated.sql rather than here. Run it after this file:
--
--   psql -d hikaya -f database/seed-generated.sql
--
-- Regenerate it after editing content/ai-ready/*.md or content/media/media.json:
--
--   python3 ai/scripts/export_seed_data.py
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- quiz_questions
-- -----------------------------------------------------------------------------
-- Short comprehension questions shown after a story. Every answer is stated in
-- the reviewed content, and `source_note` says where, so a reader who disagrees
-- can check rather than take the app's word for it.
-- -----------------------------------------------------------------------------
INSERT INTO quiz_questions
  (id, location_id, question, options, answer_index, explanation, source_note, sort_order)
VALUES
  ('quiz-jer-1', 'jerusalem',
   'When was the Dome of the Rock completed?',
   ARRAY['335 CE', '638 CE', '691-692 CE', '1099 CE'], 2,
   'It was built by order of the Umayyad Caliph Abd al-Malik ibn Marwan and completed in 691-692 CE.',
   'Timeline, Umayyad era - content/ai-ready/old-city-jerusalem-summary.md', 0),
  ('quiz-jer-2', 'jerusalem',
   'Who rebuilt the walls that surround the Old City today?',
   ARRAY['Herod the Great', 'Emperor Constantine I', 'Caliph Umar ibn al-Khattab', 'Sultan Suleiman the Magnificent'], 3,
   'The present walls were rebuilt in the 16th century CE under the Ottoman Sultan Suleiman the Magnificent. Much of what they enclose is far older.',
   'Short overview and timeline, Ottoman era', 1),
  ('quiz-jer-3', 'jerusalem',
   'How many quarters does the Old City contain?',
   ARRAY['Two', 'Three', 'Four', 'Eight'], 2,
   'Four: the Muslim, Christian, Armenian and Jewish quarters. Eight is the number of historic gates.',
   'Important facts', 2),
  ('quiz-jer-4', 'jerusalem',
   'When did Caliph Umar ibn al-Khattab enter Jerusalem?',
   ARRAY['638 CE', '691 CE', '1099 CE', '1187 CE'], 0,
   'He entered peacefully in 638 CE at the request of Patriarch Sophronius, and issued a covenant guaranteeing the inhabitants their lives, property and places of worship.',
   'Timeline, Islamic conquest', 3),

  ('quiz-bet-1', 'bethlehem',
   'Who ordered the building of the Church of the Nativity?',
   ARRAY['Justinian I', 'Constantine I and his mother Helena', 'Salah al-Din al-Ayyubi', 'Herod the Great'], 1,
   'Constantine I and Helena ordered it in the 4th century CE; it was completed around 339 CE. Justinian I rebuilt parts of it in the 6th century after damage.',
   'Timeline and main landmarks - content/ai-ready/bethlehem-summary.md', 0),
  ('quiz-bet-2', 'bethlehem',
   'Roughly how far is Bethlehem from Jerusalem?',
   ARRAY['About 2 km', 'About 10 km', 'About 40 km', 'About 100 km'], 1,
   'About 10 km south of Jerusalem, on a plateau roughly 775 m above sea level.',
   'Short overview and important facts', 1),
  ('quiz-bet-3', 'bethlehem',
   'Which crafts is Bethlehem best known for?',
   ARRAY['Glassblowing and pottery', 'Olive-wood carving and mother-of-pearl', 'Carpet weaving', 'Copper engraving'], 1,
   'Olive-wood objects and mother-of-pearl work, alongside Palestinian embroidery.',
   'Cultural and religious importance', 2),
  ('quiz-bet-4', 'bethlehem',
   'In which year was the Church of the Nativity removed from UNESCO''s List of World Heritage in Danger?',
   ARRAY['2012', '2015', '2019', 'It is still on the list'], 2,
   'It was inscribed on the World Heritage List in 2012 and removed from the danger list in 2019, once the required conservation work was completed.',
   'Timeline, 2012 and 2019 entries', 3),

  ('quiz-seb-1', 'sebastia',
   'Who rebuilt the city in 27 BCE and gave it the name Sebastia?',
   ARRAY['Pompey', 'Herod the Great', 'Emperor Augustus', 'Alexander the Great'], 1,
   'Herod the Great rebuilt it and named it Sebastia, the Greek form of the title of the emperor Augustus, in his honour.',
   'Timeline, 27 BCE - content/ai-ready/sebastia-summary.md', 0),
  ('quiz-seb-2', 'sebastia',
   'What was the city called before it was named Sebastia?',
   ARRAY['Shomron (Samaria)', 'Neapolis', 'Caesarea', 'Sebaste'], 0,
   'Its ancient Canaanite name was Shomron - Samaria - and it was the capital of the northern Kingdom of Israel in the 9th century BCE.',
   'Timeline, 9th century BCE', 1),
  ('quiz-seb-3', 'sebastia',
   'The Mosque of Nabi Yahya was converted from which building?',
   ARRAY['A Roman temple', 'A Byzantine cathedral rebuilt by the Crusaders', 'An Ottoman caravanserai', 'A Canaanite storehouse'], 1,
   'A cathedral was built in the Byzantine period at the site associated with John the Baptist, rebuilt by the Crusaders, and partly converted into the Mosque of Nabi Yahya under the Mamluks.',
   'Main landmarks and timeline, Ayyubid and Mamluk eras', 2),
  ('quiz-seb-4', 'sebastia',
   'Which Roman structure at Sebastia is among the best preserved in Palestine?',
   ARRAY['The aqueduct', 'The bath house', 'The colonnaded street', 'The city forum'], 2,
   'The colonnaded street, flanked by two rows of massive columns that once carried porticoes for merchants.',
   'Important facts and main landmarks', 3);

-- -----------------------------------------------------------------------------
-- contributions
-- -----------------------------------------------------------------------------
-- Two approved sample contributions so the "Living Memories" view is not empty
-- on a fresh install. New submissions from POST /api/v1/contributions always
-- arrive as 'pending_review'.
-- -----------------------------------------------------------------------------
INSERT INTO contributions
  (id, reference_code, location_id, user_id, category_id, title, content, contributor_name,
   contributor_email, media_url, status, review_notes, reviewed_at, submitted_at)
VALUES
  (
    'contribution-sample-1',
    'HK-SAMPLE1',
    'jerusalem',
    NULL,
    'cat-cultural',
    'Friday mornings at Damascus Gate',
    'My grandfather used to take me to Damascus Gate every Friday morning. We would walk through the stone alleys of the market, past the spice sellers, until we reached the sweet shops. For me the Old City is not only history - it is that smell, and the sound of families sitting together on old steps.',
    'Amra Sawalha',
    NULL,
    NULL,
    'approved',
    'Personal memory, no historical claims. Approved as oral heritage.',
    NOW(),
    NOW() - INTERVAL '20 days'
  ),
  (
    'contribution-sample-2',
    'HK-SAMPLE2',
    'bethlehem',
    NULL,
    'cat-cultural',
    'The old olive press in Beit Jala',
    'In our neighbourhood in Beit Jala, next to Bethlehem, there is an old stone olive press still in use. Every harvest the whole neighbourhood gathers to press the olives they picked by hand. The smell of the first oil coming off the stone wheel is what home smells like.',
    'Joud Abu Omar',
    NULL,
    NULL,
    'approved',
    'Personal memory, no historical claims. Approved as oral heritage.',
    NOW(),
    NOW() - INTERVAL '19 days'
  );

COMMIT;

-- -----------------------------------------------------------------------------
-- Quick verification
-- -----------------------------------------------------------------------------
--   SELECT id, name, city FROM locations ORDER BY id;
--   SELECT location_id, title, status FROM stories ORDER BY location_id;
--   SELECT location_id, COUNT(*) FROM media GROUP BY location_id;
-- -----------------------------------------------------------------------------
