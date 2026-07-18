import React from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { locations } from "../locationsData";
import { LocationData } from "../types";

interface GoogleMapsOverlayProps {
  selectedLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
}

export const GoogleMapsOverlay: React.FC<GoogleMapsOverlayProps> = ({
  selectedLocation,
  onSelectLocation,
}) => {
  // Grab injected key from process.env via define block
  const API_KEY =
    process.env.GOOGLE_MAPS_PLATFORM_KEY ||
    (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
    (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
    "";

  const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center h-[550px] lg:h-[680px] bg-white border border-brand-border p-6 text-center rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 tatreez-grid pointer-events-none opacity-5" />
        <div className="relative z-10 max-w-sm space-y-5">
          <h4 className="font-serif font-black text-lg text-brand-olive uppercase tracking-wider">
            Google Maps API Key Required
          </h4>
          <p className="text-xs text-brand-text leading-relaxed italic font-serif">
            Satellite overlays require a Google Maps Platform key to be set.
          </p>

          <div className="text-left bg-brand-bg border border-brand-border rounded-2xl p-5 space-y-2.5 text-[11px] text-brand-text shadow-sm font-sans">
            <p className="font-serif font-bold text-brand-olive">To activate real-time mapping:</p>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Open <strong>Settings</strong> (⚙️ gear icon, top-right)</li>
              <li>Select <strong>Secrets</strong></li>
              <li>Add key name: <code>GOOGLE_MAPS_PLATFORM_KEY</code></li>
              <li>Paste your Google Maps Platform credential and press <strong>Enter</strong></li>
            </ol>
          </div>

          <p className="text-[11px] text-brand-muted italic font-serif">
            * Note: Don't worry! You can use the high-fidelity <strong>Canvas Map Mode</strong> right now using the toggle on the left of the screen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[550px] lg:h-[680px] rounded-3xl overflow-hidden border border-brand-border shadow-2xl relative">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={{ lat: 31.95, lng: 35.23 }}
          defaultZoom={9}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          style={{ width: "100%", height: "100%" }}
        >
          {locations.map((loc) => {
            const isSelected = selectedLocation.id === loc.id;
            return (
              <AdvancedMarker
                key={loc.id}
                position={{ lat: loc.lat, lng: loc.lng }}
                onClick={() => onSelectLocation(loc)}
              >
                <Pin
                  background={isSelected ? "#D97706" : "#5A5A40"}
                  glyphColor="#fff"
                  borderColor="#fff"
                  scale={isSelected ? 1.25 : 1.0}
                />
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>
    </div>
  );
};
