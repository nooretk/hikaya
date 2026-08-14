import { MediaItem } from '../entities/media.entity';
import { TimelineEvent } from '../entities/timeline-event.entity';

/**
 * GENERATED FILE - do not edit by hand.
 *
 * Regenerate with:  python3 ai/scripts/export_seed_data.py
 *
 * Mirrors database/seed-generated.sql so the in-memory repositories serve
 * exactly the same timeline and media as PostgreSQL. Both are produced from
 * content/ai-ready/*-summary.md and content/media/media.json.
 */

export const SEED_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-jerusalem-01',
    locationId: 'jerusalem',
    periodLabel: 'Canaanite era (from the Early Bronze Age, 4,000+ years ago)',
    description:
      'The Canaanites are believed to have founded the city, known as Urusalim / Urshalem. The name is thought to derive from the Canaanite deity "Shalem". They built defences and water systems; the Gihon Spring was the main water source.',
    sortYear: -2000,
    sortOrder: 0,
    isTradition: true,
    sourceFile: 'content/ai-ready/old-city-jerusalem-summary.md',
  },
  {
    id: 'tl-jerusalem-02',
    locationId: 'jerusalem',
    periodLabel: 'Ancient Israelite era (c. 1000 BCE)',
    description:
      'According to accounts in the Old Testament, Jerusalem became the capital under King David, and his son Solomon built the First Temple.',
    sortYear: -1000,
    sortOrder: 1,
    isTradition: true,
    sourceFile: 'content/ai-ready/old-city-jerusalem-summary.md',
  },
  {
    id: 'tl-jerusalem-03',
    locationId: 'jerusalem',
    periodLabel: '586 BCE',
    description:
      'The Babylonian king Nebuchadnezzar II attacked the city, destroyed the First Temple, and deported a large part of the population (the Babylonian Exile).',
    sortYear: -586,
    sortOrder: 2,
    isTradition: false,
    sourceFile: 'content/ai-ready/old-city-jerusalem-summary.md',
  },
  {
    id: 'tl-jerusalem-04',
    locationId: 'jerusalem',
    periodLabel: 'Persian era (from 539 BCE)',
    description:
      'Cyrus the Great took Babylon and permitted the return to Jerusalem and the rebuilding of the Temple; the Second Temple was built around 516 BCE.',
    sortYear: -539,
    sortOrder: 3,
    isTradition: false,
    sourceFile: 'content/ai-ready/old-city-jerusalem-summary.md',
  },
  {
    id: 'tl-jerusalem-05',
    locationId: 'jerusalem',
    periodLabel: 'Hellenistic era (from 332 BCE)',
    description:
      'Alexander the Great conquered the region; control passed between the Ptolemies and the Seleucids. Attempts to impose Greek culture led to the Maccabean revolt in the 2nd century BCE and a period of Hasmonean independence.',
    sortYear: -332,
    sortOrder: 4,
    isTradition: false,
    sourceFile: 'content/ai-ready/old-city-jerusalem-summary.md',
  },
  {
    id: 'tl-jerusalem-06',
    locationId: 'jerusalem',
    periodLabel: 'Roman era (from 63 BCE)',
    description:
      'Pompey entered Jerusalem. Under Herod the Great the city saw major construction and the Second Temple was expanded. In 70 CE, after the First Jewish Revolt, Titus besieged the city and destroyed the Second Temple; part of the retaining wall survives and is known as al-Buraq Wall (the Western Wall).',
    sortYear: -63,
    sortOrder: 5,
    isTradition: false,
    sourceFile: 'content/ai-ready/old-city-jerusalem-summary.md',
  },
  {
    id: 'tl-jerusalem-07',
    locationId: 'jerusalem',
    periodLabel: 'Byzantine era (324-638 CE)',
    description:
      'After Constantine I adopted Christianity, Jerusalem became a major Christian holy city. The Church of the Holy Sepulchre was built in 335 CE. Churches, monasteries, roads and markets expanded.',
    sortYear: 324,
    sortOrder: 6,
    isTradition: false,
    sourceFile: 'content/ai-ready/old-city-jerusalem-summary.md',
  },
  {
    id: 'tl-jerusalem-08',
    locationId: 'jerusalem',
    periodLabel: 'Islamic conquest (638 CE)',
    description:
      'Caliph Umar ibn al-Khattab entered the city peacefully at the request of Patriarch Sophronius, without destruction or displacement. He issued the Umariyya Covenant guaranteeing the safety of the inhabitants, their property and their places of worship.',
    sortYear: 638,
    sortOrder: 7,
    isTradition: false,
    sourceFile: 'content/ai-ready/old-city-jerusalem-summary.md',
  },
  {
    id: 'tl-jerusalem-09',
    locationId: 'jerusalem',
    periodLabel: 'Umayyad era (661-750 CE)',
    description:
      'The Dome of the Rock was built by order of Caliph Abd al-Malik ibn Marwan, completed in 691-692 CE. Caliph al-Walid ibn Abd al-Malik completed Al-Aqsa Mosque in the early 8th century CE.',
    sortYear: 661,
    sortOrder: 8,
    isTradition: false,
    sourceFile: 'content/ai-ready/old-city-jerusalem-summary.md',
  },
  {
    id: 'tl-jerusalem-10',
    locationId: 'jerusalem',
    periodLabel: 'Abbasid and Fatimid eras',
    description:
      'Repeated restoration work after earthquakes, including rebuilding parts of Al-Aqsa Mosque after the major earthquake of 1033 CE. Schools, libraries and pilgrim facilities were built.',
    sortYear: 750,
    sortOrder: 9,
    isTradition: false,
    sourceFile: 'content/ai-ready/old-city-jerusalem-summary.md',
  },
  {
    id: 'tl-jerusalem-11',
    locationId: 'jerusalem',
    periodLabel: 'Crusader occupation (1099-1187 CE)',
    description:
      'The First Crusade took the city after a long siege. Historical sources record widespread violence against Muslim and Jewish inhabitants. Jerusalem became the capital of the Latin Kingdom.',
    sortYear: 1099,
    sortOrder: 10,
    isTradition: false,
    sourceFile: 'content/ai-ready/old-city-jerusalem-summary.md',
  },
  {
    id: 'tl-jerusalem-12',
    locationId: 'jerusalem',
    periodLabel: 'Ottoman era (16th century CE)',
    description:
      'Sultan Suleiman the Magnificent rebuilt the city walls that still stand today.',
    sortYear: 1550,
    sortOrder: 11,
    isTradition: false,
    sourceFile: 'content/ai-ready/old-city-jerusalem-summary.md',
  },
  {
    id: 'tl-jerusalem-13',
    locationId: 'jerusalem',
    periodLabel: '1981 / 1982',
    description:
      'The Old City and its walls were inscribed on the UNESCO World Heritage List (1981) and added to the List of World Heritage in Danger (1982).',
    sortYear: 1981,
    sortOrder: 12,
    isTradition: false,
    sourceFile: 'content/ai-ready/old-city-jerusalem-summary.md',
  },
  {
    id: 'tl-bethlehem-01',
    locationId: 'bethlehem',
    periodLabel: 'Canaanite era (2nd millennium BCE)',
    description:
      'Archaeological finds show Bethlehem was inhabited from the 2nd millennium BCE, founded by Canaanites who built fortified towns and trading centres. It sat on old trade routes linking Jerusalem and Hebron to the south, and lived on agriculture, olive and vine cultivation, and sheep herding.',
    sortYear: -2000,
    sortOrder: 0,
    isTradition: false,
    sourceFile: 'content/ai-ready/bethlehem-summary.md',
  },
  {
    id: 'tl-bethlehem-02',
    locationId: 'bethlehem',
    periodLabel: 'Name origin',
    description:
      'The name comes from Canaanite. Bayt means house or place; Lahm / Lakhm is linked by some researchers to an ancient Canaanite deity named Lakhm, while other readings give "house of bread" in the Semitic languages.',
    sortYear: -1500,
    sortOrder: 1,
    isTradition: false,
    sourceFile: 'content/ai-ready/bethlehem-summary.md',
  },
  {
    id: 'tl-bethlehem-03',
    locationId: 'bethlehem',
    periodLabel: '4th century CE (Byzantine)',
    description:
      'Emperor Constantine I and his mother Helena ordered the building of the Church of the Nativity; it was completed around 339 CE.',
    sortYear: 350,
    sortOrder: 2,
    isTradition: false,
    sourceFile: 'content/ai-ready/bethlehem-summary.md',
  },
  {
    id: 'tl-bethlehem-04',
    locationId: 'bethlehem',
    periodLabel: '6th century CE',
    description:
      'Emperor Justinian I rebuilt parts of the church after it was damaged.',
    sortYear: 550,
    sortOrder: 3,
    isTradition: false,
    sourceFile: 'content/ai-ready/bethlehem-summary.md',
  },
  {
    id: 'tl-bethlehem-05',
    locationId: 'bethlehem',
    periodLabel: 'Crusader era (from 1099 CE)',
    description:
      'Bethlehem became part of the Latin Kingdom of Jerusalem. The Crusaders restored the Church of the Nativity and decorated it with mosaics and wall paintings, and built monasteries and pilgrim facilities. The city became a main stop on the Christian pilgrimage route.',
    sortYear: 1099,
    sortOrder: 4,
    isTradition: false,
    sourceFile: 'content/ai-ready/bethlehem-summary.md',
  },
  {
    id: 'tl-bethlehem-06',
    locationId: 'bethlehem',
    periodLabel: 'Ayyubid era (1187-1250 CE)',
    description:
      "After Salah al-Din's victory at Hattin in 1187 CE, Bethlehem came under Ayyubid rule. The Church of the Nativity kept its religious role and Christian pilgrims continued to visit; the holy places were respected.",
    sortYear: 1187,
    sortOrder: 5,
    isTradition: false,
    sourceFile: 'content/ai-ready/bethlehem-summary.md',
  },
  {
    id: 'tl-bethlehem-07',
    locationId: 'bethlehem',
    periodLabel: 'Mamluk era (1250-1517 CE)',
    description:
      'The city retained its religious standing and continued to receive pilgrims. Restoration work was carried out on religious buildings and access roads, and pilgrimage routes were secured, supporting trade.',
    sortYear: 1250,
    sortOrder: 6,
    isTradition: false,
    sourceFile: 'content/ai-ready/bethlehem-summary.md',
  },
  {
    id: 'tl-bethlehem-08',
    locationId: 'bethlehem',
    periodLabel: 'Ottoman era (1517-1917 CE)',
    description:
      "About four centuries of relative stability. Agriculture flourished - olives, vines and almonds - and the olive-wood craft industry developed into the city's best-known traditional industry. The Church of the Nativity underwent several restorations.",
    sortYear: 1517,
    sortOrder: 7,
    isTradition: false,
    sourceFile: 'content/ai-ready/bethlehem-summary.md',
  },
  {
    id: 'tl-bethlehem-09',
    locationId: 'bethlehem',
    periodLabel: 'British Mandate (1917-1948)',
    description:
      'Roads and services improved; the city continued its religious and tourist role while being affected by the political events of the period.',
    sortYear: 1917,
    sortOrder: 8,
    isTradition: false,
    sourceFile: 'content/ai-ready/bethlehem-summary.md',
  },
  {
    id: 'tl-bethlehem-10',
    locationId: 'bethlehem',
    periodLabel: 'Modern era',
    description:
      'After 1948 Bethlehem came under Jordanian administration; in 1967 it became part of the territory occupied by Israel; since 1995 it has been administered by the Palestinian National Authority under the agreements signed at that time.',
    sortYear: 1948,
    sortOrder: 9,
    isTradition: false,
    sourceFile: 'content/ai-ready/bethlehem-summary.md',
  },
  {
    id: 'tl-bethlehem-11',
    locationId: 'bethlehem',
    periodLabel: '2012',
    description:
      'The Church of the Nativity and the Pilgrimage Route were inscribed on the UNESCO World Heritage List.',
    sortYear: 2012,
    sortOrder: 10,
    isTradition: false,
    sourceFile: 'content/ai-ready/bethlehem-summary.md',
  },
  {
    id: 'tl-bethlehem-12',
    locationId: 'bethlehem',
    periodLabel: '2019',
    description:
      'The site was removed from the List of World Heritage in Danger after the required conservation work was completed.',
    sortYear: 2019,
    sortOrder: 11,
    isTradition: false,
    sourceFile: 'content/ai-ready/bethlehem-summary.md',
  },
  {
    id: 'tl-sebastia-01',
    locationId: 'sebastia',
    periodLabel: 'Canaanite era (2nd millennium BCE)',
    description:
      'Archaeological evidence shows the area was inhabited from the 2nd millennium BCE by Canaanites, who used the elevated position to protect the town and watch the trade routes. They lived on agriculture, livestock, trade, and water storage in wells and cisterns.',
    sortYear: -2000,
    sortOrder: 0,
    isTradition: false,
    sourceFile: 'content/ai-ready/sebastia-summary.md',
  },
  {
    id: 'tl-sebastia-02',
    locationId: 'sebastia',
    periodLabel: '9th century BCE',
    description:
      'The ancient Canaanite name of the city was Shomron (Samaria); it was the capital of the northern Kingdom of Israel.',
    sortYear: -900,
    sortOrder: 1,
    isTradition: false,
    sourceFile: 'content/ai-ready/sebastia-summary.md',
  },
  {
    id: 'tl-sebastia-03',
    locationId: 'sebastia',
    periodLabel: '27 BCE',
    description:
      'Herod the Great rebuilt the city and named it Sebastia - the Greek equivalent of the title of the Roman emperor Augustus - in his honour. The name "Samaria" remained in use in some historical and religious sources.',
    sortYear: -27,
    sortOrder: 2,
    isTradition: false,
    sourceFile: 'content/ai-ready/sebastia-summary.md',
  },
  {
    id: 'tl-sebastia-04',
    locationId: 'sebastia',
    periodLabel: 'Roman era',
    description:
      'Major construction: the colonnaded street, the theatre, and the Temple of Augustus built by Herod the Great.',
    sortYear: -63,
    sortOrder: 3,
    isTradition: false,
    sourceFile: 'content/ai-ready/sebastia-summary.md',
  },
  {
    id: 'tl-sebastia-05',
    locationId: 'sebastia',
    periodLabel: 'Byzantine era',
    description:
      'The city prospered; excavations revealed mosaic floors, columns, and remains of religious buildings. A cathedral was built at the site associated with John the Baptist.',
    sortYear: 324,
    sortOrder: 4,
    isTradition: false,
    sourceFile: 'content/ai-ready/sebastia-summary.md',
  },
  {
    id: 'tl-sebastia-06',
    locationId: 'sebastia',
    periodLabel: 'Islamic conquest (638 CE)',
    description:
      'Sebastia came under Islamic rule during the conquest of the Levant under Caliph Umar ibn al-Khattab. It remained inhabited, existing buildings were largely preserved, and new buildings were added.',
    sortYear: 638,
    sortOrder: 5,
    isTradition: false,
    sourceFile: 'content/ai-ready/sebastia-summary.md',
  },
  {
    id: 'tl-sebastia-07',
    locationId: 'sebastia',
    periodLabel: 'Crusader era (1099-1187 CE)',
    description:
      'The Crusaders rebuilt a large church over the site attributed to the tomb of John the Baptist, and built defensive structures and towers. The town became a stop for European pilgrims; remains of the Crusader church still stand.',
    sortYear: 1099,
    sortOrder: 6,
    isTradition: false,
    sourceFile: 'content/ai-ready/sebastia-summary.md',
  },
  {
    id: 'tl-sebastia-08',
    locationId: 'sebastia',
    periodLabel: 'Ayyubid and Mamluk eras',
    description:
      'After Salah al-Din al-Ayyubi restored Muslim rule, parts of the Crusader church were converted during the Mamluk period into the Mosque of Nabi Yahya, keeping much of the original building. The town continued as an agricultural village.',
    sortYear: 1187,
    sortOrder: 7,
    isTradition: false,
    sourceFile: 'content/ai-ready/sebastia-summary.md',
  },
  {
    id: 'tl-sebastia-09',
    locationId: 'sebastia',
    periodLabel: 'Ottoman era (1517-1917 CE)',
    description:
      'Sebastia became a small Palestinian village living on olives and olive oil, figs, grapes and almonds, and sheep and goat herding. Its Roman and Byzantine remains continued to attract European travellers and researchers who described them in their books.',
    sortYear: 1517,
    sortOrder: 8,
    isTradition: false,
    sourceFile: 'content/ai-ready/sebastia-summary.md',
  },
  {
    id: 'tl-sebastia-10',
    locationId: 'sebastia',
    periodLabel: 'Modern era',
    description:
      'After Ottoman rule the area came under the British Mandate, then Jordanian administration after 1948. Since 1967 it has been within the territory occupied by Israel, while the Palestinian town is administered in civil matters by the Palestinian National Authority, with administrative complications tied to the archaeological site.',
    sortYear: 1948,
    sortOrder: 9,
    isTradition: false,
    sourceFile: 'content/ai-ready/sebastia-summary.md',
  },
];

