import React, { useState, useEffect } from "react";
import { LocationData, Contribution } from "../types";
import { Upload, Video, Play, ShieldAlert, Sparkles, Image as ImageIcon, CheckCircle, Loader2, Calendar, User } from "lucide-react";

interface ContributionsListProps {
  location: LocationData;
}

export const ContributionsList: React.FC<ContributionsListProps> = ({ location }) => {
  // Lists
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);

  // Form states
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [narrative, setNarrative] = useState<string>("");
  const [category, setCategory] = useState<string>("Personal Memories");
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  
  // Veo AI generation states
  const [generateWithVeo, setGenerateWithVeo] = useState<boolean>(false);
  const [veoPrompt, setVeoPrompt] = useState<string>("");
  const [veoRatio, setVeoRatio] = useState<"16:9" | "9:16">("16:9");
  
  // Generation status tracking
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [videoState, setVideoState] = useState<"idle" | "starting" | "polling" | "downloading" | "completed" | "failed">("idle");
  const [veoStatusMsg, setVeoStatusMsg] = useState<string>("");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Load contributions of active location
  const fetchContributions = async () => {
    try {
      setLoadingList(true);
      const res = await fetch("/api/contributions");
      if (res.ok) {
        const data = await res.json();
        // Filter by current location name or id
        const filtered = data.filter((c: Contribution) => 
          c.location.toLowerCase() === location.name.toLowerCase() || 
          c.location.toLowerCase() === location.id.toLowerCase()
        );
        setContributions(filtered);
      }
    } catch (err) {
      console.error("Error loading contributions:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, [location]);

  // Handle drag and drop image selection
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG/JPEG/WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  // Poll Veo video status until completed
  const pollVideoStatus = (operationName: string) => {
    setVideoState("polling");
    setVeoStatusMsg("Cinematic Veo models are rendering your video clip (usually takes 30-60 seconds)...");

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 30) { // Timeout after 2.5 minutes
        clearInterval(interval);
        setVideoState("failed");
        setError("Video synthesis timed out on the background network.");
        return;
      }

      try {
        const statusRes = await fetch("/api/video-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName }),
        });
        const statusData = await statusRes.json();

        if (statusData.done) {
          clearInterval(interval);
          downloadGeneratedVideo(operationName);
        } else {
          // Provide creative rotation messages
          const rotationMsgs = [
            "Weaving traditional limestone arches into high-fidelity pixels...",
            "Sensing details of ancient Palestine landscapes...",
            "Synthesizing lighting, shadow, and cinematic depth details...",
            "Fine-tuning traditional textures with Veo generative kernels..."
          ];
          setVeoStatusMsg(rotationMsgs[attempts % rotationMsgs.length]);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000); // Poll every 5 seconds
  };

  // Download video loop from proxy and create local URL
  const downloadGeneratedVideo = async (operationName: string) => {
    setVideoState("downloading");
    setVeoStatusMsg("Downloading finished movie stream from storage secure proxy...");

    try {
      const response = await fetch("/api/video-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationName }),
      });

      if (!response.ok) {
        throw new Error("Could not download final video file.");
      }

      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      setGeneratedVideoUrl(localUrl);
      setVideoState("completed");
      setVeoStatusMsg("Veo 3 Cinematic clip generated successfully!");
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch or play back final video stream.");
      setVideoState("failed");
    }
  };

  // Form Submit Action
  const handleSubmitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !narrative) {
      setError("Please complete all required fields (Title, Author, Memory Text).");
      return;
    }

    setSubmitting(true);
    setError(null);

    let activeVideoUrl = generatedVideoUrl;

    // Start video generation if requested and not already finished
    if (generateWithVeo && !generatedVideoUrl && videoState === "idle") {
      try {
        setVideoState("starting");
        setVeoStatusMsg("Calling Veo 3 Video AI Generator API...");

        const response = await fetch("/api/generate-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: veoPrompt || `Cinematic cinematic pan over ${location.name}, ancient stone architecture, sun rays, cinematic, 4k`,
            imageBase64: uploadImage,
            aspectRatio: veoRatio,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to call Veo generation.");
        }

        // Start polling loop
        pollVideoStatus(data.operationName);
        setSubmitting(false); // Let the user wait in the UI with polling state
        return;
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Could not launch Veo video model.");
        setVideoState("failed");
        setSubmitting(false);
        return;
      }
    }

    // Submit memory details
    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: location.name,
          title,
          author,
          narrative,
          imageUrl: uploadImage,
          videoUrl: activeVideoUrl,
          category,
        }),
      });

      if (res.ok) {
        // Reset state
        setTitle("");
        setAuthor("");
        setNarrative("");
        setUploadImage(null);
        setGeneratedVideoUrl("");
        setVeoPrompt("");
        setGenerateWithVeo(false);
        setVideoState("idle");
        
        // Refresh local items
        fetchContributions();
      } else {
        const d = await res.json();
        throw new Error(d.error || "Submission failed.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Crowd Sourced Memory Timeline */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-black text-2xl text-brand-olive flex items-center gap-2">
            Living Archive Timeline
            <span className="text-[10px] font-mono bg-brand-olive/10 text-brand-olive font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {contributions.length} Memories
            </span>
          </h4>
        </div>

        {loadingList ? (
          <div className="py-16 text-center text-brand-muted flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-brand-amber" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Loading crowdsourced timeline...</span>
          </div>
        ) : contributions.length === 0 ? (
          <div className="border border-dashed border-brand-border rounded-2xl p-8 text-center text-brand-muted bg-white/50">
            <ImageIcon className="w-8 h-8 mx-auto text-brand-amber/40 mb-3" />
            <h5 className="font-serif font-bold text-xs text-brand-text uppercase tracking-widest mb-1">
              No memories logged here yet
            </h5>
            <p className="text-xs text-brand-muted leading-relaxed max-w-sm mx-auto">
              Be the first to preserve a traditional story, ancestral recipe, or historical image of {location.name}! Use the form to your right to begin.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {contributions.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
              >
                {/* Media backdrop */}
                {(item.videoUrl || item.imageUrl) && (
                  <div className="relative w-full h-52 bg-brand-olive overflow-hidden flex items-center justify-center">
                    {item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        controls
                        className="w-full h-full object-cover"
                        poster={item.imageUrl}
                      />
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute top-4 right-4 bg-brand-olive/90 backdrop-blur-md text-brand-bg text-[9px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-brand-amber/20 shadow-md">
                      {item.videoUrl ? "AI Animated Reel" : "Photo Document"}
                    </span>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-brand-amber/10 text-brand-amber border border-brand-amber/20 font-serif font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-brand-muted flex items-center gap-1 font-mono tracking-wider ml-auto">
                      <Calendar className="w-3.5 h-3.5 text-brand-amber" /> {item.date}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-serif font-black text-xl text-brand-olive leading-tight">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-brand-muted font-serif font-bold flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-brand-amber shrink-0" /> Recorded by: <span className="text-brand-text">{item.author}</span>
                    </p>
                  </div>

                  <p className="text-brand-text text-sm leading-relaxed whitespace-pre-line border-l-4 border-brand-amber pl-4 italic">
                    {item.narrative}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contribution Form Area */}
      <div className="lg:col-span-5 bg-white border border-brand-border rounded-3xl p-6 shadow-2xl space-y-6 h-fit relative overflow-hidden">
        <div className="absolute inset-0 tatreez-grid pointer-events-none opacity-5" />
        <div className="relative z-10">
          <h4 className="font-serif font-black text-xl text-brand-olive flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-amber" /> Add Story or Photograph
          </h4>
          <p className="text-xs text-brand-muted mt-1.5 leading-relaxed italic">
            Contribute oral recordings, traditional events, family memories, or animate scenery with Veo 3 Video AI.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-brand-amber/10 border border-brand-amber/20 rounded-xl text-brand-amber text-[11px] flex gap-1.5 items-start relative z-10">
            <ShieldAlert className="w-4 h-4 shrink-0 text-brand-amber" />
            <div className="space-y-1">
              <p className="font-bold">Verification Fail</p>
              <p className="text-[10px] leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Video progress indicator */}
        {videoState !== "idle" && videoState !== "completed" && (
          <div className="bg-brand-olive text-brand-bg p-5 rounded-2xl border border-brand-olive/20 space-y-2 text-center relative z-10">
            {videoState === "starting" || videoState === "polling" || videoState === "downloading" ? (
              <div className="flex flex-col items-center justify-center py-2 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-brand-amber" />
                <div className="space-y-1">
                  <span className="font-serif font-black text-xs text-brand-amber block uppercase tracking-widest">
                    Veo Video Generation Active
                  </span>
                  <p className="text-[10px] text-stone-300 leading-normal max-w-xs italic">
                    {veoStatusMsg}
                  </p>
                </div>
              </div>
            ) : videoState === "failed" ? (
              <div className="text-center py-2 space-y-1">
                <ShieldAlert className="w-5 h-5 mx-auto text-brand-amber" />
                <span className="font-serif font-black text-xs text-brand-amber block uppercase tracking-widest">
                  Generation Failed
                </span>
                <p className="text-[10px] text-stone-300">
                  Please check your API key configuration and try again.
                </p>
                <button
                  onClick={() => setVideoState("idle")}
                  className="mt-2 text-[10px] underline text-stone-400 hover:text-stone-200"
                >
                  Reset video generator
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Video preview when generated */}
        {videoState === "completed" && generatedVideoUrl && (
          <div className="bg-brand-olive rounded-2xl overflow-hidden border border-brand-amber/30 relative z-10 shadow-lg">
            <div className="p-4 border-b border-white/10 flex items-center justify-between text-brand-amber">
              <span className="font-serif text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-brand-amber" />
                Veo AI Video Generated Successfully!
              </span>
              <button
                onClick={() => {
                  setGeneratedVideoUrl("");
                  setVideoState("idle");
                }}
                className="text-[10px] text-stone-400 hover:text-stone-200 underline font-serif font-bold"
              >
                Clear Video
              </button>
            </div>
            <video src={generatedVideoUrl} controls className="w-full h-auto aspect-video object-cover" />
          </div>
        )}

        <form onSubmit={handleSubmitContribution} className="space-y-4 relative z-10">
          {/* Author */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] text-brand-muted font-mono tracking-widest uppercase font-bold">Author Name *</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Amra Sawalha"
              className="bg-brand-bg border border-brand-border rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-brand-olive text-brand-text focus:outline-none"
            />
          </div>

          {/* Title */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] text-brand-muted font-mono tracking-widest uppercase font-bold">Story Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Damascus Gate Aromas"
              className="bg-brand-bg border border-brand-border rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-brand-olive text-brand-text focus:outline-none"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] text-brand-muted font-mono tracking-widest uppercase font-bold">Heritage Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-brand-bg border border-brand-border rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-brand-olive text-brand-text focus:outline-none cursor-pointer"
            >
              <option value="Personal Memories">Personal Memories</option>
              <option value="Cultural Traditions">Cultural Traditions</option>
              <option value="Oral Histories">Oral Histories</option>
              <option value="Agricultural Heritage">Agricultural Heritage</option>
            </select>
          </div>

          {/* Narrative Text */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] text-brand-muted font-mono tracking-widest uppercase font-bold">Written Narrative *</label>
            <textarea
              required
              rows={4}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="Recall a special memory, oral history, family anecdote or local knowledge about this location..."
              className="bg-brand-bg border border-brand-border rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-brand-olive text-brand-text focus:outline-none resize-none"
            />
          </div>

          {/* Drag & Drop Photo Attachment */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] text-brand-muted font-mono tracking-widest uppercase font-bold">Attach Photographic Proof</label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-brand-border hover:border-brand-olive rounded-2xl p-4 text-center cursor-pointer bg-brand-bg transition-colors flex flex-col items-center justify-center gap-1.5 relative min-h-[100px]"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {uploadImage ? (
                <div className="flex items-center gap-3 w-full">
                  <img src={uploadImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="text-left overflow-hidden">
                    <span className="text-[10px] font-mono font-bold text-brand-olive block truncate">Image Attached</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadImage(null);
                      }}
                      className="text-[10px] text-brand-amber font-serif font-black tracking-wider uppercase underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-brand-muted" />
                  <span className="text-[11px] text-brand-muted">
                    Drag and drop your heritage photo here, or <span className="text-brand-olive underline font-bold">browse</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Veo video prompt option */}
          <div className="border border-brand-border rounded-2xl p-4 bg-brand-bg/50 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={generateWithVeo}
                onChange={(e) => setGenerateWithVeo(e.target.checked)}
                className="rounded border-brand-border text-brand-olive focus:ring-brand-olive w-3.5 h-3.5"
              />
              <span className="text-xs font-serif font-black text-brand-olive flex items-center gap-1.5 uppercase tracking-wider">
                <Video className="w-3.5 h-3.5 text-brand-amber" />
                Animate photo into cinematic loop (Veo 3 AI)
              </span>
            </label>

            {generateWithVeo && (
              <div className="space-y-3 pl-5 animate-fade-in">
                <div className="flex flex-col space-y-1">
                  <label className="text-[9px] text-brand-muted font-mono uppercase tracking-wider">AI Animation Prompt</label>
                  <input
                    type="text"
                    value={veoPrompt}
                    onChange={(e) => setVeoPrompt(e.target.value)}
                    placeholder="e.g. Slowly zoom in, sunset casting golden glows over the stone gate, photorealistic"
                    className="bg-white border border-brand-border rounded-xl px-3 py-2 text-[11px] focus:ring-1 focus:ring-brand-olive text-brand-text focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-brand-muted font-mono uppercase tracking-wider">Aspect Ratio</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setVeoRatio("16:9")}
                      className={`text-[10px] font-mono font-bold tracking-widest px-3 py-1.5 rounded-full uppercase ${
                        veoRatio === "16:9" ? "bg-brand-olive text-white shadow-md" : "bg-white text-brand-text border border-brand-border"
                      }`}
                    >
                      16:9
                    </button>
                    <button
                      type="button"
                      onClick={() => setVeoRatio("9:16")}
                      className={`text-[10px] font-mono font-bold tracking-widest px-3 py-1.5 rounded-full uppercase ${
                        veoRatio === "9:16" ? "bg-brand-olive text-white shadow-md" : "bg-white text-brand-text border border-brand-border"
                      }`}
                    >
                      9:16
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || (generateWithVeo && videoState === "polling")}
            className="w-full bg-brand-olive hover:bg-[#4a4a35] disabled:bg-[#4a4a35]/60 disabled:cursor-not-allowed text-brand-bg py-3.5 rounded-full text-xs font-serif font-black tracking-widest uppercase shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-stone-200" />
                Preserving...
              </>
            ) : generateWithVeo && !generatedVideoUrl ? (
              <>
                <Sparkles className="w-4 h-4 text-brand-amber animate-pulse" />
                Generate AI Video & Submit Memory
              </>
            ) : (
              "Submit to Living Archive"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
