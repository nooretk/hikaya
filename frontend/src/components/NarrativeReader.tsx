import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import { useNarration } from "../hooks/useNarration";

interface NarrativeReaderProps {
  text: string;
  /** Reveal the text word by word, as if it were being written. */
  typing?: boolean;
  /** Offer the read-aloud controls. */
  narration?: boolean;
  /** Start reading aloud as soon as the text arrives (used by the walking tour). */
  autoPlay?: boolean;
}

/** Splits a narrative into paragraphs, each tokenised into words. */
function tokenise(text: string) {
  const paragraphs = text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  let running = 0;
  return paragraphs.map((paragraph) => {
    const lines = paragraph.split("\n").map((line) => {
      const words = line.split(/(\s+)/).filter((token) => token.length > 0);
      const entries = words.map((token) => {
        if (/^\s+$/.test(token)) return { token, index: -1 };
        const entry = { token, index: running };
        running += 1;
        return entry;
      });
      return entries;
    });
    return lines;
  });
}

/**
 * Displays a narrative, optionally revealing it as it is "written" and reading
 * it aloud with the current word highlighted.
 *
 * The two effects share one word index so they never contradict each other:
 * while speech is running the highlight follows the voice, and typing is
 * skipped. Both collapse to plain text when the reader has asked for reduced
 * motion or the browser has no speech synthesis - the words are the point, the
 * animation is not.
 */
export const NarrativeReader: React.FC<NarrativeReaderProps> = ({
  text,
  typing = false,
  narration = true,
  autoPlay = false,
}) => {
  const reduced = useReducedMotion();
  const speech = useNarration();
  const paragraphs = useMemo(() => tokenise(text), [text]);
  const totalWords = useMemo(
    () => text.split(/\s+/).filter(Boolean).length,
    [text],
  );

  const [typedCount, setTypedCount] = useState(() =>
    typing && !reduced ? 0 : totalWords,
  );
  const autoPlayedFor = useRef<string | null>(null);

  // Typewriter reveal. Word-at-a-time rather than character-at-a-time: a
  // character crawl on a 300-word narrative is a minute of waiting.
  useEffect(() => {
    if (!typing || reduced) {
      setTypedCount(totalWords);
      return;
    }
    setTypedCount(0);
    const interval = window.setInterval(() => {
      setTypedCount((current) => {
        if (current >= totalWords) {
          window.clearInterval(interval);
          return current;
        }
        return current + 2;
      });
    }, 28);
    return () => window.clearInterval(interval);
  }, [text, typing, reduced, totalWords]);

  useEffect(() => {
    if (!autoPlay || !narration || !speech.supported) return;
    if (autoPlayedFor.current === text) return;
    autoPlayedFor.current = text;
    setTypedCount(totalWords);
    speech.speak(text);
  }, [autoPlay, narration, speech, text, totalWords]);

  const isTyping = typedCount < totalWords;
  const highlight = speech.speaking ? speech.wordIndex : -1;

  return (
    <div className="space-y-4">
      {narration && speech.supported && (
        <div className="flex flex-wrap items-center gap-2">
          {!speech.speaking ? (
            <button
              type="button"
              onClick={() => {
                setTypedCount(totalWords);
                speech.speak(text);
              }}
              className="border border-brand-border hover:border-brand-amber text-brand-olive text-[10px] font-mono uppercase tracking-wider px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-3 h-3" />
              Listen
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={speech.paused ? speech.resume : speech.pause}
                className="border border-brand-border hover:border-brand-amber text-brand-olive text-[10px] font-mono uppercase tracking-wider px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-colors"
              >
                {speech.paused ? (
                  <Play className="w-3 h-3" />
                ) : (
                  <Pause className="w-3 h-3" />
                )}
                {speech.paused ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                onClick={speech.stop}
                className="border border-brand-border hover:border-brand-amber text-brand-olive text-[10px] font-mono uppercase tracking-wider px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition-colors"
              >
                <Square className="w-3 h-3" />
                Stop
              </button>
            </>
          )}

          {isTyping && (
            <button
              type="button"
              onClick={() => setTypedCount(totalWords)}
              className="text-[10px] font-mono uppercase tracking-wider text-brand-muted hover:text-brand-olive underline underline-offset-2"
            >
              Show it all
            </button>
          )}
        </div>
      )}

      <div className="space-y-3 text-sm text-brand-text leading-relaxed">
        {paragraphs.map((lines, paragraphIndex) => (
          <p key={paragraphIndex} className="whitespace-pre-line">
            {lines.map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {lineIndex > 0 && "\n"}
                {line.map((entry, entryIndex) => {
                  if (entry.index === -1) {
                    return <React.Fragment key={entryIndex}>{entry.token}</React.Fragment>;
                  }
                  if (entry.index >= typedCount) return null;
                  const spoken = entry.index === highlight;
                  return (
                    <span
                      key={entryIndex}
                      className={
                        spoken
                          ? "bg-brand-amber/25 rounded-sm transition-colors"
                          : undefined
                      }
                    >
                      {entry.token}
                    </span>
                  );
                })}
              </React.Fragment>
            ))}
            {/* Cursor, only on the paragraph currently being revealed. */}
            {isTyping && paragraphIndex === paragraphs.length - 1 && (
              <span className="inline-block w-1.5 h-4 bg-brand-amber align-middle animate-pulse ml-0.5" />
            )}
          </p>
        ))}
      </div>

      {narration && !speech.supported && (
        <p className="text-[10px] font-mono text-brand-muted">
          Read-aloud is not available in this browser.
        </p>
      )}
    </div>
  );
};
