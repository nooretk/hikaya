import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Milestone,
  PenLine,
  Sparkles,
} from "lucide-react";
import {
  ApiContribution,
  ApiLocation,
  ApiMedia,
  ApiQuizQuestion,
  ApiStory,
  ApiTimelineEvent,
  BeforeAfterResponse,
  DataSource,
} from "../types";
import {
  getBeforeAfter,
  getContributions,
  getLocation,
  getMedia,
  getQuiz,
  getRelated,
  getStories,
  getTimeline,
} from "../services/api";
import { useVisitedLocations } from "../hooks/useVisitedLocations";
import { DataSourceBanner } from "../components/DataSourceBanner";
import { CoverImage } from "../components/CoverImage";
import { Tabs, TabPanel, TabDefinition } from "../components/Tabs";
import { HistoricalTimeline } from "../components/HistoricalTimeline";
import { Gallery } from "../components/Gallery";
import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import { StoryWizard } from "../components/StoryWizard";
import { HeritageChat } from "../components/HeritageChat";
import { HeritageQuiz } from "../components/HeritageQuiz";
import { NarrativeReader } from "../components/NarrativeReader";
import { LocationCard } from "../components/LocationCard";
import { LoadingRegion, SkeletonLine, SkeletonText } from "../components/Skeleton";
import { PageTransition, Reveal } from "../components/motion";

interface PageData {
  location: ApiLocation | null;
  stories: ApiStory[];
  contributions: ApiContribution[];
  media: ApiMedia[];
  timeline: ApiTimelineEvent[];
  quiz: ApiQuizQuestion[];
  related: ApiLocation[];
  beforeAfter: BeforeAfterResponse;
}

const EMPTY: PageData = {
  location: null,
  stories: [],
  contributions: [],
  media: [],
  timeline: [],
  quiz: [],
  related: [],
  beforeAfter: { pair: null },
};

/**
 * Location details page.
 *
 * Everything about one place, split into tabs so the page stops being an
 * endless scroll: the story, the documented facts, the timeline, the
 * photographs, and what people remember.
 *
 * `?ask=1` opens on the guide (the "Ask Hikaya" call to action), and `?tour=1`
 * opens on the story and starts reading it aloud (the walking tour).
 */
