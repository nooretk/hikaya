import React from "react";
import { locations } from "../locationsData";
import { LocationData } from "../types";
import { Compass, Landmark, Check } from "lucide-react";

interface PalestineCanvasMapProps {
  selectedLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
}

export const PalestineCanvasMap: React.FC<PalestineCanvasMapProps> = ({
  selectedLocation,
  onSelectLocation,
}) => {
  // GPS bounding box conversion formulas
  const mapCoords = (lat: number, lng: number) => {
    const minLng = 34.1;
    const maxLng = 35.7;
    const minLat = 31.1;
    const maxLat = 33.2;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Invert Y because SVG coordinates start from top-left (0,0)
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return { x, y };
  };

  return (
    <div id="canvas-map-container" className="relative w-full h-[550px] lg:h-[680px] bg-white rounded-3xl border border-brand-border p-6 overflow-hidden flex flex-col items-center justify-between shadow-2xl">
      {/* Background traditional Tatreez cross-stitch mesh */}
      <div className="absolute inset-0 tatreez-grid pointer-events-none" />

      {/* Decorative Compass and Palestinian Heritage Seal */}
      <div className="absolute top-6 left-6 z-10 flex flex-col items-start space-y-1">
        <div className="flex items-center gap-2 text-brand-olive">
          <Compass className="w-5 h-5 animate-spin-slow text-brand-amber" />
          <span className="font-serif font-black text-sm tracking-widest uppercase">Canvas Map Grid</span>
        </div>
        <p className="text-[10px] text-brand-muted font-mono tracking-wider">31.95° N, 35.23° E • Levant Area</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-brand-border text-[10px] space-y-1.5 shadow-lg">
        <span className="font-serif font-black text-xs text-brand-olive block">Map Legend</span>
        <div className="flex items-center gap-2 text-brand-text">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-amber border border-white block shadow-sm" />
          <span className="font-serif font-bold">Selected Spot</span>
        </div>
        <div className="flex items-center gap-2 text-brand-text">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-olive border border-white block shadow-sm" />
          <span className="font-serif font-bold">Historical Center</span>
        </div>
      </div>

      {/* Main Map Box */}
      <div className="relative w-full max-w-[340px] h-full flex-grow mt-6">
        {/* Artistic background map contours */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full text-brand-olive/10 select-none pointer-events-none"
        >
          {/* Stylized Mediterranean Coastline */}
          <path
            d="M 5,0 Q 18,20 20,40 Q 22,65 14,80 Q 8,95 2,100"
            fill="none"
            stroke="rgba(90, 90, 64, 0.2)"
            strokeWidth="2"
            strokeDasharray="1,1"
          />
          {/* Dead Sea */}
          <path
            d="M 78,74 C 76,76 74,79 73,83 C 72,86 75,89 77,87 C 80,85 80,80 78,74 Z"
            fill="rgba(90, 90, 64, 0.08)"
            stroke="rgba(90, 90, 64, 0.2)"
            strokeWidth="0.5"
          />
          {/* Jordan River */}
          <path
            d="M 75,10 Q 77,35 73,50 T 78,74"
            fill="none"
            stroke="rgba(90, 90, 64, 0.15)"
            strokeWidth="0.5"
          />
          {/* Lake Tiberias */}
          <circle cx="76" cy="22" r="2.5" fill="rgba(90, 90, 64, 0.08)" stroke="rgba(90, 90, 64, 0.2)" strokeWidth="0.5" />
        </svg>

        {/* Dynamic coordinate pins */}
        {locations.map((loc) => {
          const { x, y } = mapCoords(loc.lat, loc.lng);
          const isSelected = selectedLocation.id === loc.id;
          const isMVP = ["jerusalem", "bethlehem", "sebastia"].includes(loc.id);

          return (
            <div
              key={loc.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
              onClick={() => onSelectLocation(loc)}
            >
              {/* Ripple Ring for Selected Location */}
              {isSelected && (
                <div className="absolute inset-0 -m-3 rounded-full bg-brand-amber/20 animate-ripple pointer-events-none" />
              )}

              {/* Pin node */}
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-125 border shadow-sm ${
                  isSelected
                    ? "bg-brand-amber border-white text-white scale-110 shadow-lg"
                    : isMVP
                    ? "bg-brand-amber/80 border-white text-white"
                    : "bg-brand-olive border-white text-white"
                }`}
              >
                {isSelected ? (
                  <Check className="w-2.5 h-2.5" />
                ) : (
                  <Landmark className="w-2 h-2" />
                )}
              </div>

              {/* Tooltip Card */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-5 mb-2 hidden group-hover:block z-30 w-48 bg-brand-olive text-brand-bg rounded-2xl p-3 shadow-2xl border border-white/10 text-center animate-fade-in">
                <span className="font-serif font-black text-xs text-brand-amber block truncate">
                  {loc.name.toUpperCase()}
                </span>
                <span className="font-serif text-[10px] text-stone-300 block mt-0.5" dir="rtl">
                  {loc.arabicName}
                </span>
                <span className="text-[10px] text-stone-300 block mt-1 line-clamp-2 italic leading-relaxed">
                  {loc.summary}
                </span>
                {isMVP && (
                  <span className="inline-block mt-2 bg-brand-amber/20 text-brand-amber text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border border-brand-amber/30 uppercase tracking-widest">
                    Sprint MVP
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full text-center text-xs text-brand-muted italic font-serif border-t border-brand-border-light pt-4">
        * Select any pin above to unlock high-fidelity AI stories, historical facts, and voice guides.
      </div>
    </div>
  );
};
