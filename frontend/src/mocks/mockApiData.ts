import {
  ApiContribution,
  ApiLocation,
  ApiStory,
  GeneratedStory,
  GuideAnswer,
} from "../types";

/**
 * Timeline, gallery images and quiz questions are generated from the content
 * files rather than written here - see ai/scripts/export_seed_data.py. They are
 * re-exported so callers have one import for all mock data.
 */
export { MOCK_MEDIA, MOCK_QUIZ, MOCK_TIMELINE } from "./generatedMockData";

/**
 * Mock data used when the backend is unreachable.
 *
 * It is the same shape and the same content as database/seed.sql, so the UI is
 * exercised against realistic data and switching to the live API changes
 * nothing on screen except the source badge. Sprint 2 asks for exactly this:
 * "if backend integration is not fully ready, use temporary mock data with the
 * same final data structure".
 *
 * Whenever this file is used, the UI shows a "sample data" banner - the user is
 * never told mock data came from the server.
 */

export const MOCK_LOCATIONS: ApiLocation[] = [
  {
    id: "bethlehem",
    name: "Bethlehem",
    arabicName: "بيت لحم",
    city: "Bethlehem",
    country: "Palestine",
    latitude: 31.7054,
    longitude: 35.2024,
    description:
      "A historic Palestinian city about 10 km south of Jerusalem, roughly 775 m above sea level. Known worldwide for the Church of the Nativity, completed around 339 CE and World Heritage listed in 2012, and for its olive-wood and mother-of-pearl crafts.",
    coverImageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Church_of_the_Nativity%2C_2019_%2801%29.jpg?width=1600",
    contentFile: "content/beth.md",
    aiSummaryFile: "content/ai-ready/bethlehem-summary.md",
    categories: ["Cultural Heritage", "Historical Landmark", "Religious Landmark"],
    isPublished: true,
  },
  {
    id: "jerusalem",
    name: "Old City of Jerusalem",
    arabicName: "البلدة القديمة في القدس",
    city: "Jerusalem",
    country: "Palestine",
    latitude: 31.778,
    longitude: 35.2354,
    description:
      "One of the oldest continuously inhabited cities in the world. Roughly 0.9 km² inside Ottoman walls built under Sultan Suleiman the Magnificent, with eight historic gates, four quarters, and more than 220 historical monuments. Inscribed on the UNESCO World Heritage List in 1981.",
    coverImageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/18405-Jerusalem-Pano_%2828887202772%29.jpg?width=1600",
    contentFile: "content/oldCity.md",
    aiSummaryFile: "content/ai-ready/old-city-jerusalem-summary.md",
    categories: ["Cultural Heritage", "Historical Landmark", "Religious Landmark"],
    isPublished: true,
  },
  {
    id: "sebastia",
    name: "Sebastia",
    arabicName: "سبسطية",
    city: "Nablus",
    country: "Palestine",
    latitude: 32.2758,
    longitude: 35.1972,
    description:
      "An archaeological site about 12 km north-west of Nablus on a hill some 440 m above sea level. Capital of the northern Kingdom of Israel in the 9th century BCE, rebuilt by Herod the Great in 27 BCE and renamed after Emperor Augustus. Holds one of the best-preserved Roman streets in Palestine.",
    coverImageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Columned_street_-_panoramio.jpg?width=1600",
    contentFile: "content/sebastia.md",
    aiSummaryFile: "content/ai-ready/sebastia-summary.md",
    categories: ["Archaeological Site", "Cultural Heritage", "Historical Landmark"],
    isPublished: true,
  },
];

