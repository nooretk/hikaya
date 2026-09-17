import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { BookMarked, FileText, Info } from "lucide-react";
import { ApiTimelineEvent } from "../types";
import { SkeletonLine, SkeletonText } from "./Skeleton";

interface HistoricalTimelineProps {
  events: ApiTimelineEvent[];
  loading?: boolean;
}

/**
 * The historical timeline for a location.
 *
 * Entries appear in the order the reviewed content file gives them, which the
 * documentation team writes chronologically. Anything resting on religious or
 * oral tradition is marked as such rather than being blended into the record -
 * the same separation the content files and the AI module keep.
 */
export const HistoricalTimeline: React.FC<HistoricalTimelineProps> = ({
  events,
  loading,
}) => {
  const reduced = useReducedMotion();

  if (loading) {
    return (
      <div className="space-y-6 pl-6">
        {[0, 1, 2].map((index) => (
          <div key={index} className="space-y-2">
            <SkeletonLine className="h-3 w-40" />
            <SkeletonText lines={2} />
          </div>
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <p className="text-xs text-brand-muted font-serif italic">
        No timeline has been documented for this location yet.
      </p>
    );
  }

  const traditionCount = events.filter((event) => event.isTradition).length;
  const sourceFile = events.find((event) => event.sourceFile)?.sourceFile;

  return (
    <div className="space-y-5">
      {traditionCount > 0 && (
        <p className="text-xs text-brand-text bg-brand-bg border border-brand-border-light rounded-2xl px-4 py-3 flex items-start gap-2 leading-relaxed">
          <Info className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
          <span>
            {traditionCount} of these {events.length} entries rest on religious or oral
            tradition rather than documented history. They are marked, and kept in place
            rather than removed — the tradition is part of the record too.
          </span>
        </p>
      )}

      <ol className="relative border-l-2 border-brand-border-light ml-2 space-y-6">
        {events.map((event, index) => (
          <motion.li
            key={event.id}
            className="relative pl-6"
            initial={{ opacity: 0, x: reduced ? 0 : -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: reduced ? 0.15 : 0.35, delay: reduced ? 0 : index * 0.03 }}
          >
            <span
              className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-brand-bg ${
                event.isTradition ? "bg-brand-amber" : "bg-brand-olive"
              }`}
              aria-hidden="true"
            />

            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h4 className="font-serif font-bold text-sm text-brand-olive">
                {event.periodLabel}
              </h4>
              {event.isTradition && (
                <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-amber/10 text-brand-amber border border-brand-amber/20 inline-flex items-center gap-1">
                  <BookMarked className="w-2.5 h-2.5" />
                  Tradition
                </span>
              )}
            </div>

            <p className="text-xs text-brand-text leading-relaxed mt-1">
              {event.description}
            </p>
          </motion.li>
        ))}
      </ol>

      {sourceFile && (
        <p className="text-[10px] font-mono text-brand-muted flex items-center gap-1.5 pt-1">
          <FileText className="w-3 h-3" />
          Every entry above comes from {sourceFile}
        </p>
      )}
    </div>
  );
};
