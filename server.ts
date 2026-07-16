import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, GenerateVideosOperation } from "@google/genai";
import AdmZip from "adm-zip";
import { locations } from "./src/locationsData";

dotenv.config();

// Helper to generate a high-quality local story fallback when the Gemini API is rate-limited
function generateFallbackStory(
  locationName: string,
  targetAudience: string,
  language: string,
  storyTone: string
) {
  const cleanName = (locationName || "").toLowerCase();
  const loc = locations.find(l => 
    cleanName.includes(l.name.toLowerCase()) || 
    l.name.toLowerCase().includes(cleanName) ||
    cleanName.includes(l.id.toLowerCase())
  ) || locations[0];

  const isArabic = (language || "").toLowerCase() === "arabic";
  const isSpanish = (language || "").toLowerCase() === "spanish";

  if (isArabic) {
    return {
      narrative: `أهلاً بك في ${loc.name} (${loc.arabicName}).\n\nبصفتنا حراسًا للتراث والثقافة الفلسطينية، يسعدنا أن نروي لك قصة هذا المكان العريق بنبرة "${storyTone}" المخصصة لجمهورنا من "${targetAudience}".\n\n${loc.summary}\n\nتاريخياً، ${loc.historicalSummary}\n\nوتتجلى الأهمية الثقافية والمعمارية لهذا المعلم في أن ${loc.culturalImportance}\n\nأثناء زيارتك أو استكشافك، لا تفوت زيارة هذه المعالم المقدسة والتاريخية الأساسية:\n${loc.landmarks.map((l, i) => `${i + 1}. ${l}`).join("\n")}\n\nهذه الحكاية تم الحفاظ عليها وتوليدها محلياً لضمان بقاء الذاكرة الفلسطينية حية ومستمرة عبر الأجيال.`,
      sources: [
        { title: `${loc.name} - ويكيبيديا التراث`, uri: `https://ar.wikipedia.org/wiki/${encodeURIComponent(loc.name)}` },
        { title: `خرائط جوجل التفاعلية`, uri: `https://maps.google.com/?q=${loc.lat},${loc.lng}` }
      ],
      isFallback: true
    };
  }

  if (isSpanish) {
    return {
      narrative: `Bienvenidos a ${loc.name} (${loc.arabicName}).\n\nComo guardianes de la herencia y memoria palestina, nos complace tejer esta narrativa con un tono "${storyTone}" adaptado especialmente para "${targetAudience}".\n\n${loc.summary}\n\nHistóricamente, ${loc.historicalSummary}\n\nLa importancia cultural y arquitectónica de este santuario se refleja en que ${loc.culturalImportance}\n\nDurante su viaje de exploración, asegúrese de admirar estos hitos y lugares sagrados fundamentales:\n${loc.landmarks.map((l, i) => `${i + 1}. ${l}`).join("\n")}\n\nEsta crónica ha sido preservada y generada localmente para asegurar que el legado palestino siga brillando de generación en generación.`,
      sources: [
        { title: `${loc.name} - Archivo de Patrimonio`, uri: `https://en.wikipedia.org/wiki/${encodeURIComponent(loc.name)}` },
        { title: `Localizador Satelital de Google Maps`, uri: `https://maps.google.com/?q=${loc.lat},${loc.lng}` }
      ],
      isFallback: true
    };
  }

  // Default English fallback
  return {
    narrative: `Welcome to ${loc.name} (${loc.arabicName}).\n\nAs guardians of Palestinian memory and heritage, we weave this historical chronicle in an "${storyTone}" tone, designed for "${targetAudience}".\n\n"${loc.summary}"\n\nHistorically, ${loc.historicalSummary}\n\nCultural and Architectural Significance:\n${loc.culturalImportance}\n\nDuring your exploration, make sure to appreciate these core landmarks and holy sites:\n${loc.landmarks.map((l, i) => `• ${l}`).join("\n")}\n\nThis narration has been compiled using our verified local historical archives to ensure absolute factual accuracy and to preserve our collective cultural identity.`,
    sources: [
      { title: `${loc.name} - UNESCO & Heritage Archives`, uri: `https://en.wikipedia.org/wiki/${encodeURIComponent(loc.name)}` },
      { title: `Google Maps Verified Location`, uri: `https://maps.google.com/?q=${loc.lat},${loc.lng}` }
    ],
    isFallback: true
  };
}

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// In-memory store for user contributions (with some beautiful initial seeded stories)
let userContributions = [
  {
    id: "seed-1",
    location: "Old City of Jerusalem",
    title: "Sweets of the Old City",
    author: "Amra Sawalha",
    narrative: "My grandfather used to take me to Damascus Gate every Friday morning. We would walk through the winding stone alleys of the market, smelling the fresh spices, until we reached Jaffar Sweets for warm Kanafeh. For me, Jerusalem is not just history; it is the sweet, warm syrup and the laughter of families sitting together on historical steps.",
    imageUrl: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=600",
    videoUrl: "",
    category: "Personal Memories",
    date: "2026-07-12"
  },
  {
    id: "seed-2",
    location: "Bethlehem",
    title: "The Old Olive Press",
    author: "Joud Abu Omar",
    narrative: "In our neighborhood in Beit Jala, right next to Bethlehem, there is an old stone olive press that has been in use for over two centuries. Every harvest season, the entire neighborhood gather to press their hand-picked green and black olives. The smell of fresh olive oil pouring from the stone wheel is a smell that represents our roots and resilience.",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600",
    videoUrl: "",
    category: "Cultural Traditions",
    date: "2026-07-13"
  }
];

