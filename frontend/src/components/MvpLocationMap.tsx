import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Filter, MapPin } from "lucide-react";
import { ApiLocation } from "../types";

interface MvpLocationMapProps {
  locations: ApiLocation[];
  selectedId?: string;
  onSelect: (location: ApiLocation) => void;
  /** Ids this browser has already opened, marked on the map. */
  visited?: string[];
}

// Bounding box for the region, used to place markers on the panel.
const BOUNDS = { minLng: 34.1, maxLng: 35.7, minLat: 31.1, maxLat: 33.2 };

/**
 * Colour per category, so the legend and the markers agree.
 *
 * A location usually belongs to several categories; the first one that appears
 * here decides its colour, which keeps the map readable rather than exact.
 */
const CATEGORY_STYLE: Record<string, { dot: string; text: string; label: string }> = {
  "Religious Landmark": {
    dot: "text-brand-amber",
    text: "bg-brand-amber",
    label: "Religious",
  },
  "Archaeological Site": {
    dot: "text-[#8a6d3b]",
    text: "bg-[#8a6d3b]",
    label: "Archaeological",
  },
  "Historical Landmark": {
    dot: "text-brand-olive",
    text: "bg-brand-olive",
    label: "Historical",
  },
  "Cultural Heritage": {
    dot: "text-[#6b7f5a]",
    text: "bg-[#6b7f5a]",
    label: "Cultural",
  },
};

const CATEGORY_ORDER = Object.keys(CATEGORY_STYLE);

function toPercent(lat: number, lng: number) {
  return {
    x: ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100,
    // Inverted because CSS top grows downwards while latitude grows upwards.
    y: ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100,
  };
}

function styleFor(location: ApiLocation) {
  const primary = CATEGORY_ORDER.find((category) =>
    location.categories.includes(category),
  );
  return CATEGORY_STYLE[primary ?? "Historical Landmark"];
}

/**
 * Interactive map of the locations returned by the backend.
 *
 * Markers, filters and legend are all driven by the API response rather than a
 * hard-coded list, so adding a location to the archive puts it on the map with
 * no frontend change. It needs no map API key, which means it works in any
 * environment - including the ones where a tile provider would be blocked.
 */
export const MvpLocationMap: React.FC<MvpLocationMapProps> = ({
  locations,
  selectedId,
  onSelect,
  visited = [],
}) => {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string[]>([]);

  const available = useMemo(() => {
    const present = new Set<string>();
    locations.forEach((location) =>
      location.categories.forEach((category) => present.add(category)),
    );
    return CATEGORY_ORDER.filter((category) => present.has(category));
  }, [locations]);

  const plottable = locations.filter(
    (location) => location.latitude != null && location.longitude != null,
  );
  const shown = active.length
    ? plottable.filter((location) =>
        location.categories.some((category) => active.includes(category)),
      )
    : plottable;

  const toggle = (category: string) =>
    setActive((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );

  return (
    <div className="space-y-3">
      {/* --- Filters ---------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-muted inline-flex items-center gap-1.5">
          <Filter className="w-3 h-3" />
          Filter
        </span>
        {available.map((category) => {
          const style = CATEGORY_STYLE[category];
          const on = active.includes(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => toggle(category)}
              aria-pressed={on}
              className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border inline-flex items-center gap-1.5 transition-colors ${
                on
                  ? "bg-brand-olive text-brand-bg border-brand-olive"
                  : "bg-white text-brand-muted border-brand-border hover:border-brand-amber"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${style.text}`} />
              {style.label}
            </button>
          );
        })}
        {active.length > 0 && (
          <button
            type="button"
            onClick={() => setActive([])}
            className="text-[10px] font-mono uppercase tracking-wider text-brand-muted hover:text-brand-olive underline underline-offset-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* --- Map -------------------------------------------------------- */}
      <div className="relative w-full h-[420px] sm:h-[520px] bg-white rounded-3xl border border-brand-border overflow-hidden shadow-xl">
        <div className="absolute inset-0 bold-radial-grid opacity-[0.15]" />

        <div className="absolute top-5 left-6 z-10">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
            Hikaya archive
          </p>
          <p className="font-serif font-black text-xl text-brand-olive">
            {shown.length} site{shown.length === 1 ? "" : "s"}
            {active.length > 0 && (
              <span className="text-sm font-normal text-brand-muted"> of {plottable.length}</span>
            )}
          </p>
        </div>

        {shown.map((location, index) => {
          const { x, y } = toPercent(
            location.latitude as number,
            location.longitude as number,
          );
          const isSelected = location.id === selectedId;
          const style = styleFor(location);
          const seen = visited.includes(location.id);

          return (
            <motion.button
              key={location.id}
              type="button"
              onClick={() => onSelect(location)}
              aria-pressed={isSelected}
              aria-label={`Select ${location.name}`}
              title={location.name}
              initial={{ opacity: 0, y: reduced ? 0 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : index * 0.08, duration: 0.35 }}
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
                {seen && " ✓"}
              </span>

              <span className="relative flex items-center justify-center">
                {isSelected && !reduced && (
                  <motion.span
                    className="absolute w-8 h-8 rounded-full bg-brand-amber/25"
                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <MapPin
                  className={`w-6 h-6 relative transition-transform ${style.dot} ${
                    isSelected ? "scale-125" : "group-hover:scale-110"
                  }`}
                  fill={isSelected ? "currentColor" : "none"}
                />
                {seen && (
                  <Check className="absolute -right-2 -top-1 w-3 h-3 text-brand-olive bg-white rounded-full" />
                )}
              </span>
            </motion.button>
          );
        })}

        {shown.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-xs text-brand-muted font-serif italic px-8 text-center">
            No sites match the filters you have chosen.
          </p>
        )}

        {/* --- Legend -------------------------------------------------- */}
        <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center gap-x-4 gap-y-1">
          {available.map((category) => {
            const style = CATEGORY_STYLE[category];
            return (
              <span
                key={category}
                className="text-[10px] font-mono text-brand-muted inline-flex items-center gap-1.5"
              >
                <span className={`w-2 h-2 rounded-full ${style.text}`} />
                {style.label}
              </span>
            );
          })}
          {visited.length > 0 && (
            <span className="text-[10px] font-mono text-brand-muted inline-flex items-center gap-1">
              <Check className="w-3 h-3 text-brand-olive" />
              Visited
            </span>
          )}
        </div>
      </div>

      <p className="text-[10px] text-brand-muted font-mono">
        Markers are placed from the latitude and longitude stored for each location.
        Colour follows the site's main category.
      </p>
    </div>
  );
};
