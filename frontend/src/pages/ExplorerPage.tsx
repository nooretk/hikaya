/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { locations } from "../locationsData";
import { LocationData } from "../types";
import { PalestineCanvasMap } from "../components/PalestineCanvasMap";
import { GoogleMapsOverlay } from "../components/GoogleMapsOverlay";
import { StoryNarrator } from "../components/StoryNarrator";
import { ContributionsList } from "../components/ContributionsList";
import { Landmark, MapPin, Sparkles, BookOpen, Globe, MessageSquare, Compass } from "lucide-react";

/**
 * The Sprint 1 explorer experience, kept as its own page.
 *
 * It covers the wider set of Palestinian locations from the bundled
 * `locationsData.ts` and uses the Gemini-backed narrator and video features
 * served by `frontend/server.ts`. The Sprint 2 MVP flow (Home → Map →
 * Location → Contribute) runs off the Hikaya backend instead; see
 * `src/services/api.ts`.
 */
export default function ExplorerPage() {
  const [activeTab, setActiveTab] = useState<"map" | "archive">("map");
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(locations[0]);
  const [mapMode, setMapMode] = useState<"canvas" | "gmp">("canvas");
  const [sidebarTab, setSidebarTab] = useState<"ai" | "history">("ai");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif font-black text-3xl text-brand-olive">
          Palestine explorer
        </h1>
        <p className="text-xs text-brand-muted font-serif italic">
          The wider archive from Sprint 1, with the Gemini narrator and the living
          memories board. Runs against the bundled location data, not the Hikaya API.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-brand-border-light">
        <button
          onClick={() => setActiveTab("map")}
          className={`pb-3 text-xs font-serif font-bold uppercase tracking-widest border-b-2 px-3 transition-colors flex items-center gap-1.5 ${
            activeTab === "map"
              ? "border-brand-olive text-brand-olive"
              : "border-transparent text-brand-muted hover:text-brand-olive"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Palestine map explorer
        </button>

        <button
          onClick={() => setActiveTab("archive")}
          className={`pb-3 text-xs font-serif font-bold uppercase tracking-widest border-b-2 px-3 transition-colors flex items-center gap-1.5 ${
            activeTab === "archive"
              ? "border-brand-olive text-brand-olive"
              : "border-transparent text-brand-muted hover:text-brand-olive"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Living memories archive
        </button>
      </div>

      {activeTab === "map" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column (map) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-black text-2xl text-brand-olive flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-amber" />
                  Interactive Palestine map
                </h3>
                <p className="text-xs text-brand-muted italic">
                  Explore Palestinian towns, archaeological landmarks, and holy sanctuaries.
                </p>
              </div>

              <div className="flex bg-white/60 p-1 rounded-full border border-brand-border">
                <button
                  onClick={() => setMapMode("canvas")}
                  className={`text-[10px] font-serif font-bold tracking-wider px-3.5 py-1.5 rounded-full transition-colors ${
                    mapMode === "canvas" ? "bg-brand-olive text-brand-bg" : "text-brand-muted hover:text-brand-olive"
                  }`}
                >
                  Canvas
                </button>
                <button
                  onClick={() => setMapMode("gmp")}
                  className={`text-[10px] font-serif font-bold tracking-wider px-3.5 py-1.5 rounded-full transition-colors ${
                    mapMode === "gmp" ? "bg-brand-olive text-brand-bg" : "text-brand-muted hover:text-brand-olive"
                  }`}
                >
                  Satellite
                </button>
              </div>
            </div>

            {mapMode === "canvas" ? (
              <PalestineCanvasMap
                selectedLocation={selectedLocation}
                onSelectLocation={(loc) => setSelectedLocation(loc)}
              />
            ) : (
              <GoogleMapsOverlay
                selectedLocation={selectedLocation}
                onSelectLocation={(loc) => setSelectedLocation(loc)}
              />
            )}
          </div>

          {/* Right column (details sidebar) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-brand-border overflow-hidden shadow-2xl flex flex-col">
            <div className="relative w-full h-56 bg-brand-olive">
              <img
                src={selectedLocation.coverImage}
                alt={selectedLocation.name}
                className="w-full h-full object-cover opacity-90 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-olive/95 via-brand-olive/20 to-transparent" />

              <div className="absolute bottom-5 left-6 right-6 flex flex-col">
                <span className="text-[10px] text-brand-amber font-mono tracking-widest uppercase font-black">
                  Palestinian heritage hub
                </span>
                <h3 className="font-serif font-black text-3xl text-stone-100 leading-tight">
                  {selectedLocation.name.toUpperCase()}
                </h3>
                <span className="font-serif text-sm text-stone-300 font-medium mt-1" dir="rtl">
                  {selectedLocation.arabicName}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-xs text-brand-text leading-relaxed bg-brand-bg p-4 rounded-2xl border border-brand-border-light italic">
                &ldquo;{selectedLocation.summary}&rdquo;
              </p>

              <div className="flex border-b border-brand-border-light">
                <button
                  onClick={() => setSidebarTab("ai")}
                  className={`pb-2.5 text-xs font-serif font-bold uppercase tracking-widest border-b-2 px-3 transition-colors flex items-center gap-1.5 ${
                    sidebarTab === "ai"
                      ? "border-brand-amber text-brand-amber"
                      : "border-transparent text-brand-muted hover:text-brand-olive"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Story mode (Gemini AI)
                </button>

                <button
                  onClick={() => setSidebarTab("history")}
                  className={`pb-2.5 text-xs font-serif font-bold uppercase tracking-widest border-b-2 px-3 transition-colors flex items-center gap-1.5 ${
                    sidebarTab === "history"
                      ? "border-brand-amber text-brand-amber"
                      : "border-transparent text-brand-muted hover:text-brand-olive"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Historical facts
                </button>
              </div>

              {sidebarTab === "ai" ? (
                <StoryNarrator location={selectedLocation} />
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <span className="text-[10px] text-brand-amber font-mono tracking-widest uppercase flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5" /> Core landmarks &amp; holy sites:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {selectedLocation.landmarks.map((l, idx) => (
                        <div
                          key={idx}
                          className="bg-brand-bg border border-brand-border-light p-3 rounded-xl text-xs font-serif font-bold text-brand-text flex items-center gap-2"
                        >
                          <MapPin className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                          <span className="truncate">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-muted font-mono tracking-widest uppercase block">
                      Detailed chronology
                    </span>
                    <p className="text-xs text-brand-text leading-relaxed whitespace-pre-line">
                      {selectedLocation.historicalSummary}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-muted font-mono tracking-widest uppercase block">
                      Cultural &amp; architectural significance
                    </span>
                    <p className="text-xs text-brand-text leading-relaxed whitespace-pre-line">
                      {selectedLocation.culturalImportance}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "archive" && <ContributionsList location={selectedLocation} />}
    </div>
  );
}
