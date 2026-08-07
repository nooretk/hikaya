import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, MapPin, PenLine, Sparkles } from "lucide-react";
import { useLocations } from "../hooks/useLocations";
import { LocationCard } from "../components/LocationCard";
import { DataSourceBanner } from "../components/DataSourceBanner";

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
  const { locations, loading, source, reason } = useLocations();

  return (
    <div className="space-y-14">
      <DataSourceBanner source={source} reason={reason} />

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-amber">
            AI-powered heritage archive
          </p>
          <h1 className="font-serif font-black text-4xl sm:text-5xl leading-tight text-brand-olive">
            Places remember.
            <br />
            Hikaya writes it down.
          </h1>
          <p className="text-sm text-brand-text leading-relaxed max-w-xl">
            Hikaya gathers the history, culture and oral memory of Palestinian
            locations, and retells it in a way that suits whoever is reading — a
            student, a visitor, a child. The stories are built only from reviewed
            content, and when the records fall short, the platform says so instead of
            filling the gap.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/map"
              className="bg-brand-olive hover:bg-[#4a4a35] text-brand-bg text-xs font-serif font-black tracking-widest uppercase px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-amber" />
              Explore the map
            </Link>
            <Link
              to="/contribute"
              className="border border-brand-border hover:border-brand-amber text-brand-olive text-xs font-serif font-black tracking-widest uppercase px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors"
            >
              <PenLine className="w-3.5 h-3.5" />
              Share a memory
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STEPS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-brand-border p-4 space-y-1.5"
            >
              <Icon className="w-4 h-4 text-brand-amber" />
              <h3 className="font-serif font-bold text-sm text-brand-olive">{title}</h3>
              <p className="text-xs text-brand-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
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
            to="/map"
            className="text-xs font-serif font-bold uppercase tracking-widest text-brand-olive hover:text-brand-amber transition-colors"
          >
            See them on the map →
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-brand-muted font-serif italic">Loading locations…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
