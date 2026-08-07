import React from "react";
import { CloudOff } from "lucide-react";
import { DataSource } from "../types";
import { apiBaseUrl } from "../services/api";

interface DataSourceBannerProps {
  source: DataSource;
  reason?: string;
}

/**
 * Shown whenever the page is displaying mock data because the backend could not
 * be reached.
 *
 * The mock data is deliberately identical in shape and content to the seeded
 * database, which makes it easy to mistake for live data - so the UI says so
 * outright rather than letting the reader assume.
 */
export const DataSourceBanner: React.FC<DataSourceBannerProps> = ({ source, reason }) => {
  if (source === "backend") return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-brand-amber/30 bg-brand-amber/10 px-4 py-3">
      <CloudOff className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
      <div className="text-xs text-brand-text leading-relaxed">
        <p className="font-bold text-brand-amber uppercase tracking-wider text-[10px] font-mono">
          Sample data
        </p>
        <p>
          The Hikaya API at <code className="font-mono">{apiBaseUrl}</code> is not
          reachable, so this page is showing the bundled sample content. Start the
          backend with <code className="font-mono">cd backend &amp;&amp; npm run start:dev</code>{" "}
          to see live data.
        </p>
        {reason && <p className="text-brand-muted mt-1 font-mono text-[10px]">{reason}</p>}
      </div>
    </div>
  );
};