export const LocationDetailsPage: React.FC = () => {
  const { locationId = "" } = useParams();
  const [searchParams] = useSearchParams();

  const [data, setData] = useState<PageData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<DataSource>("backend");
  const [reason, setReason] = useState<string | undefined>();
  const [tab, setTab] = useState(searchParams.get("ask") ? "guide" : "story");

  const { markVisited, hasVisited } = useVisitedLocations(0);
  const walkingTour = searchParams.get("tour") === "1";

  useEffect(() => {
    let active = true;
    setLoading(true);
    setData(EMPTY);

    Promise.all([
      getLocation(locationId),
      getStories(locationId),
      getContributions(locationId),
      getMedia(locationId),
      getTimeline(locationId),
      getQuiz(locationId),
      getRelated(locationId),
      getBeforeAfter(locationId),
    ])
      .then((results) => {
        if (!active) return;
        const [
          location,
          stories,
          contributions,
          media,
          timeline,
          quiz,
          related,
          beforeAfter,
        ] = results;

        setData({
          location: location.data,
          stories: stories.data,
          contributions: contributions.data,
          media: media.data,
          timeline: timeline.data,
          quiz: quiz.data,
          related: related.data,
          beforeAfter: beforeAfter.data,
        });

        // One mock response is enough to make the whole page sample data.
        const fallback = results.find((result) => result.source === "mock");
        setSource(fallback ? "mock" : "backend");
        setReason(fallback?.reason);

        if (location.data) markVisited(location.data.id);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // markVisited is stable; including it would re-run the fetch on every visit write.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <SkeletonLine className="h-64 w-full rounded-3xl" />
          <SkeletonText lines={3} />
          <SkeletonLine className="h-8 w-full" />
          <SkeletonText lines={6} />
          <LoadingRegion label="Loading location" />
        </div>
      </PageTransition>
    );
  }

  const { location } = data;

  if (!location) {
    return (
      <PageTransition>
        <div className="space-y-4">
          <h1 className="font-serif font-black text-3xl text-brand-olive">
            Location not found
          </h1>
          <p className="text-sm text-brand-text">
            There is no location with the id{" "}
            <code className="font-mono">{locationId}</code> in the archive.
          </p>
          <Link
            to="/map"
            className="text-xs font-serif font-bold uppercase tracking-widest text-brand-olive hover:text-brand-amber inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to the map
          </Link>
        </div>
      </PageTransition>
    );
  }

  const tabs: TabDefinition[] = [
    { id: "story", label: "Story", icon: BookOpen, badge: data.stories.length },
    { id: "guide", label: "Ask", icon: Sparkles },
    { id: "timeline", label: "Timeline", icon: Milestone, badge: data.timeline.length },
    { id: "gallery", label: "Gallery", icon: ImageIcon, badge: data.media.length },
    { id: "quiz", label: "Quiz", icon: HelpCircle, badge: data.quiz.length },
    {
      id: "memories",
      label: "Memories",
      icon: MessageSquare,
      badge: data.contributions.length,
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
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
              {hasVisited(location.id) && " · visited"}
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
            {data.stories.length > 0 && (
              <p className="flex items-center gap-2 text-brand-muted">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                About{" "}
                {Math.max(
                  1,
                  Math.ceil(
                    data.stories.reduce(
                      (total, story) =>
                        total + story.simplifiedStory.split(/\s+/).length,
                      0,
                    ) / 200,
                  ),
                )}{" "}
                min of reading
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

        {/* --- Tabs -------------------------------------------------------- */}
        <section>
          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          <TabPanel id="story" active={tab}>
            <div className="space-y-8">
              {data.stories.length === 0 ? (
                <p className="text-xs text-brand-muted font-serif italic">
                  No reviewed story has been published for this location yet.
                </p>
              ) : (
                data.stories.map((story) => (
                  <article
                    key={story.id}
                    className="bg-white rounded-3xl border border-brand-border p-6 space-y-3 shadow-sm"
                  >
                    <h2 className="font-serif font-black text-xl text-brand-olive">
                      {story.title}
                    </h2>
                    {story.summary && (
                      <p className="text-xs text-brand-muted font-serif italic">
                        {story.summary}
                      </p>
                    )}
                    <NarrativeReader text={story.simplifiedStory} autoPlay={walkingTour} />
                    {story.source && (
                      <p className="text-[10px] font-mono text-brand-muted flex items-center gap-1.5 pt-2 border-t border-brand-border-light">
                        <FileText className="w-3 h-3" />
                        Source: {story.source}
                      </p>
                    )}
                  </article>
                ))
              )}

              <div className="space-y-2">
                <h2 className="font-serif font-black text-2xl text-brand-olive flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-amber" />
                  Tell me the story
                </h2>
                <p className="text-xs text-brand-muted font-serif italic">
                  Generated from the reviewed content for this location only.
                </p>
                <StoryWizard location={location} />
              </div>
            </div>
          </TabPanel>

          <TabPanel id="guide" active={tab}>
            <HeritageChat location={location} />
          </TabPanel>

          <TabPanel id="timeline" active={tab}>
            <HistoricalTimeline events={data.timeline} />
          </TabPanel>

          <TabPanel id="gallery" active={tab}>
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="font-serif font-black text-xl text-brand-olive">
                  Then and now
                </h2>
                <BeforeAfterSlider data={data.beforeAfter} />
              </div>
              <div className="space-y-3">
                <h2 className="font-serif font-black text-xl text-brand-olive">
                  Photographs
                </h2>
                <Gallery images={data.media} />
              </div>
            </div>
          </TabPanel>

          <TabPanel id="quiz" active={tab}>
            <HeritageQuiz questions={data.quiz} locationName={location.name} />
          </TabPanel>

          <TabPanel id="memories" active={tab}>
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <p className="text-xs text-brand-muted font-serif italic">
                  Contributed by visitors and residents, published after review.
                </p>
                <Link
                  to={`/contribute?location=${location.id}`}
                  className="text-xs font-serif font-bold uppercase tracking-widest text-brand-olive hover:text-brand-amber inline-flex items-center gap-1.5"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  Add yours
                </Link>
              </div>

              {data.contributions.length === 0 ? (
                <p className="text-xs text-brand-muted font-serif italic">
                  No memories have been published for this location yet. Yours could be
                  the first.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {data.contributions.map((contribution) => (
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
            </div>
          </TabPanel>
        </section>

        {/* --- Related ------------------------------------------------------ */}
        {data.related.length > 0 && (
          <Reveal className="space-y-4">
            <h2 className="font-serif font-black text-2xl text-brand-olive">
              Related places
            </h2>
            <p className="text-xs text-brand-muted font-serif italic">
              Other locations in the archive that share a theme with {location.name}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.related.map((item) => (
                <LocationCard
                  key={item.id}
                  location={item}
                  visited={hasVisited(item.id)}
                />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </PageTransition>
  );
};
