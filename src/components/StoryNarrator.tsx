import React, { useState, useRef } from "react";
import { LocationData, VoiceOption, GroundingSource } from "../types";
import { voiceOptions } from "../locationsData";
import { Sparkles, Play, Pause, Square, Volume2, Globe, Users, Smile, HelpCircle, ArrowRight, Music } from "lucide-react";

interface StoryNarratorProps {
  location: LocationData;
}

export const StoryNarrator: React.FC<StoryNarratorProps> = ({ location }) => {
  // Parameters
  const [tone, setTone] = useState<string>("Inspiring & Culturally Rich");
  const [audience, setAudience] = useState<string>("Younger Generations");
  const [language, setLanguage] = useState<string>("English");
  const [voice, setVoice] = useState<VoiceOption>(voiceOptions[0]);

  // States
  const [loading, setLoading] = useState<boolean>(false);
  const [narrative, setNarrative] = useState<string>("");
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  // Audio play states
  const [ttsLoading, setTtsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nativeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean up native speech synthesis on unmount
  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Speech API fallback for rate-limited voiceover
  const speakTextNative = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setError("Speech synthesis is not supported in this browser.");
      return;
    }

    // Cancel any active speech
    window.speechSynthesis.cancel();

    // Remove markdown characters for cleaner speech output
    const cleanedText = text.replace(/[*#_`•\n]/g, " ").trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    // Select a matching voice
    const voices = window.speechSynthesis.getVoices();
    const isAr = language === "Arabic";
    const langCode = isAr ? "ar" : "en";
    const matchingVoices = voices.filter((v) => v.lang.startsWith(langCode));

    if (matchingVoices.length > 0) {
      const isFemale = voice.gender === "Female";
      const matched = matchingVoices.find((v) => {
        const n = v.name.toLowerCase();
        if (isFemale) {
          return n.includes("female") || n.includes("zira") || n.includes("samantha") || n.includes("karen") || n.includes("google") || n.includes("hazel") || n.includes("hoda");
        } else {
          return n.includes("male") || n.includes("david") || n.includes("mark") || n.includes("george") || n.includes("tarik");
        }
      }) || matchingVoices[0];
      utterance.voice = matched;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
      nativeUtteranceRef.current = null;
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesisUtterance error:", e);
      setIsPlaying(false);
      nativeUtteranceRef.current = null;
    };

    nativeUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // Generate Narrated Story via Gemini API + Maps Grounding
  const handleGenerateStory = async () => {
    setLoading(true);
    setError(null);
    setNarrative("");
    setSources([]);
    setIsFallback(false);
    // Stop any playing audio
    handleStopAudio();

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationName: location.name,
          historicalText: location.historicalSummary + "\n" + location.culturalImportance,
          targetAudience: audience,
          language: language,
          storyTone: tone,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to synthesize narrative.");
      }

      setNarrative(data.narrative);
      setSources(data.sources || []);
      if (data.isFallback) {
        setIsFallback(true);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during AI narrative generation.");
    } finally {
      setLoading(false);
    }
  };

  // Generate TTS Audio via Gemini API with SpeechSynthesis fallback
  const handlePlayAudio = async () => {
    if (isPlaying) {
      handleStopAudio();
      return;
    }

    if (audioRef.current && audioRef.current.src) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    const textToSpeak = narrative || `Welcome to ${location.name}. ${location.summary}. ${location.culturalImportance}`;
    setTtsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSpeak,
          voiceName: voice.voiceName,
        }),
      });

      const data = await response.json();
      
      // If we got native speech command or server failed/quota exceeded, run speech synthesis fallback
      if (!response.ok || data.useNativeSpeech || !data.base64Audio) {
        console.warn("Gemini Voice API rate-limited or unavailable. Activating browser SpeechSynthesis...");
        speakTextNative(textToSpeak);
        return;
      }

      // Load base64 audio inside HTML5 Audio constructor
      const base64Audio = data.base64Audio;
      const audioUrl = `data:audio/wav;base64,${base64Audio}`;
      const newAudio = new Audio(audioUrl);
      
      newAudio.onended = () => {
        setIsPlaying(false);
      };

      newAudio.onerror = (e) => {
        console.error("Audio playback error, falling back to browser SpeechSynthesis", e);
        speakTextNative(textToSpeak);
      };

      audioRef.current = newAudio;
      newAudio.play();
      setIsPlaying(true);
    } catch (err: any) {
      console.warn("TTS fetch failed, falling back to local speech synthesis:", err);
      speakTextNative(textToSpeak);
    } finally {
      setTtsLoading(false);
    }
  };

  const handleStopAudio = () => {
    // Stop Gemini Audio Player
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    // Stop browser native speech
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    nativeUtteranceRef.current = null;
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Parameter Settings Panel */}
      <div className="bg-brand-olive text-brand-bg p-6 rounded-2xl border border-brand-olive/20 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 tatreez-grid pointer-events-none opacity-5" />
        <h3 className="font-serif font-bold text-sm text-brand-amber flex items-center gap-2 mb-4 relative z-10">
          <Sparkles className="w-4 h-4 text-brand-amber animate-pulse" />
          Narrative Synthesis Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {/* Tone Selector */}
          <div className="flex flex-col space-y-1">
            <label className="text-[9px] text-stone-300 font-mono tracking-widest uppercase flex items-center gap-1">
              <Smile className="w-3 h-3 text-brand-amber" /> Story Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="bg-[#4a4a35] border border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-brand-amber text-brand-bg focus:outline-none"
            >
              <option value="Inspiring & Culturally Rich" className="bg-[#4a4a35]">Inspiring & Rich</option>
              <option value="Poetic & Nostalgic" className="bg-[#4a4a35]">Poetic & Nostalgic</option>
              <option value="Educational & Factual" className="bg-[#4a4a35]">Educational & Factual</option>
              <option value="Epic & Ancient Legends" className="bg-[#4a4a35]">Epic & Ancient</option>
            </select>
          </div>

          {/* Target Audience */}
          <div className="flex flex-col space-y-1">
            <label className="text-[9px] text-stone-300 font-mono tracking-widest uppercase flex items-center gap-1">
              <Users className="w-3 h-3 text-brand-amber" /> Target Audience
            </label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="bg-[#4a4a35] border border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-brand-amber text-brand-bg focus:outline-none"
            >
              <option value="Younger Generations" className="bg-[#4a4a35]">Younger Generations</option>
              <option value="International Tourists" className="bg-[#4a4a35]">International Tourists</option>
              <option value="Historians & Researchers" className="bg-[#4a4a35]">Historians</option>
              <option value="Children & Storytellers" className="bg-[#4a4a35]">Children</option>
            </select>
          </div>

          {/* Language selection */}
          <div className="flex flex-col space-y-1">
            <label className="text-[9px] text-stone-300 font-mono tracking-widest uppercase flex items-center gap-1">
              <Globe className="w-3 h-3 text-brand-amber" /> Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#4a4a35] border border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-brand-amber text-brand-bg focus:outline-none"
            >
              <option value="English" className="bg-[#4a4a35]">English</option>
              <option value="Arabic" className="bg-[#4a4a35]">العربية (Arabic)</option>
              <option value="Spanish" className="bg-[#4a4a35]">Español (Spanish)</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateStory}
          disabled={loading}
          className="mt-6 w-full bg-brand-amber hover:bg-[#b45309] disabled:bg-[#4a4a35] disabled:cursor-not-allowed text-white font-serif text-xs font-black tracking-widest uppercase py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-stone-200 border-t-transparent rounded-full animate-spin" />
              Preserving & Weaving narrative (Google Maps Grounding enabled)...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              Synthesize Culturally Rooted Story
            </>
          )}
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-xs rounded-xl flex flex-col gap-1.5">
          <span className="font-bold">Narrative Error:</span>
          <span>{error}</span>
          <span className="text-[10px] text-brand-amber/80 font-mono">
            Note: If you are seeing a 403, please make sure your GEMINI_API_KEY is pasted in Settings (⚙️ top-right) &gt; Secrets.
          </span>
        </div>
      )}

      {/* Narrative Output area */}
      <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-sm">
        {narrative ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-brand-border-light pb-4 gap-4">
              <div>
                <h4 className="font-serif font-black text-lg text-brand-olive">
                  AI Preserved Narrative Guide
                </h4>
                <p className="text-[10px] text-brand-muted font-mono tracking-wider uppercase mt-1">
                  Tone: {tone} • Audience: {audience} • Lang: {language}
                </p>
              </div>

              {/* Integrated Retro Audio Guide Box */}
              <div className="flex items-center gap-2 bg-brand-bg border border-brand-border p-2 rounded-full">
                {/* Voice guide selector */}
                <select
                  value={voice.name}
                  onChange={(e) => {
                    const selected = voiceOptions.find((v) => v.name === e.target.value);
                    if (selected) setVoice(selected);
                  }}
                  className="bg-white border border-brand-border text-[10px] px-3 py-1 rounded-full text-brand-olive font-serif font-black tracking-wider uppercase focus:ring-0 focus:outline-none cursor-pointer"
                >
                  {voiceOptions.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name.toUpperCase()} ({v.gender === "Female" ? "F" : "M"})
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePlayAudio}
                    disabled={ttsLoading}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-olive text-brand-bg hover:bg-[#4a4a35] disabled:opacity-50 transition-colors"
                    title="Play Audio Guide"
                  >
                    {ttsLoading ? (
                      <div className="w-3.5 h-3.5 border border-stone-200 border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="w-3 h-3 fill-current" />
                    ) : (
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={handleStopAudio}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-bg text-brand-olive hover:bg-brand-border border border-brand-border transition-colors"
                    title="Stop Playback"
                  >
                    <Square className="w-2.5 h-2.5 fill-current" />
                  </button>
                </div>
              </div>
            </div>

            {isFallback && (
              <div className="p-4 bg-brand-amber/10 border border-brand-amber/30 text-brand-olive text-xs rounded-xl flex items-start gap-2.5 animate-fade-in">
                <Sparkles className="w-4 h-4 text-brand-amber shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <span className="font-serif font-black tracking-wider uppercase text-[10px] text-brand-amber block">
                    Backup Heritage Storage Active (API Quota Limit Met)
                  </span>
                  <p className="text-[11px] leading-relaxed text-stone-600">
                    The live Gemini API limit has been reached. We have automatically activated our beautifully crafted offline cultural archive for <b>{location.name}</b> to provide uninterrupted historical narration!
                  </p>
                </div>
              </div>
            )}

            {/* Narrative text block */}
            <div className="font-serif text-brand-text text-sm leading-relaxed whitespace-pre-line border-l-4 border-brand-amber pl-4 italic">
              {narrative}
            </div>

            {/* Audio guide waves visualisation when active */}
            {isPlaying && (
              <div className="flex items-center gap-2 p-3 bg-brand-bg rounded-xl border border-brand-border-light animate-pulse text-brand-olive text-[11px] font-mono">
                <Music className="w-3.5 h-3.5 text-brand-amber" />
                <span>Streaming Voice Guide ({voice.name})...</span>
                <div className="flex gap-0.5 ml-auto">
                  <div className="w-0.5 h-3 bg-brand-olive animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-0.5 h-4 bg-brand-olive animate-bounce" style={{ animationDelay: "0.3s" }} />
                  <div className="w-0.5 h-2.5 bg-brand-olive animate-bounce" style={{ animationDelay: "0.5s" }} />
                  <div className="w-0.5 h-3.5 bg-brand-olive animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            )}

            {/* Google Maps Grounding Sources */}
            {sources.length > 0 && (
              <div className="border-t border-brand-border-light pt-4">
                <span className="text-[9px] text-brand-muted font-mono tracking-widest uppercase block mb-2">
                  Grounding & Verified Sources (Google Maps API):
                </span>
                <div className="flex flex-wrap gap-2">
                  {sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-brand-bg hover:bg-brand-border-light text-brand-olive border border-brand-border text-[10px] px-3.5 py-1.5 rounded-full flex items-center gap-1 font-serif font-black tracking-wider uppercase transition-colors"
                    >
                      <span>{source.title}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center text-brand-muted space-y-3">
            <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-brand-amber">
              <Volume2 className="w-5 h-5" />
            </div>
            <div className="max-w-md">
              <h5 className="font-serif font-bold text-xs text-brand-text uppercase tracking-widest mb-1">
                Story Mode Standby
              </h5>
              <p className="text-xs text-brand-muted leading-relaxed">
                Click the button in the panel above to command Gemini to weave an interactive cultural narration. If you want a voiceover right away, click the Play button to hear the default overview.
              </p>
            </div>
            {/* Quick-play default overview */}
            <button
              onClick={handlePlayAudio}
              disabled={ttsLoading}
              className="mt-2 text-[10px] font-serif font-black tracking-widest uppercase text-brand-olive hover:text-brand-amber underline flex items-center gap-1.5"
            >
              {ttsLoading ? "Generating..." : "Play Default Audio Overview Guide Instead"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