export const MOCK_STORIES: ApiStory[] = [
  {
    id: "story-jerusalem-walls",
    locationId: "jerusalem",
    title: "The City Inside the Walls",
    summary:
      "A walk through the Old City of Jerusalem, from its Canaanite beginnings to the Ottoman walls that still frame it today.",
    simplifiedStory: [
      "Step through Damascus Gate and you step into less than one square kilometre that has been lived in for thousands of years.",
      "",
      "The Canaanites are believed to have founded the city, choosing high ground near the trade routes and drawing their water from the Gihon Spring. After them came empire after empire. The Babylonian king Nebuchadnezzar II destroyed the First Temple in 586 BCE. The Persians allowed a return, and the Second Temple rose around 516 BCE. Rome arrived in 63 BCE, and in 70 CE Titus destroyed the Second Temple, leaving the retaining wall known today as al-Buraq Wall, or the Western Wall.",
      "",
      "When Caliph Umar ibn al-Khattab entered the city in 638 CE, he came peacefully, at the request of Patriarch Sophronius, and issued a covenant guaranteeing the inhabitants their lives, their property and their places of worship. Half a century later the Dome of the Rock was completed, in 691-692 CE, and its golden dome has stood over the city ever since.",
      "",
      "The walls you see now are younger than much of what they enclose: Sultan Suleiman the Magnificent rebuilt them in the 16th century. Inside them are four quarters, eight gates, more than 220 monuments, and markets like Khan al-Zeit where spices, olive oil, Nabulsi soap and embroidered cloth are still sold as they have been for centuries.",
      "",
      "UNESCO inscribed the Old City and its walls in 1981, and added them to the List of World Heritage in Danger in 1982.",
    ].join("\n"),
    audience: "general",
    language: "en",
    tone: "storytelling",
    source: "content/oldCity.md",
    isAiGenerated: false,
    uncertaintyNotes: [],
    status: "published",
  },
  {
    id: "story-bethlehem-nativity",
    locationId: "bethlehem",
    title: "The House of Bread",
    summary:
      "How a Canaanite hill town 10 km south of Jerusalem became one of the most visited places on earth.",
    simplifiedStory: [
      'The name is Canaanite. "Bayt" means house or place; the second half is read by some researchers as an old Canaanite deity named Lakhm, and by others as "bread" - the house of bread.',
      "",
      "Archaeology places people here in the second millennium BCE, farming olives and vines, herding sheep, and trading along the routes that linked Jerusalem and Hebron to the south. What changed everything was a building. In the fourth century CE, Emperor Constantine I and his mother Helena ordered a church raised over the grotto that Christian tradition identifies as the birthplace of Jesus. It was finished around 339 CE, and Justinian I rebuilt parts of it in the sixth century after damage.",
      "",
      "Every era that followed left its mark on that church and the town around it. The Crusaders restored it with mosaics and wall paintings and made Bethlehem a stop on the pilgrimage road. After Salah al-Din's victory at Hattin in 1187 the city passed to Ayyubid rule, and the church kept working. Four Ottoman centuries brought olive groves, vineyards, almond orchards, and the olive-wood carving craft the city is still known for.",
      "",
      "The Church of the Nativity and the Pilgrimage Route were inscribed by UNESCO in 2012, and removed from the danger list in 2019 once the conservation work was done.",
    ].join("\n"),
    audience: "general",
    language: "en",
    tone: "storytelling",
    source: "content/beth.md",
    isAiGenerated: false,
    uncertaintyNotes: [],
    status: "published",
  },
  {
    id: "story-sebastia-columns",
    locationId: "sebastia",
    title: "A Street of Columns Above the Olive Groves",
    summary:
      "Sebastia gathers Canaanite, Roman, Byzantine, Crusader and Islamic remains on a single hill near Nablus.",
    simplifiedStory: [
      "Twelve kilometres north-west of Nablus, on a hill about 440 metres high, one site holds the leftovers of nearly every civilisation that passed through Palestine.",
      "",
      "Canaanites settled here in the second millennium BCE, using the height to guard the trade routes and storing water in wells and cisterns. By the 9th century BCE the town, then called Shomron - Samaria - was the capital of the northern Kingdom of Israel. In 27 BCE Herod the Great rebuilt it and gave it the name it still carries: Sebastia, the Greek form of the title of the emperor Augustus, whom he honoured with a temple here.",
      "",
      "Rome left the most visible ruins - a long colonnaded street lined with two rows of massive columns that once carried porticoes for merchants, and a semi-circular theatre on the eastern side. The Byzantines built a cathedral at the site associated with John the Baptist. The Crusaders rebuilt it larger and turned the town into a pilgrim stop. Under the Mamluks part of that same building became the Mosque of Nabi Yahya, which is why Christians and Muslims both hold the site in regard.",
      "",
      "The olive groves still run right up to the columns. That is the thing worth noticing here: the site was never abandoned to become a museum. People kept living in it.",
    ].join("\n"),
    audience: "general",
    language: "en",
    tone: "storytelling",
    source: "content/sebastia.md",
    isAiGenerated: false,
    uncertaintyNotes: [],
    status: "published",
  },
];

