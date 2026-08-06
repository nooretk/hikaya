import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, MapPin, MessageSquare, PenLine } from "lucide-react";
import { ApiContribution, ApiLocation, ApiStory, DataSource } from "../types";
import { getContributions, getLocation, getStories } from "../services/api";
import { StorySection } from "../components/StorySection";
import { DataSourceBanner } from "../components/DataSourceBanner";
import { CoverImage } from "../components/CoverImage";

/**
 * Location details page.
 *
 * Loads the location, its reviewed stories and its approved contributions, and
 * hosts the story narrative section where a visitor can request an AI retelling.
 */
export const LocationDetailsPage: React.FC = () => {
  const { locationId = "" } = useParams();

  const [location, setLocation] = useState<ApiLocation | null>(null);
  const [stories, setStories] = useState<ApiStory[]>([]);
  const [contributions, setContributions] = useState<ApiContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<DataSource>("backend");
  const [reason, setReason] = useState<string | undefined>();

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      getLocation(locationId),
      getStories(locationId),
      getContributions(locationId),
    ])
      .then(([locationResult, storiesResult, contributionsResult]) => {
        if (!active) return;
        setLocation(locationResult.data);
        setStories(storiesResult.data);
        setContributions(contributionsResult.data);
        // One mock response is enough to make the page sample data.
        const results = [locationResult, storiesResult, contributionsResult];
        const fallback = results.find((result) => result.source === "mock");
        setSource(fallback ? "mock" : "backend");
        setReason(fallback?.reason);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [locationId]);

  if (loading) {
    return (
      <p className="text-xs text-brand-muted font-serif italic">Loading location…</p>
    );
  }

  if (!location) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif font-black text-3xl text-brand-olive">
          Location not found
        </h1>
        <p className="text-sm text-brand-text">
          There is no location with the id <code className="font-mono">{locationId}</code>{" "}
          in the archive.
        </p>
        <Link
          to="/map"
          className="text-xs font-serif font-bold uppercase tracking-widest text-brand-olive hover:text-brand-amber inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to the map
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <DataSourceBanner source={source} reason={reason} />

      <Link
        to="/map"
        className="text-xs font-serif font-bold uppercase tracking-widest text-brand-muted hover:text-brand-olive inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All locations
      </Link>

      {/* --- Header ------------------------------------------------------ */}
      <header className="relative rounded-3xl overflow-hidden border border-brand-border bg-brand-olive h-64">
        <CoverImage
          src={location.coverImageUrl}
          alt={location.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-olive/95 via-brand-olive/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-[10px] text-brand-amber font-mono tracking-widest uppercase font-black">
            Palestinian heritage
          </span>
          <h1 className="font-serif font-black text-4xl text-stone-100 leading-tight">
            {location.name}
          </h1>
          {location.arabicName && (
            <span className="font-serif text-base text-stone-300" dir="rtl">
              {location.arabicName}
            </span>
          )}
        </div>
      </header>

      {/* --- Facts ------------------------------------------------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <p className="text-sm text-brand-text leading-relaxed">
            {location.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {location.categories.map((category) => (
              <span
                key={category}
                className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white border border-brand-border-light text-brand-muted"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 bg-white rounded-3xl border border-brand-border p-5 space-y-3 text-xs">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
            Record
          </p>
          <p className="flex items-center gap-2 text-brand-text">
            <MapPin className="w-3.5 h-3.5 text-brand-amber shrink-0" />
            {location.city}, {location.country}
          </p>
          {location.latitude != null && location.longitude != null && (
            <p className="font-mono text-brand-muted">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </p>
          )}
          {location.contentFile && (
            <p className="flex items-start gap-2 text-brand-muted font-mono text-[10px] pt-2 border-t border-brand-border-light">
              <FileText className="w-3 h-3 shrink-0 mt-0.5" />
              {location.contentFile}
            </p>
          )}
          {location.aiSummaryFile && (
            <p className="text-brand-muted font-mono text-[10px] pl-5">
              {location.aiSummaryFile}
            </p>
          )}
        </aside>
      </section>

      {/* --- Stories ----------------------------------------------------- */}
      <StorySection location={location} stories={stories} loading={false} />

      {/* --- Memories ---------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-serif font-black text-2xl text-brand-olive flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-amber" />
              Memories from people
            </h2>
            <p className="text-xs text-brand-muted font-serif italic">
              Contributed by visitors and residents, published after review.
            </p>
          </div>
          <Link
            to={`/contribute?location=${location.id}`}
            className="text-xs font-serif font-bold uppercase tracking-widest text-brand-olive hover:text-brand-amber inline-flex items-center gap-1.5"
          >
            <PenLine className="w-3.5 h-3.5" />
            Add yours
          </Link>
        </div>

        {contributions.length === 0 ? (
          <p className="text-xs text-brand-muted font-serif italic">
            No memories have been published for this location yet. Yours could be the
            first.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {contributions.map((contribution) => (
              <article
                key={contribution.id}
                className="bg-white rounded-3xl border border-brand-border p-5 space-y-2"
              >
                <h3 className="font-serif font-bold text-base text-brand-olive">
                  {contribution.title}
                </h3>
                <p className="text-xs text-brand-text leading-relaxed">
                  {contribution.content}
                </p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted pt-2 border-t border-brand-border-light">
                  {contribution.contributorName ?? "Anonymous"} ·{" "}
                  {new Date(contribution.submittedAt).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
