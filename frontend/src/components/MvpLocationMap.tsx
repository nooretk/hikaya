import React from "react";
import { MapPin } from "lucide-react";
import { ApiLocation } from "../types";

interface MvpLocationMapProps {
  locations: ApiLocation[];
  selectedId?: string;
  onSelect: (location: ApiLocation) => void;
}

// Bounding box for the region, used to place markers on the panel.
const BOUNDS = { minLng: 34.1, maxLng: 35.7, minLat: 31.1, maxLat: 33.2 };

function toPercent(lat: number, lng: number) {
  return {
    x: ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100,
    // Inverted because CSS top grows downwards while latitude grows upwards.
    y: ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100,
  };
}

/**
 * Interactive map of the locations returned by the backend.
 *
 * Unlike the Sprint 1 explorer map, this one renders whatever
 * `GET /api/v1/locations` returns rather than a hard-coded list, which is what
 * makes it part of the integrated flow. It needs no map API key, so it works in
 * any environment.
 */
export const MvpLocationMap: React.FC<MvpLocationMapProps> = ({
  locations,
  selectedId,
  onSelect,
}) => {
  const plottable = locations.filter(
    (location) => location.latitude != null && location.longitude != null,
  );

  return (
    <div className="relative w-full h-[420px] sm:h-[520px] bg-white rounded-3xl border border-brand-border overflow-hidden shadow-xl">
      <div className="absolute inset-0 bold-radial-grid opacity-[0.15]" />

      <div className="absolute top-5 left-6 z-10">
        <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
          Hikaya MVP locations
        </p>
        <p className="font-serif font-black text-xl text-brand-olive">
          {plottable.length} site{plottable.length === 1 ? "" : "s"} on the map
        </p>
      </div>

      {plottable.map((location) => {
        const { x, y } = toPercent(location.latitude as number, location.longitude as number);
        const isSelected = location.id === selectedId;

        return (
          <button
            key={location.id}
            type="button"
            onClick={() => onSelect(location)}
            aria-pressed={isSelected}
            aria-label={`Select ${location.name}`}
            title={location.name}
            /*
             * Selected markers sit above the rest so their label is never
             * hidden behind a neighbour - Jerusalem and Bethlehem are only
             * about 10 km apart and land almost on top of each other here.
             */
            className={`absolute -translate-x-1/2 -translate-y-full flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber rounded-lg ${
              isSelected ? "z-20" : "z-10 hover:z-20"
            }`}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {/*
             * The label is only drawn for the selected marker, or on hover.
             * Showing all of them at once turns overlapping sites into an
             * unreadable pile of pills.
             */}
            <span
              className={`whitespace-nowrap mb-1 px-2.5 py-1 rounded-full text-[10px] font-serif font-bold tracking-wide border transition-opacity ${
                isSelected
                  ? "bg-brand-olive text-brand-bg border-brand-olive opacity-100"
                  : "bg-white text-brand-text border-brand-amber opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              }`}
            >
              {location.name}
            </span>
            <MapPin
              className={`w-6 h-6 transition-transform ${
                isSelected
                  ? "text-brand-amber scale-125"
                  : "text-brand-olive group-hover:scale-110"
              }`}
              fill={isSelected ? "currentColor" : "none"}
            />
          </button>
        );
      })}

      {plottable.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center text-xs text-brand-muted font-serif italic">
          No locations with coordinates were returned.
        </p>
      )}

      <p className="absolute bottom-4 left-6 right-6 text-[10px] text-brand-muted font-mono">
        Marker positions are derived from the latitude and longitude stored for each
        location. Select one to open its details.
      </p>
    </div>
  );
};
