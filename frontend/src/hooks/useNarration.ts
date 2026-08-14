import { useCallback, useEffect, useRef, useState } from "react";

export interface NarrationState {
  supported: boolean;
  speaking: boolean;
  paused: boolean;
  /** Index of the word currently being spoken, or -1. */
  wordIndex: number;
  words: string[];
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

/**
 * Reads a narrative aloud and reports which word is being spoken, so the text
 * can be highlighted in step with the voice.
 *
 * Uses the browser's built-in speech synthesis: no API key, no network, no
 * audio files to license, and it works with whatever voices the reader already
 * has installed. `onboundary` gives a character offset into the utterance,
 * which is mapped back to a word index here.
 *
 * Support is uneven - `onboundary` does not fire in some browsers - so callers
 * must handle `wordIndex` staying at -1 while `speaking` is true, and simply
 * not highlight.
 */
export function useNarration(): NarrationState {
  const [supported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
  );
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [wordIndex, setWordIndex] = useState(-1);
  const [words, setWords] = useState<string[]>([]);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  // Character offset of the start of each word, for the boundary lookup.
  const offsetsRef = useRef<number[]>([]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
    setPaused(false);
    setWordIndex(-1);
  }, [supported]);

  // Speech keeps going after the component unmounts unless it is cancelled.
  useEffect(() => stop, [stop]);

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;
      window.speechSynthesis.cancel();

      const spoken = text.replace(/\s+/g, " ").trim();
      const tokens: string[] = [];
      const offsets: number[] = [];
      const wordPattern = /\S+/g;
      let match: RegExpExecArray | null;
      while ((match = wordPattern.exec(spoken)) !== null) {
        tokens.push(match[0]);
        offsets.push(match.index);
      }
      setWords(tokens);
      offsetsRef.current = offsets;
      setWordIndex(-1);

      const utterance = new SpeechSynthesisUtterance(spoken);
      utterance.rate = 0.95;
      utterance.pitch = 1;

      utterance.onboundary = (event) => {
        if (event.name && event.name !== "word") return;
        // The last offset at or before the char index is the current word.
        const offsetList = offsetsRef.current;
        let low = 0;
        let high = offsetList.length - 1;
        let found = -1;
        while (low <= high) {
          const mid = (low + high) >> 1;
          if (offsetList[mid] <= event.charIndex) {
            found = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
        setWordIndex(found);
      };

      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
        setWordIndex(-1);
        utteranceRef.current = null;
      };
      utterance.onerror = utterance.onend;

      utteranceRef.current = utterance;
      setSpeaking(true);
      setPaused(false);
      window.speechSynthesis.speak(utterance);
    },
    [supported],
  );

  const pause = useCallback(() => {
    if (!supported || !speaking) return;
    window.speechSynthesis.pause();
    setPaused(true);
  }, [supported, speaking]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setPaused(false);
  }, [supported]);

  return { supported, speaking, paused, wordIndex, words, speak, pause, resume, stop };
}
