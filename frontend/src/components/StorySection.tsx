import React, { useState } from "react";
import { AlertTriangle, BookOpen, FileText, Loader2, Sparkles } from "lucide-react";
import { ApiLocation, ApiStory, AudienceMode, GeneratedStory } from "../types";
import { generateStory } from "../services/api";

interface StorySectionProps {
  location: ApiLocation;
  stories: ApiStory[];
  loading: boolean;
}

const AUDIENCES: { value: AudienceMode; label: string; hint: string }[] = [
  { value: "student", label: "Student", hint: "Educational, follows the timeline" },
  { value: "tourist", label: "Tourist", hint: "What to see when you are there" },
  { value: "child", label: "Child", hint: "Short sentences, gentle" },
  { value: "short", label: "Short", hint: "Five sentences at most" },
  { value: "general", label: "General", hint: "Balanced" },
];

/** Renders a narrative preserving blank lines and bullet lines. */
const Narrative: React.FC<{ text: string }> = ({ text }) => (
  <div className="space-y-3 text-sm text-brand-text leading-relaxed">
    {text.split(/\n{2,}/).map((block, index) => (
      <p key={index} className="whitespace-pre-line">
        {block}
      </p>
    ))}
  </div>
);

/**
 * Story narrative section of the location details page.
 *
 * Shows the reviewed stories already published for the location, and lets the
 * reader request an AI narrative for a chosen audience. Two things are always
 * surfaced with a generated story, because the whole content workflow depends
 * on them:
 *
 *  - the source file the facts came from, and
 *  - the uncertainty notes, i.e. what the AI refused to guess at.
 */
export const StorySection: React.FC<StorySectionProps> = ({
  location,
  stories,
  loading,
}) => {
  const [audience, setAudience] = useState<AudienceMode>("student");
  const [generated, setGenerated] = useState<GeneratedStory | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateStory(location.id, audience);
      setGenerated(result.data);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The story could not be generated right now.",
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="space-y-8">
      {/* --- Reviewed stories ------------------------------------------- */}
      <div className="space-y-4">
        <h2 className="font-serif font-black text-2xl text-brand-olive flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-amber" />
          Reviewed stories
        </h2>

        {loading && (
          <p className="text-xs text-brand-muted font-serif italic">Loading stories…</p>
        )}

        {!loading && stories.length === 0 && (
          <p className="text-xs text-brand-muted font-serif italic">
            No reviewed story has been published for this location yet.
          </p>
        )}

        {stories.map((story) => (
          <article
            key={story.id}
            className="bg-white rounded-3xl border border-brand-border p-6 space-y-3 shadow-sm"
          >
            <h3 className="font-serif font-black text-xl text-brand-olive">
              {story.title}
            </h3>
            {story.summary && (
              <p className="text-xs text-brand-muted font-serif italic">{story.summary}</p>
            )}
            <Narrative text={story.simplifiedStory} />
            {story.source && (
              <p className="text-[10px] font-mono text-brand-muted flex items-center gap-1.5 pt-2 border-t border-brand-border-light">
                <FileText className="w-3 h-3" />
                Source: {story.source}
              </p>
            )}
          </article>
        ))}
      </div>

      {/* --- AI narrative ----------------------------------------------- */}
      <div className="space-y-4">
        <div>
          <h2 className="font-serif font-black text-2xl text-brand-olive flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-amber" />
            Tell me the story
          </h2>
          <p className="text-xs text-brand-muted font-serif italic">
            Generated from the reviewed content for this location only. The AI does not
            add facts of its own.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-brand-border p-6 space-y-5 shadow-sm">
          <fieldset className="space-y-2">
            <legend className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
              Who is this for?
            </legend>
            <div className="flex flex-wrap gap-2">
              {AUDIENCES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  title={option.hint}
                  onClick={() => setAudience(option.value)}
                  className={`px-4 py-2 rounded-full text-xs font-serif font-bold tracking-wide border transition-colors ${
                    audience === option.value
                      ? "bg-brand-olive text-brand-bg border-brand-olive"
                      : "bg-brand-bg text-brand-text border-brand-border hover:border-brand-amber"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="bg-brand-amber hover:bg-[#b45f05] disabled:opacity-60 text-white text-xs font-serif font-black tracking-widest uppercase px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors"
          >
            {generating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {generating ? "Generating…" : "Generate story"}
          </button>

          {error && (
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {generated && (
            <article className="space-y-4 pt-2 border-t border-brand-border-light">
              <div>
                <h3 className="font-serif font-black text-xl text-brand-olive">
                  {generated.title}
                </h3>
                <p className="text-xs text-brand-muted font-serif italic">
                  {generated.summary}
                </p>
              </div>

              <Narrative text={generated.narrative} />

              {generated.uncertaintyNotes.length > 0 && (
                <div className="bg-brand-bg border border-brand-border-light rounded-2xl p-4 space-y-1.5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
                    What the records do not cover
                  </p>
                  <ul className="text-xs text-brand-text leading-relaxed list-disc pl-4 space-y-1">
                    {generated.uncertaintyNotes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {generated.warnings.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-1.5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-red-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    Flagged for review
                  </p>
                  <ul className="text-xs text-red-800 leading-relaxed list-disc pl-4 space-y-1">
                    {generated.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-[10px] font-mono text-brand-muted flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 border-t border-brand-border-light">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  Source: {generated.source.contentFile ?? location.contentFile ?? "—"}
                </span>
                <span>Generated by: {generated.generatedBy}</span>
                <span>{generated.wordCount} words</span>
                {generated.storyId && <span>Queued for review</span>}
              </p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
};
