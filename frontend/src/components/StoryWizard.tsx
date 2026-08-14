import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import { ApiLocation, AudienceMode, GeneratedStory, StoryTone } from "../types";
import { generateStory } from "../services/api";
import { NarrativeReader } from "./NarrativeReader";
import { TransparencyPanel } from "./TransparencyPanel";

interface StoryWizardProps {
  location: ApiLocation;
  /** Starts reading aloud as soon as a story is generated. */
  autoPlay?: boolean;
}

const AUDIENCES: { value: AudienceMode; label: string; hint: string }[] = [
  { value: "student", label: "Student", hint: "Educational, follows the timeline" },
  { value: "tourist", label: "Tourist", hint: "What to see when you are standing there" },
  { value: "child", label: "Child", hint: "Short sentences, gentle, leaves out the wars" },
  { value: "historian", label: "Historian", hint: "Precise, full chronology, no simplifying" },
  { value: "short", label: "In brief", hint: "Five sentences at most" },
  { value: "general", label: "Anyone", hint: "Balanced" },
];

const TONES: { value: StoryTone; label: string; hint: string }[] = [
  { value: "storytelling", label: "Storytelling", hint: "Flows like a story" },
  { value: "educational", label: "Explanatory", hint: "As a teacher would" },
  { value: "emotional", label: "Warm", hint: "Feeling, without overstating" },
  { value: "neutral", label: "Plain", hint: "Just the facts" },
];

type Step = "audience" | "tone" | "result";

/**
 * Story generation as three steps rather than one button.
 *
 * Choosing the audience is the decision that changes the story most, so it gets
 * a screen of its own instead of being a dropdown someone skips past. The tone
 * step is skippable - it refines, it does not transform.
 */
export const StoryWizard: React.FC<StoryWizardProps> = ({ location, autoPlay }) => {
  const reduced = useReducedMotion();
  const [step, setStep] = useState<Step>("audience");
  const [audience, setAudience] = useState<AudienceMode>("student");
  const [tone, setTone] = useState<StoryTone>("storytelling");
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (chosenTone: StoryTone) => {
    setGenerating(true);
    setError(null);
    setStep("result");
    try {
      const result = await generateStory(location.id, audience, chosenTone);
      setStory(result.data);
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

  const restart = () => {
    setStory(null);
    setError(null);
    setStep("audience");
  };

  const stepIndex = step === "audience" ? 0 : step === "tone" ? 1 : 2;

  return (
    <div className="bg-white rounded-3xl border border-brand-border p-6 space-y-5 shadow-sm">
      {/* --- Step indicator --------------------------------------------- */}
      <ol className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
        {["Audience", "Style", "Story"].map((label, index) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full inline-flex items-center justify-center border transition-colors ${
                index < stepIndex
                  ? "bg-brand-olive text-brand-bg border-brand-olive"
                  : index === stepIndex
                    ? "border-brand-amber text-brand-amber"
                    : "border-brand-border text-brand-muted"
              }`}
            >
              {index < stepIndex ? <Check className="w-3 h-3" /> : index + 1}
            </span>
            <span className={index === stepIndex ? "text-brand-olive" : "text-brand-muted"}>
              {label}
            </span>
            {index < 2 && <span className="w-6 h-px bg-brand-border-light" />}
          </li>
        ))}
      </ol>

      {/*
        Keyed on `step` so React remounts and the entrance animation replays.
        Deliberately not wrapped in AnimatePresence: with `mode="wait"` the
        outgoing step never finished exiting here, so the new step never
        mounted and the wizard froze on screen even though its state had moved
        on. An entrance-only animation cannot get stuck.
      */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: reduced ? 0 : 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reduced ? 0.12 : 0.25 }}
        className="space-y-4"
      >
          {step === "audience" && (
            <>
              <div>
                <h3 className="font-serif font-black text-xl text-brand-olive">
                  Who is this story for?
                </h3>
                <p className="text-xs text-brand-muted">
                  The same reviewed content, told for a different reader.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AUDIENCES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setAudience(option.value);
                      setStep("tone");
                    }}
                    className={`text-left px-4 py-3 rounded-2xl border transition-colors group ${
                      audience === option.value
                        ? "border-brand-amber bg-brand-amber/5"
                        : "border-brand-border hover:border-brand-amber"
                    }`}
                  >
                    <span className="font-serif font-bold text-sm text-brand-olive block">
                      {option.label}
                    </span>
                    <span className="text-xs text-brand-muted">{option.hint}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "tone" && (
            <>
              <div>
                <h3 className="font-serif font-black text-xl text-brand-olive">
                  How should it sound?
                </h3>
                <p className="text-xs text-brand-muted">
                  Optional — the default reads well for most people.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TONES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setTone(option.value);
                      void run(option.value);
                    }}
                    className={`text-left px-4 py-3 rounded-2xl border transition-colors ${
                      tone === option.value
                        ? "border-brand-amber bg-brand-amber/5"
                        : "border-brand-border hover:border-brand-amber"
                    }`}
                  >
                    <span className="font-serif font-bold text-sm text-brand-olive block">
                      {option.label}
                    </span>
                    <span className="text-[10px] text-brand-muted">{option.hint}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setStep("audience")}
                  className="text-xs font-serif font-bold uppercase tracking-widest text-brand-muted hover:text-brand-olive inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => void run(tone)}
                  className="bg-brand-amber hover:bg-[#b45f05] text-white text-xs font-serif font-black tracking-widest uppercase px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Write it
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {step === "result" && (
            <>
              {generating && (
                <div className="py-10 text-center space-y-3">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-amber mx-auto" />
                  <p className="text-xs text-brand-muted font-serif italic">
                    Reading the reviewed records for {location.name}…
                  </p>
                </div>
              )}

              {error && (
                <p className="text-xs text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              {story && !generating && (
                <article className="space-y-4">
                  <div>
                    <h3 className="font-serif font-black text-2xl text-brand-olive">
                      {story.title}
                    </h3>
                    <p className="text-xs text-brand-muted font-serif italic">
                      {story.summary}
                    </p>
                  </div>

                  <NarrativeReader text={story.narrative} typing autoPlay={autoPlay} />

                  {story.warnings.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-1.5">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-red-700 flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3" />
                        Flagged for review
                      </p>
                      <ul className="text-xs text-red-800 leading-relaxed list-disc pl-4 space-y-1">
                        {story.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <TransparencyPanel
                    sourceFile={story.source.contentFile ?? location.contentFile}
                    summaryFile={story.source.summaryFile ?? location.aiSummaryFile}
                    generatedBy={story.generatedBy}
                    wordCount={story.wordCount}
                    audience={story.targetAudience}
                    uncertaintyNotes={story.uncertaintyNotes}
                    queuedForReview={Boolean(story.storyId)}
                  />

                  <button
                    type="button"
                    onClick={restart}
                    className="text-xs font-serif font-bold uppercase tracking-widest text-brand-olive hover:text-brand-amber inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Tell it differently
                  </button>
                </article>
              )}
            </>
          )}
      </motion.div>

      {step !== "result" && (
        <p className="text-[10px] font-mono text-brand-muted flex items-center gap-1.5 pt-1 border-t border-brand-border-light">
          <FileText className="w-3 h-3" />
          Written only from {location.contentFile ?? "the reviewed content"}
        </p>
      )}
    </div>
  );
};
