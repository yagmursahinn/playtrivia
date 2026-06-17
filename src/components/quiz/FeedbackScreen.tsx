"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { fadeInUp, scaleIn, transitions } from "@/lib/theme/animations";
import type { FeedbackState } from "@/types/quiz";
import { cn } from "@/lib/utils/cn";

type FeedbackScreenProps = {
  feedback: FeedbackState;
  onContinue: () => void;
};

function AnswerList({
  title,
  answers,
}: {
  title: string;
  answers: string[];
}) {
  if (answers.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...transitions.fast, delay: 0.12 }}
      className="mt-5 w-full rounded-2xl border-2 border-dark/10 bg-white/70 px-5 py-4 text-left"
    >
      <p className="font-body text-sm font-semibold text-dark/50">{title}</p>
      <p className="mt-2 font-display text-base font-bold leading-relaxed text-dark">
        {answers.join(", ")}
      </p>
    </motion.div>
  );
}

export function FeedbackScreen({ feedback, onContinue }: FeedbackScreenProps) {
  const isEnumeration = feedback.enumerationRequiredCount !== undefined;
  const isFullyCorrect = Boolean(feedback.isFullyCorrect);
  const isPartial = Boolean(feedback.isPartial);
  const earnedPoints = feedback.pointsEarned > 0;

  const headline = isEnumeration
    ? isFullyCorrect
      ? "Correct!"
      : isPartial
        ? "Almost there!"
        : "Not quite!"
    : earnedPoints
      ? "Correct!"
      : "Not quite!";

  const supportiveMessage = !isEnumeration && !earnedPoints
    ? "Good try — here is the answer for next time."
    : isPartial
      ? "You are on the right track. Keep going!"
      : isFullyCorrect
        ? "Nice work!"
        : isEnumeration && !earnedPoints
          ? "No worries — here are some examples to help."
          : null;

  const iconStyles = isFullyCorrect
    ? "border-lime bg-lime/25 text-dark"
    : isPartial
      ? "border-blue/35 bg-blue/15 text-dark"
      : earnedPoints && !isEnumeration
        ? "border-lime bg-lime/25 text-dark"
        : "border-dark/15 bg-white/80 text-dark/70";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={transitions.fast}
      className="mx-auto flex max-w-md flex-col items-center px-1 pb-6 text-center sm:px-0"
    >
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={{ ...transitions.spring, delay: 0.04 }}
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-3xl border-[3px]",
          iconStyles,
        )}
      >
        <motion.span
          className="font-display text-3xl font-extrabold"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={transitions.spring}
        >
          {isFullyCorrect || earnedPoints ? "+" : "–"}
        </motion.span>
      </motion.div>

      <motion.h2
        className="mt-6 font-display text-3xl font-extrabold text-dark sm:text-4xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transitions.fast, delay: 0.06 }}
      >
        {headline}
      </motion.h2>

      {supportiveMessage && (
        <motion.p
          className="mt-2 font-body text-sm font-semibold text-dark/55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transitions.fast, delay: 0.08 }}
        >
          {supportiveMessage}
        </motion.p>
      )}

      {feedback.enumerationSummary && (
        <motion.p
          className="mt-3 font-body text-base font-semibold text-dark/70"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.fast, delay: 0.1 }}
        >
          {feedback.enumerationSummary}
        </motion.p>
      )}

      <motion.p
        className={cn(
          "mt-4 font-display text-3xl font-extrabold sm:text-4xl",
          earnedPoints ? "text-pink" : "text-dark/40",
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...transitions.spring, delay: 0.12 }}
      >
        {earnedPoints ? `+${feedback.pointsEarned} points` : "0 points earned"}
      </motion.p>

      {!isEnumeration && !earnedPoints && (
        <AnswerList title="Correct answer" answers={[feedback.correctAnswerDisplay]} />
      )}

      {isFullyCorrect && (
        <AnswerList
          title="Other possible answers"
          answers={feedback.otherPossibleAnswers ?? []}
        />
      )}

      {!isFullyCorrect && isPartial && (
        <AnswerList
          title="Examples of accepted answers"
          answers={feedback.exampleAnswers ?? []}
        />
      )}

      {!isFullyCorrect && isEnumeration && !isPartial && (
        <AnswerList
          title="Examples of accepted answers"
          answers={feedback.exampleAnswers ?? []}
        />
      )}

      <motion.div
        className="mt-8 w-full sm:w-auto"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transitions.fast, delay: 0.16 }}
      >
        <Button
          variant={isFullyCorrect || (earnedPoints && !isPartial) ? "primary" : "secondary"}
          size="xl"
          fullWidth
          onClick={onContinue}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}
