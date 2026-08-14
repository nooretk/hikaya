import React, { useState } from "react";
import { motion } from "motion/react";
import { Award, Check, FileText, RotateCcw, X } from "lucide-react";
import { ApiQuizQuestion } from "../types";

interface HeritageQuizProps {
  questions: ApiQuizQuestion[];
  locationName: string;
}

/**
 * A short quiz after the story.
 *
 * Every question shows, once answered, both the explanation and the place in
 * the reviewed content the answer comes from. That is deliberate: a quiz that
 * simply asserts "correct" is asking to be trusted, and this project does not
 * ask readers to take its word for anything.
 */
export const HeritageQuiz: React.FC<HeritageQuizProps> = ({
  questions,
  locationName,
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  if (!questions.length) {
    return (
      <p className="text-xs text-brand-muted font-serif italic">
        No questions have been written for this location yet.
      </p>
    );
  }

  const answered = Object.keys(answers).length;
  const correct = questions.filter(
    (question) => answers[question.id] === question.answerIndex,
  ).length;

  const reset = () => {
    setAnswers({});
    setFinished(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <p className="text-xs text-brand-muted">
          {answered} of {questions.length} answered
          {answered > 0 && ` · ${correct} right`}
        </p>
        {answered > 0 && (
          <button
            type="button"
            onClick={reset}
            className="text-[10px] font-mono uppercase tracking-wider text-brand-muted hover:text-brand-olive inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Start again
          </button>
        )}
      </div>

      {questions.map((question, index) => {
        const chosen = answers[question.id];
        const hasAnswered = chosen !== undefined;

        return (
          <div
            key={question.id}
            className="bg-white rounded-3xl border border-brand-border p-5 space-y-3"
          >
            <p className="font-serif font-bold text-sm text-brand-olive">
              {index + 1}. {question.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {question.options.map((option, optionIndex) => {
                const isChosen = chosen === optionIndex;
                const isAnswer = optionIndex === question.answerIndex;
                // Colour only appears after an answer, so the layout does not
                // leak which option is right.
                const tone = !hasAnswered
                  ? "border-brand-border hover:border-brand-amber text-brand-text"
                  : isAnswer
                    ? "border-green-500 bg-green-50 text-green-900"
                    : isChosen
                      ? "border-red-400 bg-red-50 text-red-900"
                      : "border-brand-border-light text-brand-muted";

                return (
                  <button
                    key={optionIndex}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => {
                      const next = { ...answers, [question.id]: optionIndex };
                      setAnswers(next);
                      if (Object.keys(next).length === questions.length) {
                        setFinished(true);
                      }
                    }}
                    className={`text-left text-xs px-4 py-2.5 rounded-xl border transition-colors inline-flex items-start gap-2 ${tone}`}
                  >
                    {hasAnswered && isAnswer && (
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    )}
                    {hasAnswered && isChosen && !isAnswer && (
                      <X className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    )}
                    {option}
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5 pt-1"
              >
                <p className="text-xs text-brand-text leading-relaxed">
                  {question.explanation}
                </p>
                <p className="text-[10px] font-mono text-brand-muted flex items-start gap-1.5">
                  <FileText className="w-3 h-3 shrink-0 mt-0.5" />
                  {question.sourceNote}
                </p>
              </motion.div>
            )}
          </div>
        );
      })}

      {finished && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-bg border border-brand-amber/30 rounded-3xl p-5 text-center space-y-2"
        >
          <Award className="w-6 h-6 text-brand-amber mx-auto" />
          <p className="font-serif font-black text-lg text-brand-olive">
            {correct} out of {questions.length}
          </p>
          <p className="text-xs text-brand-muted">
            {correct === questions.length
              ? `You have ${locationName} down.`
              : "The answers above each say where to read more."}
          </p>
        </motion.div>
      )}
    </div>
  );
};
