/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { locations } from "./locationsData";
import { LocationData } from "./types";
import { PalestineCanvasMap } from "./components/PalestineCanvasMap";
import { GoogleMapsOverlay } from "./components/GoogleMapsOverlay";
import { StoryNarrator } from "./components/StoryNarrator";
import { ContributionsList } from "./components/ContributionsList";
import { AboutPanel } from "./components/AboutPanel";
import { Landmark, MapPin, Sparkles, BookOpen, Heart, Download, Globe, MessageSquare, Compass, Info } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"map" | "archive" | "about">("map");
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(locations[0]); // Default to Jerusalem
  const [mapMode, setMapMode] = useState<"canvas" | "gmp">("canvas");
  const [sidebarTab, setSidebarTab] = useState<"ai" | "history">("ai");

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-amber/10 selection:text-brand-amber relative pb-12">
      {/* Top Traditional decorative horizontal bar */}
      <div className="h-2..5 w-full bg-gradient-to-r from-brand-olive via-brand-amber to-brand-olive" />

      {/* Main Container Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-brand-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-serif font-black text-4xl tracking-tight text-brand-olive flex items-center gap-2">
                HEKAYA <span className="text-brand-amber font-serif italic font-semibold text-2xl" dir="rtl">حكاية</span>
              </span>
              <span className="bg-brand-amber/10 text-brand-amber text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-brand-amber/20 uppercase tracking-wider">
                Sprint 1 MVP
              </span>
            </div>
            <p className="text-xs text-brand-muted max-w-xl font-serif italic leading-relaxed">
              AI-Powered Platform for Preserving Palestinian Memory and Heritage. Weaving geographic archives, oral histories, and generative video loops into a living, crowdsourced digital legacy.
            </p>
          </div>

          {/* Quick-Action zip downloader on Header */}
          <div className="flex items-center gap-2">
            <a
              href="/api/download-zip"
              download="hikaya-frontend-sprint1.zip"
              className="bg-brand-olive hover:bg-[#4a4a35] text-brand-bg text-xs font-serif font-black tracking-widest uppercase px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-all"
            >
              <Download className="w-3.5 h-3.5 text-brand-amber" />
              Export Project ZIP
            </a>
          </div>
        </div>

        {/* Primary Tab Selectors */}
        <div className="flex flex-wrap items-center gap-2 mt-8 border-b border-brand-border-light">
          <button
            onClick={() => setActiveTab("map")}
            className={`pb-3 text-xs font-serif font-bold uppercase tracking-widest border-b-2 px-3 transition-colors flex items-center gap-1.5 ${
              activeTab === "map"
                ? "border-brand-olive text-brand-olive"
                : "border-transparent text-brand-muted hover:text-brand-olive"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Palestine Map Explorer
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
            Living Memories Archive
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`pb-3 text-xs font-serif font-bold uppercase tracking-widest border-b-2 px-3 transition-colors flex items-center gap-1.5 ${
              activeTab === "about"
                ? "border-brand-olive text-brand-olive"
                : "border-transparent text-brand-muted hover:text-brand-olive"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            Beta Startup Idea
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "map" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left column (Map container) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-2xl text-brand-olive flex items-center gap-2">
                    <Globe className="w-5 h-5 text-brand-amber animate-pulse" />
                    Interactive Palestine Map
                  </h3>
                  <p className="text-xs text-brand-muted italic">
                    Explore Palestinian towns, archaeological landmarks, and holy sanctuaries.
                  </p>
                </div>

                {/* Map View Toggle: Custom Canvas vs Google Maps */}
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

              {/* Render Selected Map */}
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

            {/* Right column (Location Details Sidebar) */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-brand-border overflow-hidden shadow-2xl flex flex-col">
              {/* Cover photo */}
              <div className="relative w-full h-56 bg-brand-olive">
                <img
                  src={selectedLocation.coverImage}
                  alt={selectedLocation.name}
                  className="w-full h-full object-cover opacity-90 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-olive/95 via-brand-olive/20 to-transparent" />
                
                {/* Title Overlay */}
                <div className="absolute bottom-5 left-6 right-6 flex flex-col">
                  <span className="text-[10px] text-brand-amber font-mono tracking-widest uppercase font-black">
                    Palestinian Heritage Hub
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
                {/* Highlights and summary cards */}
                <p className="text-xs text-brand-text leading-relaxed bg-brand-bg p-4 rounded-2xl border border-brand-border-light italic">
                  &ldquo;{selectedLocation.summary}&rdquo;
                </p>

                {/* Sub-Tabs of Sidebar */}
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
                    Story Mode (Gemini AI)
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
                    Historical Facts
                  </button>
                </div>

                {/* Render active sidebar tab content */}
                {sidebarTab === "ai" ? (
                  <StoryNarrator location={selectedLocation} />
                ) : (
                  <div className="space-y-5 animate-fade-in">
                    {/* Landmarks bullet points */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-brand-amber font-mono tracking-widest uppercase flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5" /> Core Landmarks & Holy Sites:
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

                    {/* Historical summary */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-muted font-mono tracking-widest uppercase block">
                        Detailed Chronology
                      </span>
                      <p className="text-xs text-brand-text leading-relaxed whitespace-pre-line">
                        {selectedLocation.historicalSummary}
                      </p>
                    </div>

                    {/* Cultural importance */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-muted font-mono tracking-widest uppercase block">
                        Cultural & Architectural Significance
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

        {activeTab === "about" && <AboutPanel />}
      </main>

      {/* Decorative bottom graphic seal */}
      <footer className="mt-16 text-center text-[10px] text-brand-muted font-mono tracking-widest uppercase space-y-1">
        <p>© 2026 Hikaya Startup Initiative • Preserving Palestinian Identity</p>
        <div className="flex justify-center gap-1.5 text-brand-amber">
          <Heart className="w-3 h-3 fill-current animate-pulse" /> Team Beta
        </div>
      </footer>
    </div>
  );
}
