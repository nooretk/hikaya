import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { ApiMedia } from "../types";
import { SkeletonLine } from "./Skeleton";

interface GalleryProps {
  images: ApiMedia[];
  loading?: boolean;
}

/**
 * Credit line for an image.
 *
 * Always rendered, never collapsed: these are other people's photographs, used
 * under licences that require attribution. If an item ever arrived without a
 * credit the gap would be visible here rather than quietly hidden.
 */
const Credit: React.FC<{ image: ApiMedia; className?: string }> = ({
  image,
  className = "",
}) => (
  <p className={`text-[10px] font-mono text-brand-muted ${className}`}>
    {image.credit ?? "Credit missing"}
    {image.capturedAt ? ` · ${image.capturedAt}` : ""}
    {image.license ? ` · ${image.license}` : ""}
    {image.sourceUrl && (
      <>
        {" · "}
        <a
          href={image.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-2 hover:text-brand-olive inline-flex items-center gap-0.5"
        >
          source
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </>
    )}
  </p>
);

/**
 * Image gallery for a location, with a lightbox.
 *
 * Historical photographs are labelled as such: a plate from the 1840s and a
 * phone photo from 2019 tell you very different things about a place, and the
 * difference should not have to be guessed from the sepia.
 */
export const Gallery: React.FC<GalleryProps> = ({ images, loading }) => {
  const reduced = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? null : (current + delta + images.length) % images.length,
      ),
    [images.length],
  );

  // Keyboard control for the lightbox: escape closes, arrows page through.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    // Stop the page behind the lightbox from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, step]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <SkeletonLine key={index} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!images.length) {
    return (
      <p className="text-xs text-brand-muted font-serif italic">
        No photographs have been added for this location yet.
      </p>
    );
  }

  const open = openIndex === null ? null : images[openIndex];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <figure key={image.id} className="space-y-1.5">
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="relative block w-full h-36 rounded-2xl overflow-hidden border border-brand-border bg-brand-olive group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber"
            >
              <img
                src={image.thumbUrl ?? image.url}
                alt={image.description ?? image.subject ?? "Heritage photograph"}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {image.era === "historical" && (
                <span className="absolute top-2 left-2 bg-white/90 text-brand-olive text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Historical
                </span>
              )}
            </button>
            {image.subject && (
              <figcaption className="text-[10px] font-serif font-bold text-brand-olive px-0.5">
                {image.subject}
              </figcaption>
            )}
            <Credit image={image} className="px-0.5 leading-snug" />
          </figure>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-brand-text/95 flex flex-col items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.1 : 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={open.subject ?? "Photograph"}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 text-stone-200 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photograph"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(-1);
                  }}
                  className="absolute left-2 sm:left-6 text-stone-200 hover:text-white p-2"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  type="button"
                  aria-label="Next photograph"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(1);
                  }}
                  className="absolute right-2 sm:right-6 text-stone-200 hover:text-white p-2"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <figure
              className="max-w-4xl w-full space-y-3"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={open.url}
                alt={open.description ?? open.subject ?? "Heritage photograph"}
                className="w-full max-h-[70vh] object-contain rounded-2xl"
              />
              <figcaption className="space-y-1 text-center">
                {open.subject && (
                  <p className="font-serif font-bold text-lg text-stone-100">
                    {open.subject}
                  </p>
                )}
                {open.description && (
                  <p className="text-xs text-stone-300 leading-relaxed max-w-2xl mx-auto">
                    {open.description}
                  </p>
                )}
                <Credit image={open} className="text-stone-400 pt-1" />
              </figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
