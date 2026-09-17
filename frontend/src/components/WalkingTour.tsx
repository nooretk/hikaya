import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Footprints, LocateFixed, Loader2 } from "lucide-react";
import { ApiLocation } from "../types";

/** Great-circle distance in kilometres. */
function distanceKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

/** Within this many km of a site, an audio walking tour is worth offering. */
const NEARBY_KM = 15;

interface NearestResult {
  location: ApiLocation;
  km: number;
}

/**
 * Offers an audio walking tour when the visitor is actually near a site.
 *
 * Location is only ever read after an explicit tap - `navigator.geolocation`
 * prompts, and nothing is sent anywhere: the distance is computed in the
 * browser against coordinates the app already has. Hikaya never learns where
 * you are.
 *
 * If you are nowhere near, it says so plainly and points at the map instead of
 * inventing a reason to send you somewhere.
 */
export const WalkingTour: React.FC<{ locations: ApiLocation[] }> = ({ locations }) => {
  const [state, setState] = useState<"idle" | "locating" | "done" | "denied">("idle");
  const [nearest, setNearest] = useState<NearestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supported = typeof navigator !== "undefined" && "geolocation" in navigator;

  const findNearest = () => {
    if (!supported) return;
    setState("locating");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const candidates = locations
          .filter((item) => item.latitude != null && item.longitude != null)
          .map((item) => ({
            location: item,
            km: distanceKm(
              position.coords.latitude,
              position.coords.longitude,
              item.latitude as number,
              item.longitude as number,
            ),
          }))
          .sort((a, b) => a.km - b.km);

        setNearest(candidates[0] ?? null);
        setState("done");
      },
      (positionError) => {
        setState("denied");
        setError(
          positionError.code === positionError.PERMISSION_DENIED
            ? "Location access was declined. That is fine - the map works just as well."
            : "Your location could not be determined.",
        );
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  };

  if (!supported) return null;

  return (
    <section className="bg-white rounded-3xl border border-brand-border p-5 space-y-3">
      <h3 className="font-serif font-black text-lg text-brand-olive flex items-center gap-2">
        <Footprints className="w-4 h-4 text-brand-amber" />
        Are you nearby?
      </h3>
      <p className="text-xs text-brand-muted leading-relaxed">
        If you are close to one of these sites, Hikaya can set you up with an audio
        walking tour. Your position is checked in your browser and never sent to us.
      </p>

      {state !== "done" && (
        <button
          type="button"
          onClick={findNearest}
          disabled={state === "locating"}
          className="border border-brand-border hover:border-brand-amber disabled:opacity-60 text-brand-olive text-xs font-serif font-black tracking-widest uppercase px-5 py-2.5 rounded-full inline-flex items-center gap-2 transition-colors"
        >
          {state === "locating" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5" />
          )}
          {state === "locating" ? "Checking…" : "Check my location"}
        </button>
      )}

      {error && <p className="text-xs text-brand-muted">{error}</p>}

      {state === "done" && nearest && (
        <div className="bg-brand-bg border border-brand-border-light rounded-2xl p-4 space-y-2">
          {nearest.km <= NEARBY_KM ? (
            <>
              <p className="text-sm text-brand-text">
                You are about{" "}
                <strong>{nearest.km < 1 ? "less than a kilometre" : `${Math.round(nearest.km)} km`}</strong>{" "}
                from <strong>{nearest.location.name}</strong>.
              </p>
              <Link
                to={`/locations/${nearest.location.id}?tour=1`}
                className="bg-brand-amber hover:bg-[#b45f05] text-white text-xs font-serif font-black tracking-widest uppercase px-5 py-2.5 rounded-full inline-flex items-center gap-2 transition-colors"
              >
                <Footprints className="w-3.5 h-3.5" />
                Start the audio tour
              </Link>
            </>
          ) : (
            <p className="text-sm text-brand-text">
              The nearest site in the archive is <strong>{nearest.location.name}</strong>,
              about {Math.round(nearest.km)} km away — too far for a walking tour today.
              You can still read it from wherever you are.
            </p>
          )}
        </div>
      )}
    </section>
  );
};
