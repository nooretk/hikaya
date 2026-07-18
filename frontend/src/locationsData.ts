import { LocationData } from "./types";

export const locations: LocationData[] = [
  {
    id: "jerusalem",
    name: "Old City of Jerusalem",
    arabicName: "البلدة القديمة - القدس",
    lat: 31.7780,
    lng: 35.2354,
    coverImage: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=1200",
    summary: "The ancient beating heart of Palestine, bounded by magnificent stone walls and hosting iconic sacred architecture.",
    culturalImportance: "A city of deep spiritual, national, and historical importance. Famous for Damascus Gate, its winding limestone alleys, bustling traditional souks (like Khan al-Zait), and the iconic Dome of the Rock, Jerusalem represents Palestinian identity, architectural grandeur, and resilience.",
    historicalSummary: "With over 5,000 years of continuous human habitation, Jerusalem has witnessed numerous empires rise and fall. Its monumental stone walls, rebuilt by Ottoman Sultan Suleiman the Magnificent in the 16th century, enclose four distinct quarters. It stands as a timeless crossroads of cultures, religions, and ancient civilizations.",
    landmarks: [
      "Damascus Gate (Bab al-Amud)",
      "Al-Aqsa Mosque Compound",
      "Church of the Holy Sepulchre",
      "Via Dolorosa",
      "Khan al-Zait Market"
    ]
  },
  {
    id: "bethlehem",
    name: "Bethlehem",
    arabicName: "بيت لحم",
    lat: 31.7054,
    lng: 35.2024,
    coverImage: "https://images.unsplash.com/photo-1590076212879-11ef849646b5?auto=format&fit=crop&q=80&w=1200",
    summary: "A global beacon of spiritual history and Palestinian craftsmanship, nestled in the terraced olive hills south of Jerusalem.",
    culturalImportance: "A historic sanctuary of spiritual heritage and master crafts. Bethlehem is internationally celebrated for olive wood carving, mother-of-pearl craftsmanship, and traditional Palestinian cross-stitch embroidery (Tatreez). It is home to active farming terraces and olive groves that have fed generations.",
    historicalSummary: "Mentioned in ancient historical scripts as far back as 1400 BCE, Bethlehem is the spiritual birthplace of Christianity. The majestic Church of the Nativity, constructed originally in 327 CE by Emperor Constantine and rebuilt by Justinian, is one of the oldest operating churches in the world and a UNESCO World Heritage site.",
    landmarks: [
      "Church of the Nativity",
      "Manger Square (Sehat al-Mahd)",
      "The Historic Star Street",
      "The Milk Grotto",
      "Traditional Terraces of Beit Jala"
    ]
  },
  {
    id: "sebastia",
    name: "Sebastia",
    arabicName: "سبسطية",
    lat: 32.2758,
    lng: 35.1972,
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200", // Fallback beautiful historical background
    summary: "An archaeological jewel near Nablus, blending Roman columned streets with Byzantine basilica and medieval ruins.",
    culturalImportance: "A living museum of antiquity, Sebastia represents a unique overlap of historic eras. The village houses traditional stone architecture alongside breathtaking Roman colonnades, and Byzantine masonry. Local festivals celebrate Palestinian folklore among the columns of ancient times.",
    historicalSummary: "Historically the capital of Samaria, Sebastia was rebuilt and renamed by King Herod the Great in 30 BCE in honor of Caesar Augustus (Sebaste). The site hosts monumental ruins including an intact Roman amphitheater, a columns-lined forum street, a 5th-century Byzantine Basilica, and the Mosque of Nabi Yahya (John the Baptist).",
    landmarks: [
      "Roman Colonnade Street",
      "Intact Roman Amphitheater",
      "Byzantine Basilica Ruins",
      "Mosque of Nabi Yahya (John the Baptist)",
      "Ancient Forum & Herodian Palace"
    ]
  },
  {
    id: "hebron",
    name: "Hebron",
    arabicName: "الخليل",
    lat: 31.5298,
    lng: 35.0998,
    coverImage: "https://images.unsplash.com/photo-1621360841013-c7683c659ec6?auto=format&fit=crop&q=80&w=1200",
    summary: "A majestic stone-built UNESCO World Heritage city, famous for ancient craftsmanship, vineyards, and historical architecture.",
    culturalImportance: "Globally famous for the hand-made stained glass blowing (Hebron Glass) and hand-painted pottery. Hebron is also legendary for its vast vineyards producing traditional grape molasses (Dibs), and its intricate Mamluk-era Old City markets built of smooth, warm-colored limestone.",
    historicalSummary: "Hebron is one of the oldest continuously inhabited cities in the Middle East, dating to the Bronze Age. Its centerpiece is the Sanctuary of Abraham (Ibrahimi Mosque), a massive Herodian structure housing the tombs of Biblical Patriarchs, representing a profound site of cultural and architectural marvel.",
    landmarks: [
      " Sanctuary of Abraham (Ibrahimi Mosque)",
      "Traditional Glassblowing & Ceramic Workshops",
      "Mamluk-era Old City Souks",
      "Oak of Mamre"
    ]
  },
  {
    id: "nablus",
    name: "Nablus",
    arabicName: "نابلس",
    lat: 32.2211,
    lng: 35.2544,
    coverImage: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1200",
    summary: "Surrounded by Mount Ebal and Mount Gerizim, Nablus is Palestine's industrial and culinary capital of ancient times.",
    culturalImportance: "The capital of Palestinian sweets, famous worldwide for Al-Kanafeh al-Nabulsiyeh. It is also celebrated for traditional soap-making factories (Sabanah) that press pure Palestinian virgin olive oil into gentle white cubes, and its Turkish baths (Hammam) that date back centuries.",
    historicalSummary: "Founded as Flavia Neapolis by Roman Emperor Vespasian in 72 CE, Nablus has a rich political and commercial history. Its dense, labyrinthine Old City is an architectural gem of stone vaults, natural water springs, and historic clock towers, representing the trading spirit of the Levant.",
    landmarks: [
      "Historic Nablus Soap Factories (Touqan)",
      "The Clock Tower & Al-Nasr Square",
      "Traditional Hammam al-Shifa",
      "Ancient Samaritan Quarter on Mount Gerizim"
    ]
  },
  {
    id: "gaza",
    name: "Gaza City",
    arabicName: "غزة",
    lat: 31.5016,
    lng: 34.4668,
    coverImage: "https://images.unsplash.com/photo-1548682650-f8646b5a363a?auto=format&fit=crop&q=80&w=1200",
    summary: "A legendary coastal harbor on the Mediterranean Sea, connecting ancient Asian and African trade routes.",
    culturalImportance: "Celebrated for its historic fishing culture, spice trade, traditional clay pottery, and sea-kissed citrus and olive orchards. The city represents a resilient seafaring memory and Levant-Mediterranean cultural synthesis.",
    historicalSummary: "Dating back to the 15th century BCE, Gaza is one of the oldest ports in history. It served as a strategic prize for Pharaohs, Philistines, Romans, and Byzantines. It is home to the stunning Great Al-Omari Mosque, built on a basilica foundation, and the historic Church of Saint Porphyrius, showing a rich tapestry of faith.",
    landmarks: [
      "Great Al-Omari Mosque",
      "The Port of Gaza",
      "Qasr al-Basha (Pasha Palace Museum)",
      "Sayed al-Hashim Mosque"
    ]
  },
  {
    id: "jaffa",
    name: "Jaffa",
    arabicName: "يافا",
    lat: 32.0528,
    lng: 34.7522,
    coverImage: "https://images.unsplash.com/photo-1517404212738-15263e9f9178?auto=format&fit=crop&q=80&w=1200",
    summary: "Known as 'The Bride of the Sea' (عروس البحر), an ancient maritime port famous for golden citrus groves and coastal stone arches.",
    culturalImportance: "The cultural, artistic, and literary heart of Palestine in the early 20th century. Famous for Jaffa Oranges exported worldwide, historic sea-front stone cafes, and fisherman cooperatives that maintain a deep, blue Mediterranean legacy.",
    historicalSummary: "Mentioned in ancient Egyptian documents and Greek legends (Andromeda's rock), Jaffa has been a key port for over 4,000 years. Its beautiful hilltop Old City overlooks a harbor that welcomed travelers, merchants, and orange freighters, framed by Ottoman stone arches and a prominent seaside clock tower.",
    landmarks: [
      "The Jaffa Clock Tower",
      "The Ancient Port of Jaffa",
      "Al-Bahr Mosque (The Sea Mosque)",
      "Saray al-Atiqa (Old Government House)"
    ]
  },
  {
    id: "haifa",
    name: "Haifa",
    arabicName: "حيفا",
    lat: 32.8191,
    lng: 34.9996,
    coverImage: "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=1200",
    summary: "Where Mount Carmel meets the blue Mediterranean Sea, a stunning coastal city of sea breezes and stone-built terraces.",
    culturalImportance: "A historic beacon of diversity, co-existence, and coastal industry. Famous for seaside stone villas, Mount Carmel cable cars, and traditional coastal fishing lore.",
    historicalSummary: "Rebuilt as a fortified city in 1761 by Daher al-Omar, Haifa flourished as a major Mediterranean trade terminal and railway junction. The city climbs from its natural deep-water bay up the steep green pine slopes of Mount Carmel, representing a masterpiece of modern Levantine harbor geography.",
    landmarks: [
      "Mount Carmel Cliffs",
      "The German Colony Stone Houses",
      "Stella Maris Seaside Monastery",
      "Wadi Nisnas Cultural Market"
    ]
  }
];

export const voiceOptions: { name: string; voiceName: string; gender: "Male" | "Female"; description: string }[] = [
  { name: "Sami (Cheer)", voiceName: "Kore", gender: "Male", description: "Deep, warm, and comforting traditional narrator tone." },
  { name: "Layla (Bright)", voiceName: "Puck", gender: "Female", description: "Engaging, clear, and vibrant guiding voice." },
  { name: "Zein (Resonant)", voiceName: "Zephyr", gender: "Male", description: "Smooth, calm, and highly intellectual poetic style." },
  { name: "Fatima (Sincere)", voiceName: "Charon", gender: "Female", description: "Soft, emotional, and rich historical storyteller voice." },
  { name: "Tareq (Bold)", voiceName: "Fenrir", gender: "Male", description: "Enthusiastic, strong, and highly epic narrative voice." }
];
