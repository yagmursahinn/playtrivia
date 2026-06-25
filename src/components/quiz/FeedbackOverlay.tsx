"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { QuizConfetti } from "@/components/quiz/QuizConfetti";
import {
  cardStackOverlayEnter,
  cardStackActive,
  cardStackTransition,
  shakeAnimation,
  transitions,
} from "@/lib/theme/animations";
import { EnumerationAcceptedAnswersList } from "@/components/quiz/EnumerationAcceptedAnswersList";
import type { FeedbackState } from "@/types/quiz";
import { cn } from "@/lib/utils/cn";

type FeedbackOverlayProps = {
  feedback: FeedbackState;
  onContinue: () => void;
};

function AnswerList({ title, answers }: { title: string; answers: string[] }) {
  if (answers.length === 0) return null;

  return (
    <div className="mt-4 w-full rounded-2xl border-2 border-dark/10 bg-white/70 px-4 py-3 text-left sm:px-5 sm:py-4">
      <p className="font-body text-xs font-semibold text-dark/50 sm:text-sm">{title}</p>
      <p className="mt-1.5 font-display text-sm font-bold leading-relaxed text-dark sm:text-base">
        {answers.join(", ")}
      </p>
    </div>
  );
}

export function FeedbackOverlay({ feedback, onContinue }: FeedbackOverlayProps) {
  const isEnumeration = feedback.enumerationRequiredCount !== undefined;
  const isFullyCorrect = Boolean(feedback.isFullyCorrect);
  const isPartial = Boolean(feedback.isPartial);
  const earnedPoints = feedback.pointsEarned > 0;
  const showConfetti = isFullyCorrect || (earnedPoints && !isPartial && !isEnumeration);
  const showShake = !earnedPoints || (isEnumeration && !isPartial && !isFullyCorrect);
  const enumerationPoolSize = feedback.acceptedAnswers?.length ?? 0;

  const headline = isEnumeration
    ? isFullyCorrect
      ? "Correct!"
      : isPartial
        ? "Almost there!"
        : "Not quite!"
    : earnedPoints
      ? "Correct!"
      : "Not quite!";

  const overlayTone = isFullyCorrect || (earnedPoints && !isPartial)
    ? "border-lime/45 bg-lime/12"
    : isPartial
      ? "border-blue/35 bg-blue/10"
      : "border-pink/35 bg-pink/10";

  return (
    <motion.div
      initial={cardStackOverlayEnter}
      animate={cardStackActive}
      exit={{ opacity: 0, y: 32, scale: 0.98 }}
      transition={cardStackTransition}
      className="absolute inset-x-0 bottom-0 z-30 w-full px-1 sm:px-0"
      style={{ willChange: "transform, opacity" }}
    >
      <motion.div
        animate={showShake ? shakeAnimation : undefined}
        className={cn(
          "relative overflow-hidden rounded-3xl border-[3px] px-5 py-6 shadow-[0_16px_48px_rgba(26,26,46,0.12)] sm:px-8 sm:py-8",
          overlayTone,
        )}
      >
        <QuizConfetti active={showConfetti} />

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.h2
            className="font-display text-3xl font-extrabold text-dark sm:text-4xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitions.fast, delay: 0.05 }}
          >
            {headline}
          </motion.h2>

          {feedback.enumerationSummary && (
            <p className="mt-2 font-body text-base font-semibold text-dark/70">
              {feedback.enumerationSummary}
            </p>
          )}

          {!isEnumeration && !earnedPoints && (
            <p className="mt-2 font-body text-sm font-semibold text-dark/55">
              Good try — here is the answer for next time.
            </p>
          )}

          {isPartial && (
            <p className="mt-2 font-body text-sm font-semibold text-dark/55">
              You are on the right track. Keep going!
            </p>
          )}

          <motion.p
            className={cn(
              "mt-4 font-display text-3xl font-extrabold sm:text-4xl",
              earnedPoints ? "text-pink" : "text-dark/40",
            )}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={transitions.spring}
          >
            {earnedPoints ? `+${feedback.pointsEarned} points` : "0 points earned"}
          </motion.p>

          {!isEnumeration && !earnedPoints && (
            <AnswerList title="Correct answer" answers={[feedback.correctAnswerDisplay]} />
          )}

          {isFullyCorrect && (
            <EnumerationAcceptedAnswersList
              totalAcceptedCount={enumerationPoolSize}
              answers={feedback.otherPossibleAnswers ?? []}
            />
          )}

          {!isFullyCorrect && isPartial && (
            <EnumerationAcceptedAnswersList
              totalAcceptedCount={enumerationPoolSize}
              answers={feedback.exampleAnswers ?? []}
            />
          )}

          {!isFullyCorrect && isEnumeration && !isPartial && (
            <EnumerationAcceptedAnswersList
              totalAcceptedCount={enumerationPoolSize}
              answers={feedback.exampleAnswers ?? []}
            />
          )}

          <div className="mt-6 w-full sm:max-w-xs">
            <Button
              variant={isFullyCorrect || (earnedPoints && !isPartial) ? "primary" : "secondary"}
              size="xl"
              fullWidth
              onClick={onContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
