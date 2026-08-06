import React, { useState } from "react";
import { CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import { ApiLocation } from "../types";
import { submitContribution } from "../services/api";

interface ContributionFormProps {
  locations: ApiLocation[];
  /** Preselected location, when the form is opened from a location page. */
  defaultLocationId?: string;
}

const MIN_CONTENT_LENGTH = 20;

/**
 * User contribution form.
 *
 * Posts to `POST /api/v1/contributions`. Unlike the read paths, this has no
 * mock fallback: if the backend is down the contributor is told the submission
 * failed, rather than being shown a receipt for something that was never saved.
 */
export const ContributionForm: React.FC<ContributionFormProps> = ({
  locations,
  defaultLocationId,
}) => {
  const [locationId, setLocationId] = useState(
    defaultLocationId ?? locations[0]?.id ?? "",
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [contributorEmail, setContributorEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);

  const contentTooShort = content.trim().length < MIN_CONTENT_LENGTH;
  const canSubmit =
    !submitting && locationId !== "" && title.trim() !== "" && !contentTooShort;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);
    setReceipt(null);

    try {
      const response = await submitContribution({
        locationId,
        title: title.trim(),
        content: content.trim(),
        contributorName: contributorName.trim() || undefined,
        contributorEmail: contributorEmail.trim() || undefined,
      });
      setReceipt(response.message);
      setTitle("");
      setContent("");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The contribution could not be submitted.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-text focus:outline-none focus:border-brand-amber transition-colors";
  const labelClass =
    "text-[10px] font-mono uppercase tracking-widest text-brand-muted block mb-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-brand-border p-6 space-y-5 shadow-sm"
    >
      <div>
        <label className={labelClass} htmlFor="contribution-location">
          Location
        </label>
        <select
          id="contribution-location"
          className={fieldClass}
          value={locationId}
          onChange={(event) => setLocationId(event.target.value)}
          required
        >
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="contribution-title">
          Title
        </label>
        <input
          id="contribution-title"
          className={fieldClass}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          placeholder="Friday mornings at Damascus Gate"
          required
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contribution-content">
          Your memory or story
        </label>
        <textarea
          id="contribution-content"
          className={`${fieldClass} min-h-[160px] resize-y`}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={10000}
          placeholder="What do you remember about this place? A person, a smell, a season, a habit — anything that would otherwise be lost."
          required
        />
        <p className="text-[10px] font-mono text-brand-muted mt-1.5">
          {content.trim().length} characters
          {contentTooShort && ` · at least ${MIN_CONTENT_LENGTH} needed`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="contribution-name">
            Your name (optional)
          </label>
          <input
            id="contribution-name"
            className={fieldClass}
            value={contributorName}
            onChange={(event) => setContributorName(event.target.value)}
            maxLength={120}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contribution-email">
            Email (optional)
          </label>
          <input
            id="contribution-email"
            type="email"
            className={fieldClass}
            value={contributorEmail}
            onChange={(event) => setContributorEmail(event.target.value)}
            placeholder="Only used if an editor needs to ask you something"
          />
        </div>
      </div>

      <p className="text-xs text-brand-muted flex items-start gap-2 leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-brand-olive shrink-0 mt-0.5" />
        Every contribution is read by an editor before it appears on the site. Personal
        memories are published as oral heritage, kept separate from documented history.
      </p>

      <button
        type="submit"
        disabled={!canSubmit}
        className="bg-brand-olive hover:bg-[#4a4a35] disabled:opacity-50 disabled:cursor-not-allowed text-brand-bg text-xs font-serif font-black tracking-widest uppercase px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors"
      >
        {submitting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Send className="w-3.5 h-3.5 text-brand-amber" />
        )}
        {submitting ? "Sending…" : "Submit contribution"}
      </button>

      {receipt && (
        <p className="text-xs text-green-800 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          {receipt}
        </p>
      )}

      {error && (
        <div className="text-xs text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-1">
          <p className="font-bold">The contribution was not saved.</p>
          <p>{error}</p>
          <p className="text-red-700">
            Nothing was stored — please copy your text before leaving the page.
          </p>
        </div>
      )}
    </form>
  );
};
