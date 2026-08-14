import React, { useState } from "react";
import { ChevronDown, FileText, ShieldCheck } from "lucide-react";

interface TransparencyPanelProps {
  sourceFile?: string | null;
  summaryFile?: string | null;
  generatedBy: string;
  wordCount?: number;
  audience?: string;
  uncertaintyNotes: string[];
  queuedForReview?: boolean;
}

const BACKEND_LABELS: Record<string, string> = {
  anthropic: "a language model, under strict no-invention prompts",
  "offline-extractive":
    "Hikaya's offline generator, which only reuses sentences from the source",
  "backend-fallback":
    "the stored location description — the AI service could not be reached",
  "frontend-mock": "bundled sample data — the API could not be reached",
};

/**
 * Where a generated story came from, and what it could not say.
 *
 * Always attached to generated text, never collapsed away entirely. A reader
 * who cannot tell which file a claim came from, or that the records had a hole
 * in them, has no way to check the platform's work - and being checkable is the
 * point of the whole content pipeline.
 */
export const TransparencyPanel: React.FC<TransparencyPanelProps> = ({
  sourceFile,
  summaryFile,
  generatedBy,
  wordCount,
  audience,
  uncertaintyNotes,
  queuedForReview,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <section className="border border-brand-border-light rounded-2xl overflow-hidden">
      <div className="bg-brand-bg px-4 py-3 space-y-2">
        <p className="text-[10px] font-mono uppercase tracking-widest text-brand-olive flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-brand-amber" />
          Where this came from
        </p>
        <p className="text-xs text-brand-text leading-relaxed">
          Every fact above is drawn from{" "}
          <span className="font-mono text-brand-olive">{sourceFile ?? "the reviewed content"}</span>
          , written by {BACKEND_LABELS[generatedBy] ?? generatedBy}.
          {queuedForReview &&
            " A copy has been queued for an editor to review before it can be published."}
        </p>
      </div>

      {uncertaintyNotes.length > 0 && (
        <div className="px-4 py-3 border-t border-brand-border-light space-y-1.5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted">
            What the records do not cover
          </p>
          <ul className="text-xs text-brand-text leading-relaxed list-disc pl-4 space-y-1">
            {uncertaintyNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="w-full px-4 py-2 border-t border-brand-border-light text-[10px] font-mono uppercase tracking-wider text-brand-muted hover:text-brand-olive flex items-center justify-between transition-colors"
      >
        Technical detail
        <ChevronDown
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <dl className="px-4 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] font-mono text-brand-muted">
          {summaryFile && (
            <div className="sm:col-span-2 flex items-start gap-1.5">
              <FileText className="w-3 h-3 shrink-0 mt-0.5" />
              <span>
                <dt className="inline text-brand-olive">AI input: </dt>
                <dd className="inline">{summaryFile}</dd>
              </span>
            </div>
          )}
          <div>
            <dt className="inline text-brand-olive">Generator: </dt>
            <dd className="inline">{generatedBy}</dd>
          </div>
          {audience && (
            <div>
              <dt className="inline text-brand-olive">Audience: </dt>
              <dd className="inline">{audience}</dd>
            </div>
          )}
          {wordCount !== undefined && (
            <div>
              <dt className="inline text-brand-olive">Length: </dt>
              <dd className="inline">{wordCount} words</dd>
            </div>
          )}
        </dl>
      )}
    </section>
  );
};
