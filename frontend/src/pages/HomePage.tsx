import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { BookOpen, MapPin, PenLine, Sparkles, Waypoints } from "lucide-react";
import { useLocations } from "../hooks/useLocations";
import { useVisitedLocations } from "../hooks/useVisitedLocations";
import { LocationCard } from "../components/LocationCard";
import { FeaturedStoryCard } from "../components/FeaturedStoryCard";
import { ProgressTracker } from "../components/ProgressTracker";
import { WalkingTour } from "../components/WalkingTour";
import { DataSourceBanner } from "../components/DataSourceBanner";
import { LoadingRegion, SkeletonCardGrid, SkeletonLine } from "../components/Skeleton";
import { PageTransition, Reveal, StaggerItem, StaggerList } from "../components/motion";
import { getFeaturedStory, getRandomStory } from "../services/api";
import { FeaturedStory } from "../types";

const STEPS = [
  {
    icon: MapPin,
    title: "Open the map",
    body: "Pick one of the Palestinian heritage sites documented in the archive.",
  },
  {
    icon: BookOpen,
    title: "Read the reviewed story",
    body: "Every fact comes from a content file checked by the documentation team.",
  },
  {
    icon: Sparkles,
    title: "Ask for a story",
    body: "The AI retells it for a student, a visitor or a child — inventing nothing.",
  },
  {
    icon: PenLine,
    title: "Add your memory",
    body: "Contribute what you remember. An editor reviews it before it is published.",
  },
];

export const HomePage: React.FC = () => {
  const reduced = useReducedMotion();
  const { locations, loading, source, reason } = useLocations();
  const visitedState = useVisitedLocations(locations.length);

  const [featured, setFeatured] = useState<FeaturedStory | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    let active = true;
    getFeaturedStory()
      .then((result) => {
        if (active) setFeatured(result.data);
      })
      .finally(() => {
        if (active) setFeaturedLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const shuffle = async () => {
    setShuffling(true);
    try {
      const result = await getRandomStory(featured?.story.id);
      setFeatured(result.data);
    } finally {
      setShuffling(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-14">
        <DataSourceBanner source={source} reason={reason} />

        {/* --- Hero -------------------------------------------------------- */}
        <section className="relative overflow-hidden rounded-3xl border border-brand-border bg-white">
          {/* Tatreez-inspired texture, kept faint so it never fights the text. */}
          <div className="absolute inset-0 tatreez-grid" aria-hidden="true" />
          <div
            className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-brand-amber/5 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
            <div className="lg:col-span-7 space-y-5">
              <motion.p
                className="text-[10px] font-mono uppercase tracking-widest text-brand-amber"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : 0.1 }}
              >
                AI-powered heritage archive
              </motion.p>

              <motion.h1
                className="font-serif font-black text-4xl sm:text-5xl leading-tight text-brand-olive"
                initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduced ? 0 : 0.15, duration: 0.5 }}
              >
                Places remember.
                <br />
                Hikaya writes it down.
              </motion.h1>

              <motion.p
                className="text-sm text-brand-text leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduced ? 0 : 0.25, duration: 0.5 }}
              >
                Hikaya gathers the history, culture and oral memory of Palestinian
                locations, and retells it in a way that suits whoever is reading — a
                student, a visitor, a child. The stories are built only from reviewed
                content, and when the records fall short, the platform says so instead
                of filling the gap.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : 0.35 }}
              >
                <Link
                  to="/map"
                  className="bg-brand-olive hover:bg-[#4a4a35] text-brand-bg text-xs font-serif font-black tracking-widest uppercase px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-amber" />
                  Explore the map
                </Link>
                <Link
                  to={`/locations/${locations[0]?.id ?? "jerusalem"}?ask=1`}
                  className="bg-brand-amber hover:bg-[#b45f05] text-white text-xs font-serif font-black tracking-widest uppercase px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask Hikaya
                </Link>
                <Link
                  to="/contribute"
                  className="border border-brand-border hover:border-brand-amber text-brand-olive text-xs font-serif font-black tracking-widest uppercase px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  Share a memory
                </Link>
              </motion.div>
            </div>

            <StaggerList className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STEPS.map(({ icon: Icon, title, body }) => (
                <StaggerItem
                  key={title}
                  className="bg-brand-bg/80 backdrop-blur rounded-2xl border border-brand-border-light p-4 space-y-1.5"
                >
                  <Icon className="w-4 h-4 text-brand-amber" />
                  <h3 className="font-serif font-bold text-sm text-brand-olive">
                    {title}
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed">{body}</p>
                </StaggerItem>
              ))}
            </StaggerList>
          </div>
        </section>

        {/* --- Story of the day -------------------------------------------- */}
        <Reveal className="space-y-4">
          <h2 className="font-serif font-black text-2xl text-brand-olive">
            Start here
          </h2>
          {featuredLoading ? (
            <div className="bg-white rounded-3xl border border-brand-border overflow-hidden grid grid-cols-1 md:grid-cols-5">
              <SkeletonLine className="h-48 md:col-span-2 rounded-none" />
              <div className="md:col-span-3 p-6 space-y-3">
                <SkeletonLine className="h-3 w-28" />
                <SkeletonLine className="h-6 w-3/4" />
                <SkeletonLine className="h-3 w-full" />
                <SkeletonLine className="h-3 w-5/6" />
              </div>
              <LoadingRegion label="Loading the story of the day" />
            </div>
          ) : (
            featured && (
              <FeaturedStoryCard
                featured={featured}
                onShuffle={() => void shuffle()}
                shuffling={shuffling}
              />
            )
          )}
        </Reveal>

        {/* --- Locations --------------------------------------------------- */}
        <Reveal className="space-y-5">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-serif font-black text-2xl text-brand-olive">
                Locations in the archive
              </h2>
              <p className="text-xs text-brand-muted font-serif italic">
                The first three sites documented for the MVP.
              </p>
            </div>
            <Link
              to="/constellation"
              className="text-xs font-serif font-bold uppercase tracking-widest text-brand-olive hover:text-brand-amber transition-colors inline-flex items-center gap-1.5"
            >
              <Waypoints className="w-3.5 h-3.5" />
              See how they connect
            </Link>
          </div>

          {loading ? (
            <>
              <SkeletonCardGrid />
              <LoadingRegion label="Loading locations" />
            </>
          ) : (
            <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {locations.map((location) => (
                <StaggerItem key={location.id}>
                  <LocationCard
                    location={location}
                    visited={visitedState.hasVisited(location.id)}
                  />
                </StaggerItem>
              ))}
            </StaggerList>
          )}
        </Reveal>

        {/* --- Personal --------------------------------------------------- */}
        {!loading && (
          <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ProgressTracker state={visitedState} />
            <WalkingTour locations={locations} />
          </Reveal>
        )}
      </div>
    </PageTransition>
  );
};