export const MOCK_CONTRIBUTIONS: ApiContribution[] = [
  {
    id: "contribution-sample-1",
    locationId: "jerusalem",
    title: "Friday mornings at Damascus Gate",
    content:
      "My grandfather used to take me to Damascus Gate every Friday morning. We would walk through the stone alleys of the market, past the spice sellers, until we reached the sweet shops. For me the Old City is not only history - it is that smell, and the sound of families sitting together on old steps.",
    contributorName: "Amra Sawalha",
    status: "approved",
    submittedAt: "2026-07-17T00:00:00.000Z",
  },
  {
    id: "contribution-sample-2",
    locationId: "bethlehem",
    title: "The old olive press in Beit Jala",
    content:
      "In our neighbourhood in Beit Jala, next to Bethlehem, there is an old stone olive press still in use. Every harvest the whole neighbourhood gathers to press the olives they picked by hand. The smell of the first oil coming off the stone wheel is what home smells like.",
    contributorName: "Joud Abu Omar",
    status: "approved",
    submittedAt: "2026-07-18T00:00:00.000Z",
  },
];

/**
 * Offline stand-in for POST /ai/generate-story.
 *
 * It reuses the location's stored description rather than writing anything new,
 * and says plainly in the uncertainty notes that no AI service was involved -
 * the same rule the backend fallback follows.
 */
export function mockGeneratedStory(
  location: ApiLocation,
  audience: string,
): GeneratedStory {
  const narrative = [
    `${location.name}${location.arabicName ? ` (${location.arabicName})` : ""}`,
    "",
    location.description ?? "",
    "",
    `The full reviewed material for this location is kept in ${location.contentFile ?? "the content folder"}.`,
  ].join("\n");

  return {
    title: location.name,
    summary: (location.description ?? "").split(". ")[0] ?? location.name,
    narrative,
    targetAudience: audience,
    language: "en",
    tone: "storytelling",
    wordCount: narrative.split(/\s+/).filter(Boolean).length,
    uncertaintyNotes: [
      "The backend and AI service are not reachable, so this is the stored location description rather than a generated narrative.",
    ],
    warnings: [],
    source: {
      locationId: location.id,
      locationName: location.name,
      contentFile: location.contentFile,
      summaryFile: location.aiSummaryFile,
    },
    generatedBy: "frontend-mock",
  };
}

/**
 * Offline stand-in for POST /ai/ask-guide.
 *
 * It answers nothing. Without the backend there is no reviewed content to
 * search, and a guide that invented an answer here would break the one promise
 * the whole feature rests on - so it says plainly that it cannot answer.
 */
export function mockGuideAnswer(locationId: string, question: string): GuideAnswer {
  const location = MOCK_LOCATIONS.find((item) => item.id === locationId);
  return {
    answer:
      `The heritage guide needs the Hikaya API to search the reviewed records for ` +
      `${location?.name ?? "this location"}, and it is not reachable right now. ` +
      `Your question has not been answered - it has not been guessed at either.`,
    answeredFromSource: false,
    excerpts: [],
    uncertaintyNotes: [
      `Offline: "${question.trim()}" was not searched against any reviewed content.`,
    ],
    generatedBy: "frontend-mock",
  };
}