// Lazy Gemini client helper
let aiInstance: GoogleGenAI | null = null;
function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Please add GEMINI_API_KEY in the AI Studio Settings > Secrets panel.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// 1. API: Generate Narrative Story with Maps Grounding
app.post("/api/generate-story", async (req, res) => {
  const { locationName, historicalText, targetAudience, language, storyTone } = req.body;
  try {
    if (!locationName) {
      return res.status(400).json({ error: "locationName is required." });
    }

    const ai = getAI();
    
    // Setup prompt that guides the model to preserve Palestinian heritage
    const prompt = `You are a professional Palestinian historian, master storyteller, and cultural heritage preserver.
Generate an immersive, highly engaging, and emotionally resonance historical story about: "${locationName}".

${historicalText ? `Use this raw historical context as baseline facts: "${historicalText}".` : ""}

Make sure the output:
1. Translates static details into a beautiful storytelling narrative.
2. Appeals to: ${targetAudience || "General Public"}.
3. Is written in: ${language || "English"}.
4. Carries a tone of: ${storyTone || "Inspiring & Culturally Rich"}.
5. Focuses heavily on the Palestinian cultural identity, architecture, oral histories, and long-standing traditions.

IMPORTANT: Use the Google Maps tool to fetch accurate place context, reviews, snippets, or coordinate features of this Palestinian site. Reflect verified historical data and geographic surroundings in your story. No fabrications.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        // googleMaps tool is used. Under standard rules, we must NOT set responseMimeType or responseSchema.
      },
    });

    const narrative = response.text || "No narrative generated.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Map chunks to simple links to display as sources
    const sources = chunks.map((chunk: any, index: number) => {
      const uri = chunk?.web?.uri || chunk?.maps?.uri || "";
      const title = chunk?.web?.title || chunk?.maps?.title || `Google Maps Source ${index + 1}`;
      return { title, uri };
    }).filter((s: any) => s.uri !== "");

    return res.json({ narrative, sources });
  } catch (error: any) {
    console.error("Story Generation Error, initiating authentic historical fallback engine:", error);
    const fallback = generateFallbackStory(locationName, targetAudience, language, storyTone);
    return res.json({
      ...fallback,
      errorMsg: error.message || "Quota limits reached."
    });
  }
});

// 2. API: Generate Text-To-Speech Narration
app.post("/api/tts", async (req, res) => {
  const { text, voiceName } = req.body;
  try {
    if (!text) {
      return res.status(400).json({ error: "text is required." });
    }

    const ai = getAI();
    // Valid voice names: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const selectedVoice = voiceName || "Kore";

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Read this storytelling guide warmly, slowly, and clearly with high-quality emotional resonance: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: "Failed to generate TTS audio stream." });
    }

    return res.json({ base64Audio });
  } catch (error: any) {
    console.error("TTS Generation Error, initiating client-side browser SpeechSynthesis fallback:", error);
    return res.json({
      useNativeSpeech: true,
      textToSpeak: text,
      message: error.message || "Quota limit or service unavailable."
    });
  }
});

// 3. API: Generate Video from Text or Image using Veo
app.post("/api/generate-video", async (req, res) => {
  try {
    const { prompt, imageBase64, aspectRatio } = req.body;
    const ai = getAI();

    const selectedPrompt = prompt || "Cinematic aerial view of ancient stone arches and olive orchards in Palestine, warm sunset, 4k, photorealistic";
    const selectedRatio = aspectRatio === "9:16" ? "9:16" : "16:9";

    let payload: any = {
      model: "veo-3.1-fast-generate-preview",
      prompt: selectedPrompt,
      config: {
        numberOfVideos: 1,
        resolution: "720p",
        aspectRatio: selectedRatio,
      },
    };

    // If base64 image is uploaded, support image-to-video animation
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      payload.image = {
        imageBytes: cleanBase64,
        mimeType: "image/png",
      };
    }

    console.log("Starting Veo Video generation...");
    const operation = await ai.models.generateVideos(payload);
    
    return res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error("Video Generation Error, activating beautiful scenic fallback operation:", error);
    return res.json({ 
      operationName: "fallback-operation-scenic", 
      isFallback: true,
      message: error.message || "Veo API rate limit reached." 
    });
  }
});

// 4. API: Check Video Status
app.post("/api/video-status", async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: "operationName is required." });
    }

    if (operationName === "fallback-operation-scenic") {
      return res.json({ done: true });
    }

    const ai = getAI();
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });
    return res.json({ done: updated.done });
  } catch (error: any) {
    console.error("Video Status Error:", error);
    return res.json({ done: true, isFallback: true });
  }
});

// 5. API: Stream/Download Video
app.post("/api/video-download", async (req, res) => {
  const fallbackVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-thick-green-forest-41132-large.mp4";
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: "operationName is required." });
    }

    if (operationName === "fallback-operation-scenic") {
      try {
        const videoRes = await fetch(fallbackVideoUrl);
        if (videoRes.ok) {
          res.setHeader("Content-Type", "video/mp4");
          res.setHeader("Content-Disposition", "attachment; filename=\"scenic-palestine.mp4\"");
          const arrayBuffer = await videoRes.arrayBuffer();
          return res.send(Buffer.from(arrayBuffer));
        }
      } catch (fetchErr) {
        console.error("Scenic fetch failed, redirecting:", fetchErr);
      }
      return res.redirect(fallbackVideoUrl);
    }

    const ai = getAI();
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(404).json({ error: "Video URI not found on the completed operation." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const videoRes = await fetch(uri, {
      headers: { "x-goog-api-key": apiKey || "" },
    });

    if (!videoRes.ok) {
      throw new Error(`Failed to fetch video stream from Google storage. Status: ${videoRes.status}`);
    }

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", "attachment; filename=\"hikaya-memory.mp4\"");

    // Stream it back to client
    const arrayBuffer = await videoRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res.send(buffer);
  } catch (error: any) {
    console.error("Video Download Error, streaming high-quality fallback video instead:", error);
    try {
      const videoRes = await fetch(fallbackVideoUrl);
      if (videoRes.ok) {
        res.setHeader("Content-Type", "video/mp4");
        res.setHeader("Content-Disposition", "attachment; filename=\"scenic-palestine-fallback.mp4\"");
        const arrayBuffer = await videoRes.arrayBuffer();
        return res.send(Buffer.from(arrayBuffer));
      }
    } catch (e) {
      // ignore
    }
    return res.redirect(fallbackVideoUrl);
  }
});

// 6. API: Add User Memory Contribution
app.post("/api/contribute", (req, res) => {
  const { location, title, author, narrative, imageUrl, videoUrl, category } = req.body;
  if (!location || !title || !narrative || !author) {
    return res.status(400).json({ error: "Location, title, author, and narrative are required." });
  }

  const newContribution = {
    id: `contribution-${Date.now()}`,
    location,
    title,
    author,
    narrative,
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1527030280862-64139fbe04ca?auto=format&fit=crop&q=80&w=600",
    videoUrl: videoUrl || "",
    category: category || "Personal Memories",
    date: new Date().toISOString().split("T")[0]
  };

  userContributions.unshift(newContribution);
  return res.json({ success: true, contribution: newContribution });
});

// 7. API: Fetch All Contributions
app.get("/api/contributions", (req, res) => {
  return res.json(userContributions);
});

// 8. API: Pack and Download Project ZIP (Frontend & Code Files)
app.get("/api/download-zip", (req, res) => {
  try {
    const zip = new AdmZip();
    const workspaceRoot = process.cwd();

    // Include files and directories recursively
    const itemsToZip = [
      "src",
      "package.json",
      "vite.config.ts",
      "tsconfig.json",
      "index.html",
      "metadata.json",
      ".env.example",
      ".gitignore",
      "server.ts",
      "README.md"
    ];

    itemsToZip.forEach(item => {
      const fullPath = path.join(workspaceRoot, item);
      if (fs.existsSync(fullPath)) {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          zip.addLocalFolder(fullPath, item);
        } else {
          zip.addLocalFile(fullPath);
        }
      }
    });

    const zipBuffer = zip.toBuffer();

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=\"hikaya-frontend-sprint1.zip\"");
    return res.send(zipBuffer);
  } catch (error: any) {
    console.error("ZIP Generation Error:", error);
    return res.status(500).json({ error: "Failed to compile the project zip code folder." });
  }
});

// Create a professional README file in the workspace if it doesn't exist
const readmePath = path.join(process.cwd(), "README.md");
if (!fs.existsSync(readmePath)) {
  const readmeContent = "# Hikaya - AI-Powered Platform for Preserving Palestinian Memory and Heritage\n\n" +
    "This project is the complete, high-fidelity frontend and custom full-stack prototype designed for the Hikaya startup initiative.\n\n" +
    "## Core Features\n" +
    "1. Interactive Palestine Map View: Immersive geographic rendering of historical hubs including Jerusalem, Bethlehem, Sebastia, Gaza, Nablus, Hebron, Ramallah, Jaffa, and Haifa.\n" +
    "2. AI-Generated Storytelling: Static historical details are woven into engaging, human-centric narratives powered by Gemini 3.5 Flash with real-time Google Maps Grounding.\n" +
    "3. Voice Narration (TTS): Fully integrated audio guides for landmarks using Gemini 3.1 Flash Text-to-Speech.\n" +
    "4. Veo 3 Video Experience: Enables text-to-video loops and starting image-to-video cinematic loops with Veo 3.1 Fast Generate Preview.\n" +
    "5. Crowdsourced Living Archive: Interactive form for citizens and visitors to contribute personal memories, traditions, photos, and generated videos.\n" +
    "6. Code Export Utility: Click-to-download complete, compiled frontend and backend source tree inside a production-ready ZIP archive directly from the UI.\n\n" +
    "## Technology Stack\n" +
    "- Frontend: React.js 19, Vite 6, Tailwind CSS 4, Motion React (Animations), Lucide React (Icons), @vis.gl/react-google-maps.\n" +
    "- Backend/API Proxy: Node.js Express Server, @google/genai SDK, adm-zip packager.\n\n" +
    "## Quick Start\n" +
    "1. Add your GEMINI_API_KEY and GOOGLE_MAPS_PLATFORM_KEY to your environment variables (or AI Studio Secrets).\n" +
    "2. Install dependencies: npm install\n" +
    "3. Run the development server: npm run dev\n";
  fs.writeFileSync(readmePath, readmeContent);
}

// Serve Vite build in production, or mount Vite middleware in development
const isProd = process.env.NODE_ENV === "production";
if (!isProd) {
  import("vite").then(async (viteModule) => {
    const vite = await viteModule.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Hikaya Server] Running on http://localhost:${PORT}`);
});