export const SEED_MEDIA: MediaItem[] = [
  {
    id: 'jer-cover',
    locationId: 'jerusalem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/18405-Jerusalem-Pano_%2828887202772%29.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/18405-Jerusalem-Pano_%2828887202772%29.jpg?width=600',
    subject: 'Dome of the Rock',
    description:
      'The Dome of the Rock, completed 691-692 CE, above the Old City.',
    era: 'modern',
    pairRole: 'cover',
    credit: 'xiquinhosilva',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    capturedAt: '2014-08-10 09:27',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:18405-Jerusalem-Pano_(28887202772).jpg',
    sortOrder: 0,
  },
  {
    id: 'jer-dome',
    locationId: 'jerusalem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Best_ever_view_Dome_of_the_Rock_in_Jerusalem.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Best_ever_view_Dome_of_the_Rock_in_Jerusalem.jpg?width=600',
    subject: 'Dome of the Rock',
    description: 'The tiled drum and golden dome of the Dome of the Rock.',
    era: 'modern',
    pairRole: undefined,
    credit: 'Jerusalem-Reality',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
    capturedAt: '2024-02-16',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Best_ever_view_Dome_of_the_Rock_in_Jerusalem.jpg',
    sortOrder: 1,
  },
  {
    id: 'jer-aqsa',
    locationId: 'jerusalem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jerusalem-2007-Temple_Mount-Al-Aqsa_Mosque_01.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Jerusalem-2007-Temple_Mount-Al-Aqsa_Mosque_01.jpg?width=600',
    subject: 'Al-Aqsa Mosque',
    description:
      'The Qibli Mosque with its lead dome, inside the Al-Aqsa compound.',
    era: 'modern',
    pairRole: undefined,
    credit: 'Godot13',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    capturedAt: '2007-08-06 13:03:17',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Jerusalem-2007-Temple_Mount-Al-Aqsa_Mosque_01.jpg',
    sortOrder: 2,
  },
  {
    id: 'jer-sepulchre',
    locationId: 'jerusalem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Holy_Land_2016_P0928_Church_of_the_Holy_Sepulchre_Aedicule_exterior.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Holy_Land_2016_P0928_Church_of_the_Holy_Sepulchre_Aedicule_exterior.jpg?width=600',
    subject: 'Church of the Holy Sepulchre',
    description:
      'Lamps above the Aedicule in the Church of the Holy Sepulchre.',
    era: 'modern',
    pairRole: undefined,
    credit: 'Fallaner',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    capturedAt: '2016-03-27 16:25:08',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Holy_Land_2016_P0928_Church_of_the_Holy_Sepulchre_Aedicule_exterior.jpg',
    sortOrder: 3,
  },
  {
    id: 'jer-wall',
    locationId: 'jerusalem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/16-03-30-Klagemauer_Jerusalem_RalfR-DSCF7686.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/16-03-30-Klagemauer_Jerusalem_RalfR-DSCF7686.jpg?width=600',
    subject: 'Al-Buraq Wall',
    description:
      'Al-Buraq Wall, known to Jews as the Western Wall, part of the Herodian retaining wall.',
    era: 'modern',
    pairRole: undefined,
    credit: 'Ralf Roletschek',
    license: 'GFDL 1.2',
    licenseUrl: 'http://www.gnu.org/licenses/old-licenses/fdl-1.2.html',
    capturedAt: '2016-03-30 12:41:49',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:16-03-30-Klagemauer_Jerusalem_RalfR-DSCF7686.jpg',
    sortOrder: 4,
  },
  {
    id: 'jer-gate-now',
    locationId: 'jerusalem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/114627_ancient_jerusalem_PikiWiki_Israel.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/114627_ancient_jerusalem_PikiWiki_Israel.jpg?width=600',
    subject: 'Damascus Gate',
    description:
      'Damascus Gate (Bab al-Amud), the main northern entrance to the Old City.',
    era: 'modern',
    pairRole: 'after',
    credit: 'הנס פין',
    license: 'Public domain',
    licenseUrl: undefined,
    capturedAt: '1940',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:114627_ancient_jerusalem_PikiWiki_Israel.jpg',
    sortOrder: 5,
  },
  {
    id: 'jer-gate-then',
    locationId: 'jerusalem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Damascus_Gate%2C_Jerusalem_LOC_matpc.14337.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Damascus_Gate%2C_Jerusalem_LOC_matpc.14337.jpg?width=600',
    subject: 'Damascus Gate',
    description:
      "Damascus Gate photographed in 1925 by the American Colony's Matson Photo Service.",
    era: 'historical',
    pairRole: 'before',
    credit: 'Matson Collection',
    license: 'Public domain',
    licenseUrl: undefined,
    capturedAt: '1925',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Damascus_Gate,_Jerusalem_LOC_matpc.14337.jpg',
    sortOrder: 6,
  },
  {
    id: 'jer-pano',
    locationId: 'jerusalem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jerusalem_banner_Panorama.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Jerusalem_banner_Panorama.jpg?width=600',
    subject: 'Old City of Jerusalem',
    description: 'The Old City seen from the Mount of Olives.',
    era: 'modern',
    pairRole: undefined,
    credit:
      'Panorámica_de_Jerusalén_desde_el_Monte_de_los_Olivos.jpg: Bienchido derivative work: Pbsouthwood',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    capturedAt: '2013-07-06 20:21',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Jerusalem_banner_Panorama.jpg',
    sortOrder: 7,
  },
  {
    id: 'bet-cover',
    locationId: 'bethlehem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Church_of_the_Nativity%2C_2019_%2801%29.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Church_of_the_Nativity%2C_2019_%2801%29.jpg?width=600',
    subject: 'Church of the Nativity',
    description:
      'The Church of the Nativity, completed around 339 CE and rebuilt in the 6th century.',
    era: 'modern',
    pairRole: 'cover',
    credit: 'Bahnfrend',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    capturedAt: '2019-04-18 18:46:14',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Church_of_the_Nativity,_2019_(01).jpg',
    sortOrder: 0,
  },
  {
    id: 'bet-nativity-in',
    locationId: 'bethlehem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Church_of_the_Nativity%2C_Bethlehem_%289200855198%29.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Church_of_the_Nativity%2C_Bethlehem_%289200855198%29.jpg?width=600',
    subject: 'Church of the Nativity',
    description: 'The colonnaded nave of the Church of the Nativity.',
    era: 'modern',
    pairRole: undefined,
    credit: 'someone10x',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    capturedAt: '2009-10-03 07:31',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Church_of_the_Nativity,_Bethlehem_(9200855198).jpg',
    sortOrder: 1,
  },
  {
    id: 'bet-manger',
    locationId: 'bethlehem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/4776-20080121-0852UTC--bethlehem-manger-square.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/4776-20080121-0852UTC--bethlehem-manger-square.jpg?width=600',
    subject: 'Manger Square',
    description: 'Manger Square, with the Mosque of Omar facing the church.',
    era: 'modern',
    pairRole: undefined,
    credit: 'adriatikus en:commons:talk',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    capturedAt: '2008-01-21 10:52',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:4776-20080121-0852UTC--bethlehem-manger-square.jpg',
    sortOrder: 2,
  },
  {
    id: 'bet-milk',
    locationId: 'bethlehem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/The_Milk_Grotto%2C_Bethlehem_%28NYPL_b10607452-80341%29.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/The_Milk_Grotto%2C_Bethlehem_%28NYPL_b10607452-80341%29.jpg?width=600',
    subject: 'Milk Grotto',
    description:
      'The Milk Grotto in an 1881 photograph held by the New York Public Library.',
    era: 'historical',
    pairRole: undefined,
    credit: 'Scan by NYPL',
    license: 'Public domain',
    licenseUrl: undefined,
    capturedAt: '1881',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:The_Milk_Grotto,_Bethlehem_(NYPL_b10607452-80341).jpg',
    sortOrder: 3,
  },
  {
    id: 'bet-pools',
    locationId: 'bethlehem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/PikiWiki_Israel_71362_solomons_pools.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/PikiWiki_Israel_71362_solomons_pools.jpg?width=600',
    subject: "Solomon's Pools",
    description:
      "Solomon's Pools, created in the Roman period to supply Jerusalem and Bethlehem with water.",
    era: 'historical',
    pairRole: undefined,
    credit: 'רוני קניגסברג',
    license: 'CC BY 2.5',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.5',
    capturedAt: '1968',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:PikiWiki_Israel_71362_solomons_pools.jpg',
    sortOrder: 4,
  },
  {
    id: 'bet-shepherds',
    locationId: 'bethlehem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Beit-Sahour-Shepherds-Catholic-054.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Beit-Sahour-Shepherds-Catholic-054.jpg?width=600',
    subject: "Shepherds' Fields",
    description: "The Shepherds' Fields chapel at Beit Sahour.",
    era: 'modern',
    pairRole: undefined,
    credit: 'Bukvoed',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    capturedAt: '2019-01-05 15:22:21',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Beit-Sahour-Shepherds-Catholic-054.jpg',
    sortOrder: 5,
  },
  {
    id: 'bet-nativity-then',
    locationId: 'bethlehem',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Church_of_the_Nativity%2C_Bethlehem%2C_Palestine_00253u_original.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Church_of_the_Nativity%2C_Bethlehem%2C_Palestine_00253u_original.jpg?width=600',
    subject: 'Church of the Nativity',
    description:
      'The interior of the Church of the Nativity, photographed between 1934 and 1939.',
    era: 'historical',
    pairRole: undefined,
    credit: 'Unknown',
    license: 'Public domain',
    licenseUrl: undefined,
    capturedAt: 'between 1934 and 1939date QS:P571,+1934-',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Church_of_the_Nativity,_Bethlehem,_Palestine_00253u_original.jpg',
    sortOrder: 6,
  },
  {
    id: 'seb-cover',
    locationId: 'sebastia',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Columned_street_-_panoramio.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Columned_street_-_panoramio.jpg?width=600',
    subject: 'Roman colonnaded street',
    description:
      'The Roman colonnaded street, one of the best preserved in Palestine.',
    era: 'modern',
    pairRole: 'cover',
    credit: 'Mujaddara',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    capturedAt: 'Taken on 6 June 2011',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Columned_street_-_panoramio.jpg',
    sortOrder: 0,
  },
  {
    id: 'seb-theatre',
    locationId: 'sebastia',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Roman_theatre_-_panoramio.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Roman_theatre_-_panoramio.jpg?width=600',
    subject: 'Roman theatre',
    description: 'The Roman theatre on the eastern side of the site.',
    era: 'modern',
    pairRole: undefined,
    credit: 'nikola_pu',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    capturedAt: 'Taken on 10 May 2007',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Roman_theatre_-_panoramio.jpg',
    sortOrder: 1,
  },
  {
    id: 'seb-nabi',
    locationId: 'sebastia',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ayyubid_Sanctuary_on_John_the_Baptist%27s_tomb_-_panoramio.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Ayyubid_Sanctuary_on_John_the_Baptist%27s_tomb_-_panoramio.jpg?width=600',
    subject: 'Mosque of Nabi Yahya',
    description:
      'The Ayyubid sanctuary over the tomb attributed to the Prophet Yahya (John the Baptist).',
    era: 'modern',
    pairRole: undefined,
    credit: 'Mujaddara',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    capturedAt: 'Taken on 6 June 2011',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Ayyubid_Sanctuary_on_John_the_Baptist%27s_tomb_-_panoramio.jpg',
    sortOrder: 2,
  },
  {
    id: 'seb-cathedral',
    locationId: 'sebastia',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Crusader_Cathedral_-_panoramio.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Crusader_Cathedral_-_panoramio.jpg?width=600',
    subject: 'Cathedral of St John',
    description:
      'Remains of the Crusader cathedral, later partly converted into the Mosque of Nabi Yahya.',
    era: 'modern',
    pairRole: undefined,
    credit: 'Mujaddara',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    capturedAt: 'Taken on 6 June 2011',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Crusader_Cathedral_-_panoramio.jpg',
    sortOrder: 3,
  },
  {
    id: 'seb-gate',
    locationId: 'sebastia',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/City_Gate_-_panoramio.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/City_Gate_-_panoramio.jpg?width=600',
    subject: 'City gate',
    description:
      'The city gate, part of the defensive works rebuilt across several eras.',
    era: 'modern',
    pairRole: undefined,
    credit: 'Mujaddara',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    capturedAt: 'Taken on 6 June 2011',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:City_Gate_-_panoramio.jpg',
    sortOrder: 4,
  },
  {
    id: 'seb-wall',
    locationId: 'sebastia',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Casemate_defensive_wall_-_panoramio.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Casemate_defensive_wall_-_panoramio.jpg?width=600',
    subject: 'Defensive wall',
    description: 'The casemate defensive wall on the hill.',
    era: 'modern',
    pairRole: undefined,
    credit: 'Mujaddara',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    capturedAt: 'Taken on 6 June 2011',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Casemate_defensive_wall_-_panoramio.jpg',
    sortOrder: 5,
  },
  {
    id: 'seb-hist',
    locationId: 'sebastia',
    type: 'image',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/190._Samarie._Apside._Egl._S._Jean_-_btv1b6903034k.jpg?width=1600',
    thumbUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/190._Samarie._Apside._Egl._S._Jean_-_btv1b6903034k.jpg?width=600',
    subject: 'Cathedral of St John',
    description:
      'The apse of the church of St John, in a daguerreotype taken between 1842 and 1844 by Girault de Prangey - among the earliest photographs of Palestine.',
    era: 'historical',
    pairRole: undefined,
    credit: 'Girault de Prangey, Philibert-Joseph (1804-1892). Photographe',
    license: 'Public domain',
    licenseUrl: undefined,
    capturedAt: 'between 1842 and 1844date QS:P571,+1842-',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:190._Samarie._Apside._Egl._S._Jean_-_btv1b6903034k.jpg',
    sortOrder: 6,
  },
];
