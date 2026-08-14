import { Contribution } from '../entities/contribution.entity';
import { Location } from '../entities/location.entity';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { Story } from '../entities/story.entity';

/**
 * In-memory mirror of database/seed.sql.
 *
 * The backend runs without PostgreSQL: when DATABASE_URL is unset or the server
 * is unreachable, the in-memory repositories serve this data instead, so every
 * endpoint still returns real seeded content rather than placeholders.
 *
 * Keep this file and database/seed.sql in step when either changes. The
 * timeline and media seeds are NOT here: they are generated into
 * generated-data.ts from the content files by ai/scripts/export_seed_data.py.
 */

export const SEED_LOCATIONS: Location[] = [
  {
    id: 'jerusalem',
    name: 'Old City of Jerusalem',
    arabicName: 'البلدة القديمة في القدس',
    city: 'Jerusalem',
    country: 'Palestine',
    latitude: 31.778,
    longitude: 35.2354,
    description:
      'One of the oldest continuously inhabited cities in the world. Roughly 0.9 km² inside Ottoman walls built under Sultan Suleiman the Magnificent, with eight historic gates, four quarters, and more than 220 historical monuments. Inscribed on the UNESCO World Heritage List in 1981.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=1200',
    contentFile: 'content/oldCity.md',
    aiSummaryFile: 'content/ai-ready/old-city-jerusalem-summary.md',
    categories: [
      'Historical Landmark',
      'Religious Landmark',
      'Cultural Heritage',
    ],
    isPublished: true,
  },
  {
    id: 'bethlehem',
    name: 'Bethlehem',
    arabicName: 'بيت لحم',
    city: 'Bethlehem',
    country: 'Palestine',
    latitude: 31.7054,
    longitude: 35.2024,
    description:
      'A historic Palestinian city about 10 km south of Jerusalem, roughly 775 m above sea level. Known worldwide for the Church of the Nativity, completed around 339 CE and World Heritage listed in 2012, and for its olive-wood and mother-of-pearl crafts.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1590076212879-11ef849646b5?auto=format&fit=crop&q=80&w=1200',
    contentFile: 'content/beth.md',
    aiSummaryFile: 'content/ai-ready/bethlehem-summary.md',
    categories: [
      'Historical Landmark',
      'Religious Landmark',
      'Cultural Heritage',
    ],
    isPublished: true,
  },
  {
    id: 'sebastia',
    name: 'Sebastia',
    arabicName: 'سبسطية',
    city: 'Nablus',
    country: 'Palestine',
    latitude: 32.2758,
    longitude: 35.1972,
    description:
      'An archaeological site about 12 km north-west of Nablus on a hill some 440 m above sea level. Capital of the northern Kingdom of Israel in the 9th century BCE, rebuilt by Herod the Great in 27 BCE and renamed after Emperor Augustus. Holds one of the best-preserved Roman streets in Palestine.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    contentFile: 'content/sebastia.md',
    aiSummaryFile: 'content/ai-ready/sebastia-summary.md',
    categories: [
      'Archaeological Site',
      'Historical Landmark',
      'Cultural Heritage',
    ],
    isPublished: true,
  },
];

