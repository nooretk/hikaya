import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocations } from "../hooks/useLocations";
import { useVisitedLocations } from "../hooks/useVisitedLocations";
import { MvpLocationMap } from "../components/MvpLocationMap";
import { LocationCard } from "../components/LocationCard";
import { DataSourceBanner } from "../components/DataSourceBanner";
import { LoadingRegion, SkeletonCard, SkeletonLine } from "../components/Skeleton";
import { PageTransition } from "../components/motion";
import { ApiLocation } from "../types";

/**
 * Interactive map page.
 *
 * The markers come from `GET /api/v1/locations`; selecting one previews it and
 * opening it routes to the location details page.
 */
export const MapPage: React.FC = () => {
  const { locations, loading, source, reason } = useLocations();
  const visitedState = useVisitedLocations(locations.length);
  const [selected, setSelected] = useState<ApiLocation | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selected && locations.length > 0) {
      setSelected(locations[0]);
    }
  }, [locations, selected]);

  return (
    <PageTransition>
      <div className="space-y-8">
        <DataSourceBanner source={source} reason={reason} />

        <div>
          <h1 className="font-serif font-black text-3xl text-brand-olive">
            Interactive map
          </h1>
          <p className="text-xs text-brand-muted font-serif italic">
            Filter by what kind of place you are looking for, then open one for the full
            story.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <SkeletonLine className="lg:col-span-7 h-[520px] w-full rounded-3xl" />
            <div className="lg:col-span-5">
              <SkeletonCard />
            </div>
            <LoadingRegion label="Loading the map" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <MvpLocationMap
                locations={locations}
                selectedId={selected?.id}
                onSelect={setSelected}
                visited={visitedState.visited}
              />
            </div>

            <div className="lg:col-span-5 space-y-4">
              {selected ? (
                <>
                  <LocationCard
                    location={selected}
                    visited={visitedState.hasVisited(selected.id)}
                  />
                  <button
                    type="button"
                    onClick={() => navigate(`/locations/${selected.id}`)}
                    className="w-full bg-brand-olive hover:bg-[#4a4a35] text-brand-bg text-xs font-serif font-black tracking-widest uppercase px-6 py-3 rounded-full transition-colors"
                  >
                    Open {selected.name}
                  </button>
                </>
              ) : (
                <p className="text-xs text-brand-muted font-serif italic">
                  No location selected.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
