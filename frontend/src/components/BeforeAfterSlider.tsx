import React, { useRef, useState } from "react";
import { CameraOff, MoveHorizontal } from "lucide-react";
import { BeforeAfterResponse } from "../types";

/**
 * Then-and-now comparison of the same subject.
 *
 * Only shown where the archive actually holds a historical photograph and a
 * present-day one *of the same thing*. Where it does not, the component says so
 * rather than sliding between two unrelated pictures and letting the reader
 * infer a change that was never photographed.
 *
 * Works by pointer and by keyboard: the divider is a range input, so arrow keys
 * move it and screen readers announce it.
 */
export const BeforeAfterSlider: React.FC<{ data: BeforeAfterResponse }> = ({ data }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!data.pair) {
    return (
      <div className="bg-brand-bg border border-brand-border-light rounded-2xl px-4 py-5 flex items-start gap-3">
        <CameraOff className="w-4 h-4 text-brand-muted shrink-0 mt-0.5" />
        <div className="text-xs text-brand-text leading-relaxed">
          <p className="font-serif font-bold text-brand-olive">
            No then-and-now comparison yet
          </p>
          <p className="text-brand-muted mt-1">
            {data.reason ??
              "This location has no historical photograph of the same subject as a present-day one."}{" "}
            A comparison between two different subjects would show a change that never
            happened, so none is shown.
          </p>
        </div>
      </div>
    );
  }

  const { before, after } = data.pair;

  const dragTo = (clientX: number) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const ratio = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(100, Math.max(0, ratio)));
  };

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden border border-brand-border bg-brand-olive select-none"
        onPointerMove={(event) => {
          if (event.buttons === 1) dragTo(event.clientX);
        }}
        onPointerDown={(event) => dragTo(event.clientX)}
      >
        {/* Present day sits underneath; the historical plate is clipped over it. */}
        <img
          src={after.url}
          alt={after.description ?? `${after.subject} today`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={before.url}
            alt={before.description ?? `${before.subject} historically`}
            /*
             * Width is pinned to the container, not the clipping box, so the
             * historical image does not squash as the divider moves.
             */
            style={{ width: containerRef.current?.offsetWidth ?? "100%" }}
            className="absolute inset-0 h-full max-w-none object-cover"
            draggable={false}
          />
          <span className="absolute top-3 left-3 bg-white/90 text-brand-olive text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full">
            {before.capturedAt || "Historical"}
          </span>
        </div>

        <span className="absolute top-3 right-3 bg-white/90 text-brand-olive text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full">
          {after.capturedAt || "Today"}
        </span>

        <div
          className="absolute inset-y-0 w-0.5 bg-white shadow-lg pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
            <MoveHorizontal className="w-4 h-4 text-brand-olive" />
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label={`Compare ${before.subject} then and now`}
          className="absolute inset-x-0 bottom-0 w-full opacity-0 h-12 cursor-ew-resize"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-mono text-brand-muted">
        <p>
          <span className="font-bold text-brand-olive">Then:</span> {before.credit}
          {before.license ? ` · ${before.license}` : ""}
        </p>
        <p className="sm:text-right">
          <span className="font-bold text-brand-olive">Now:</span> {after.credit}
          {after.license ? ` · ${after.license}` : ""}
        </p>
      </div>
    </div>
  );
};