export const SEED_STORIES: Story[] = [
  {
    id: 'story-jerusalem-walls',
    locationId: 'jerusalem',
    authorId: 'user-editor',
    title: 'The City Inside the Walls',
    summary:
      'A walk through the Old City of Jerusalem, from its Canaanite beginnings to the Ottoman walls that still frame it today.',
    originalContent: 'content/ai-ready/old-city-jerusalem-summary.md',
    simplifiedStory: [
      'Step through Damascus Gate and you step into less than one square kilometre that has been lived in for thousands of years.',
      '',
      'The Canaanites are believed to have founded the city, choosing high ground near the trade routes and drawing their water from the Gihon Spring. After them came empire after empire. The Babylonian king Nebuchadnezzar II destroyed the First Temple in 586 BCE. The Persians allowed a return, and the Second Temple rose around 516 BCE. Rome arrived in 63 BCE, and in 70 CE Titus destroyed the Second Temple, leaving the retaining wall known today as al-Buraq Wall, or the Western Wall.',
      '',
      'When Caliph Umar ibn al-Khattab entered the city in 638 CE, he came peacefully, at the request of Patriarch Sophronius, and issued a covenant guaranteeing the inhabitants their lives, their property and their places of worship. Half a century later the Dome of the Rock was completed, in 691-692 CE, and its golden dome has stood over the city ever since.',
      '',
      'The walls you see now are younger than much of what they enclose: Sultan Suleiman the Magnificent rebuilt them in the 16th century. Inside them are four quarters, eight gates, more than 220 monuments, and markets like Khan al-Zeit where spices, olive oil, Nabulsi soap and embroidered cloth are still sold as they have been for centuries.',
      '',
      'UNESCO inscribed the Old City and its walls in 1981, and added them to the List of World Heritage in Danger in 1982.',
    ].join('\n'),
    audience: 'general',
    language: 'en',
    tone: 'storytelling',
    source: 'content/oldCity.md',
    isAiGenerated: false,
    uncertaintyNotes: [],
    status: 'published',
  },
  {
    id: 'story-bethlehem-nativity',
    locationId: 'bethlehem',
    authorId: 'user-editor',
    title: 'The House of Bread',
    summary:
      'How a Canaanite hill town 10 km south of Jerusalem became one of the most visited places on earth.',
    originalContent: 'content/ai-ready/bethlehem-summary.md',
    simplifiedStory: [
      'The name is Canaanite. "Bayt" means house or place; the second half is read by some researchers as an old Canaanite deity named Lakhm, and by others as "bread" - the house of bread.',
      '',
      'Archaeology places people here in the second millennium BCE, farming olives and vines, herding sheep, and trading along the routes that linked Jerusalem and Hebron to the south. What changed everything was a building. In the fourth century CE, Emperor Constantine I and his mother Helena ordered a church raised over the grotto that Christian tradition identifies as the birthplace of Jesus. It was finished around 339 CE, and Justinian I rebuilt parts of it in the sixth century after damage.',
      '',
      "Every era that followed left its mark on that church and the town around it. The Crusaders restored it with mosaics and wall paintings and made Bethlehem a stop on the pilgrimage road. After Salah al-Din's victory at Hattin in 1187 the city passed to Ayyubid rule, and the church kept working. Four Ottoman centuries brought olive groves, vineyards, almond orchards, and the olive-wood carving craft the city is still known for.",
      '',
      'Walk from Manger Square today and you pass the Mosque of Omar, built in the 19th century and named for the caliph who chose not to pray inside the church so it would remain a church. That is the coexistence Bethlehem is remembered for.',
      '',
      'The Church of the Nativity and the Pilgrimage Route were inscribed by UNESCO in 2012, and removed from the danger list in 2019 once the conservation work was done.',
    ].join('\n'),
    audience: 'general',
    language: 'en',
    tone: 'storytelling',
    source: 'content/beth.md',
    isAiGenerated: false,
    uncertaintyNotes: [],
    status: 'published',
  },
  {
    id: 'story-sebastia-columns',
    locationId: 'sebastia',
    authorId: 'user-editor',
    title: 'A Street of Columns Above the Olive Groves',
    summary:
      'Sebastia gathers Canaanite, Roman, Byzantine, Crusader and Islamic remains on a single hill near Nablus.',
    originalContent: 'content/ai-ready/sebastia-summary.md',
    simplifiedStory: [
      'Twelve kilometres north-west of Nablus, on a hill about 440 metres high, one site holds the leftovers of nearly every civilisation that passed through Palestine.',
      '',
      'Canaanites settled here in the second millennium BCE, using the height to guard the trade routes and storing water in wells and cisterns. By the 9th century BCE the town, then called Shomron - Samaria - was the capital of the northern Kingdom of Israel. In 27 BCE Herod the Great rebuilt it and gave it the name it still carries: Sebastia, the Greek form of the title of the emperor Augustus, whom he honoured with a temple here.',
      '',
      'Rome left the most visible ruins - a long colonnaded street lined with two rows of massive columns that once carried porticoes for merchants, and a semi-circular theatre on the eastern side. The Byzantines built a cathedral at the site associated with John the Baptist. The Crusaders rebuilt it larger and turned the town into a pilgrim stop. Under the Mamluks part of that same building became the Mosque of Nabi Yahya, which is why Christians and Muslims both hold the site in regard.',
      '',
      'Under the Ottomans, Sebastia settled back into being a village of olives, figs, grapes and almonds - and European travellers kept arriving to describe the ruins in their books.',
      '',
      'The olive groves still run right up to the columns. That is the thing worth noticing here: the site was never abandoned to become a museum. People kept living in it.',
    ].join('\n'),
    audience: 'general',
    language: 'en',
    tone: 'storytelling',
    source: 'content/sebastia.md',
    isAiGenerated: false,
    uncertaintyNotes: [],
    status: 'published',
  },
];

export const SEED_CONTRIBUTIONS: Contribution[] = [
  {
    id: 'contribution-sample-1',
    referenceCode: 'HK-SAMPLE1',
    locationId: 'jerusalem',
    userId: null,
    categoryId: 'cat-cultural',
    title: 'Friday mornings at Damascus Gate',
    content:
      'My grandfather used to take me to Damascus Gate every Friday morning. We would walk through the stone alleys of the market, past the spice sellers, until we reached the sweet shops. For me the Old City is not only history - it is that smell, and the sound of families sitting together on old steps.',
    contributorName: 'Amra Sawalha',
    status: 'approved',
    reviewNotes:
      'Personal memory, no historical claims. Approved as oral heritage.',
    reviewedAt: new Date('2026-07-18T00:00:00Z'),
    submittedAt: new Date('2026-07-17T00:00:00Z'),
  },
  {
    id: 'contribution-sample-2',
    referenceCode: 'HK-SAMPLE2',
    locationId: 'bethlehem',
    userId: null,
    categoryId: 'cat-cultural',
    title: 'The old olive press in Beit Jala',
    content:
      'In our neighbourhood in Beit Jala, next to Bethlehem, there is an old stone olive press still in use. Every harvest the whole neighbourhood gathers to press the olives they picked by hand. The smell of the first oil coming off the stone wheel is what home smells like.',
    contributorName: 'Joud Abu Omar',
    status: 'approved',
    reviewNotes:
      'Personal memory, no historical claims. Approved as oral heritage.',
    reviewedAt: new Date('2026-07-19T00:00:00Z'),
    submittedAt: new Date('2026-07-18T00:00:00Z'),
  },
];

/**
 * Mirror of the quiz_questions rows in database/seed.sql.
 *
 * Every answer is stated in the reviewed content, and `sourceNote` says where,
 * so a reader who disagrees can check rather than take the app's word for it.
 */
export const SEED_QUIZ: QuizQuestion[] = [
  {
    id: 'quiz-jer-1',
    locationId: 'jerusalem',
    question: 'When was the Dome of the Rock completed?',
    options: ['335 CE', '638 CE', '691-692 CE', '1099 CE'],
    answerIndex: 2,
    explanation:
      'It was built by order of the Umayyad Caliph Abd al-Malik ibn Marwan and completed in 691-692 CE.',
    sourceNote:
      'Timeline, Umayyad era - content/ai-ready/old-city-jerusalem-summary.md',
    sortOrder: 0,
  },
  {
    id: 'quiz-jer-2',
    locationId: 'jerusalem',
    question: 'Who rebuilt the walls that surround the Old City today?',
    options: [
      'Herod the Great',
      'Emperor Constantine I',
      'Caliph Umar ibn al-Khattab',
      'Sultan Suleiman the Magnificent',
    ],
    answerIndex: 3,
    explanation:
      'The present walls were rebuilt in the 16th century CE under the Ottoman Sultan Suleiman the Magnificent. Much of what they enclose is far older.',
    sourceNote: 'Short overview and timeline, Ottoman era',
    sortOrder: 1,
  },
  {
    id: 'quiz-jer-3',
    locationId: 'jerusalem',
    question: 'How many quarters does the Old City contain?',
    options: ['Two', 'Three', 'Four', 'Eight'],
    answerIndex: 2,
    explanation:
      'Four: the Muslim, Christian, Armenian and Jewish quarters. Eight is the number of historic gates.',
    sourceNote: 'Important facts',
    sortOrder: 2,
  },
  {
    id: 'quiz-jer-4',
    locationId: 'jerusalem',
    question: 'When did Caliph Umar ibn al-Khattab enter Jerusalem?',
    options: ['638 CE', '691 CE', '1099 CE', '1187 CE'],
    answerIndex: 0,
    explanation:
      'He entered peacefully in 638 CE at the request of Patriarch Sophronius, and issued a covenant guaranteeing the inhabitants their lives, property and places of worship.',
    sourceNote: 'Timeline, Islamic conquest',
    sortOrder: 3,
  },
  {
    id: 'quiz-bet-1',
    locationId: 'bethlehem',
    question: 'Who ordered the building of the Church of the Nativity?',
    options: [
      'Justinian I',
      'Constantine I and his mother Helena',
      'Salah al-Din al-Ayyubi',
      'Herod the Great',
    ],
    answerIndex: 1,
    explanation:
      'Constantine I and Helena ordered it in the 4th century CE; it was completed around 339 CE. Justinian I rebuilt parts of it in the 6th century after damage.',
    sourceNote:
      'Timeline and main landmarks - content/ai-ready/bethlehem-summary.md',
    sortOrder: 0,
  },
  {
    id: 'quiz-bet-2',
    locationId: 'bethlehem',
    question: 'Roughly how far is Bethlehem from Jerusalem?',
    options: ['About 2 km', 'About 10 km', 'About 40 km', 'About 100 km'],
    answerIndex: 1,
    explanation:
      'About 10 km south of Jerusalem, on a plateau roughly 775 m above sea level.',
    sourceNote: 'Short overview and important facts',
    sortOrder: 1,
  },
  {
    id: 'quiz-bet-3',
    locationId: 'bethlehem',
    question: 'Which crafts is Bethlehem best known for?',
    options: [
      'Glassblowing and pottery',
      'Olive-wood carving and mother-of-pearl',
      'Carpet weaving',
      'Copper engraving',
    ],
    answerIndex: 1,
    explanation:
      'Olive-wood objects and mother-of-pearl work, alongside Palestinian embroidery.',
    sourceNote: 'Cultural and religious importance',
    sortOrder: 2,
  },
  {
    id: 'quiz-bet-4',
    locationId: 'bethlehem',
    question:
      "In which year was the Church of the Nativity removed from UNESCO's List of World Heritage in Danger?",
    options: ['2012', '2015', '2019', 'It is still on the list'],
    answerIndex: 2,
    explanation:
      'It was inscribed on the World Heritage List in 2012 and removed from the danger list in 2019, once the required conservation work was completed.',
    sourceNote: 'Timeline, 2012 and 2019 entries',
    sortOrder: 3,
  },
  {
    id: 'quiz-seb-1',
    locationId: 'sebastia',
    question: 'Who rebuilt the city in 27 BCE and gave it the name Sebastia?',
    options: [
      'Pompey',
      'Herod the Great',
      'Emperor Augustus',
      'Alexander the Great',
    ],
    answerIndex: 1,
    explanation:
      'Herod the Great rebuilt it and named it Sebastia, the Greek form of the title of the emperor Augustus, in his honour.',
    sourceNote: 'Timeline, 27 BCE - content/ai-ready/sebastia-summary.md',
    sortOrder: 0,
  },
  {
    id: 'quiz-seb-2',
    locationId: 'sebastia',
    question: 'What was the city called before it was named Sebastia?',
    options: ['Shomron (Samaria)', 'Neapolis', 'Caesarea', 'Sebaste'],
    answerIndex: 0,
    explanation:
      'Its ancient Canaanite name was Shomron - Samaria - and it was the capital of the northern Kingdom of Israel in the 9th century BCE.',
    sourceNote: 'Timeline, 9th century BCE',
    sortOrder: 1,
  },
  {
    id: 'quiz-seb-3',
    locationId: 'sebastia',
    question: 'The Mosque of Nabi Yahya was converted from which building?',
    options: [
      'A Roman temple',
      'A Byzantine cathedral rebuilt by the Crusaders',
      'An Ottoman caravanserai',
      'A Canaanite storehouse',
    ],
    answerIndex: 1,
    explanation:
      'A cathedral was built in the Byzantine period at the site associated with John the Baptist, rebuilt by the Crusaders, and partly converted into the Mosque of Nabi Yahya under the Mamluks.',
    sourceNote: 'Main landmarks and timeline, Ayyubid and Mamluk eras',
    sortOrder: 2,
  },
  {
    id: 'quiz-seb-4',
    locationId: 'sebastia',
    question:
      'Which Roman structure at Sebastia is among the best preserved in Palestine?',
    options: [
      'The aqueduct',
      'The bath house',
      'The colonnaded street',
      'The city forum',
    ],
    answerIndex: 2,
    explanation:
      'The colonnaded street, flanked by two rows of massive columns that once carried porticoes for merchants.',
    sourceNote: 'Important facts and main landmarks',
    sortOrder: 3,
  },
];
