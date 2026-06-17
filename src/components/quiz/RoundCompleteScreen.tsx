"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { QuestionTypeBadge } from "@/components/quiz/QuestionTypeBadge";
import { QuizConfetti } from "@/components/quiz/QuizConfetti";
import { getQuestionTypeLabel } from "@/lib/quiz/question-labels";
import { transitions } from "@/lib/theme/animations";
import type { QuestionType } from "@/data/quiz/types";
import { cn } from "@/lib/utils/cn";

type NextRoundPreview = {
  number: number;
  title: string;
  description: string;
  questionCount: number;
  questionType: QuestionType;
};

export type RoundCompleteScreenProps = {
  roundNumber: number;
  roundTitle: string;
  roundScore: number;
  correctCount: number;
  totalQuestions: number;
  totalRounds: number;
  questionType: QuestionType;
  isFinalRound: boolean;
  nextRound: NextRoundPreview | null;
  onContinue: () => void;
};

const contentEnter = {
  hidden: { opacity: 0, x: -18 },
  visible: { opacity: 1, x: 0 },
};

const visualEnter = {
  hidden: { opacity: 0, x: 18 },
  visible: { opacity: 1, x: 0 },
};

function getCelebration(correctCount: number, totalQuestions: number) {
  if (correctCount === totalQuestions) {
    return { headline: "Excellent Round!", showConfetti: true };
  }

  if (correctCount >= Math.max(1, totalQuestions - 1)) {
    return { headline: "Great Job!", showConfetti: true };
  }

  return { headline: "Round Complete", showConfetti: false };
}

function useCountUp(target: number, durationMs = 700) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) {
      queueMicrotask(() => setValue(0));
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

function QuizJourneyProgress({
  completedRounds,
  totalRounds,
}: {
  completedRounds: number;
  totalRounds: number;
}) {
  const percent = totalRounds > 0 ? Math.min(100, (completedRounds / totalRounds) * 100) : 0;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between font-display text-xs font-bold uppercase tracking-widest text-dark/50 sm:text-sm">
        <span>Quiz progress</span>
        <span>
          Round {completedRounds} of {totalRounds} completed
        </span>
      </div>
      <div className="h-3.5 overflow-hidden rounded-full border-2 border-dark/12 bg-white/70 shadow-inner sm:h-4">
        <motion.div
          className="h-full w-full origin-left rounded-full bg-gradient-to-r from-pink via-pink/90 to-blue"
          initial={{ scaleX: 0, opacity: 0.85 }}
          animate={{ scaleX: percent / 100, opacity: 1 }}
          transition={{ ...transitions.fast, duration: 0.45, delay: 0.15 }}
          style={{ willChange: "transform, opacity" }}
        />
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  valueClassName,
  delay = 0,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...transitions.fast, delay }}
      className="flex items-center justify-between gap-4 border-b border-dark/8 py-4 last:border-0 last:pb-0 first:pt-0"
    >
      <span className="font-body text-sm font-semibold text-dark/55 sm:text-base">{label}</span>
      <span className={cn("font-display text-xl font-extrabold sm:text-2xl", valueClassName)}>
        {value}
      </span>
    </motion.div>
  );
}

export function RoundCompleteScreen({
  roundNumber,
  roundTitle,
  roundScore,
  correctCount,
  totalQuestions,
  totalRounds,
  questionType,
  isFinalRound,
  nextRound,
  onContinue,
}: RoundCompleteScreenProps) {
  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const { headline, showConfetti } = getCelebration(correctCount, totalQuestions);

  const animatedScore = useCountUp(roundScore, 750);
  const animatedAccuracy = useCountUp(accuracy, 750);
  const animatedCorrect = useCountUp(correctCount, 650);

  const continueLabel = isFinalRound
    ? "See Final Results"
    : nextRound
      ? `Continue to Round ${nextRound.number}`
      : "Continue";

  return (
    <div className="relative mx-auto w-full max-w-[75rem] py-3 sm:py-5">
      {showConfetti && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-48 overflow-hidden">
          <QuizConfetti active />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-10 xl:gap-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentEnter}
          transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 order-1 flex flex-col lg:order-1"
          style={{ willChange: "transform, opacity" }}
        >
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-pink sm:text-sm">
            Round Complete
          </p>

          <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-dark sm:text-4xl lg:text-5xl">
            {headline}
          </h2>

          <p className="mt-2 font-display text-xl font-bold text-dark/75 sm:text-2xl">{roundTitle}</p>

          <p className="mt-3 max-w-xl font-body text-base font-semibold leading-relaxed text-dark/60 sm:text-lg">
            {showConfetti
              ? "You nailed this round. Keep the momentum going."
              : "Every round gets you closer. Ready for what is next?"}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={visualEnter}
          transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1], delay: 0.06 }}
          className="relative z-10 order-2 lg:order-2 lg:row-span-3"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="rounded-3xl border-[3px] border-dark/10 bg-white/90 p-5 shadow-[0_12px_40px_rgba(26,26,46,0.08)] sm:p-7">
            <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-dark/45 sm:text-sm">
              Round Results
            </p>

            <div className="mt-4 sm:mt-5">
              <StatRow
                label="Round Score"
                value={`${animatedScore} pts`}
                valueClassName="text-pink"
                delay={0.08}
              />
              <StatRow
                label="Accuracy"
                value={`${animatedAccuracy}%`}
                valueClassName="text-dark"
                delay={0.14}
              />
              <StatRow
                label="Correct Answers"
                value={`${animatedCorrect} / ${totalQuestions}`}
                valueClassName="text-dark"
                delay={0.2}
              />
            </div>

            <div className="mt-5 rounded-2xl border-2 border-lime/30 bg-lime/10 px-4 py-3 text-center sm:mt-6">
              <p className="font-body text-xs font-semibold uppercase tracking-wide text-dark/50">
                Round {roundNumber} summary
              </p>
              <p className="mt-1 font-display text-sm font-bold text-dark sm:text-base">
                {getQuestionTypeLabel(questionType)} · {totalQuestions} questions played
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentEnter}
          transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1], delay: 0.08 }}
          className="relative z-10 order-3 flex flex-col lg:order-3"
          style={{ willChange: "transform, opacity" }}
        >
          <QuizJourneyProgress completedRounds={roundNumber} totalRounds={totalRounds} />

          {nextRound && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transitions.fast, delay: 0.2 }}
              className="mt-6 rounded-2xl border-2 border-blue/25 bg-blue/8 p-4 sm:mt-7 sm:p-5"
            >
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-dark/45 sm:text-xs">
                Next Round
              </p>
              <p className="mt-1.5 font-display text-lg font-extrabold text-dark sm:text-xl">
                {nextRound.title}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border-2 border-dark/10 bg-white/70 px-2.5 py-1 font-body text-xs font-bold text-dark/65">
                  {nextRound.questionCount} Questions
                </span>
                <QuestionTypeBadge type={nextRound.questionType} />
              </div>
              <p className="mt-3 font-body text-sm font-semibold text-dark/60">
                {nextRound.description}
              </p>
            </motion.div>
          )}

          {isFinalRound && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transitions.fast, delay: 0.2 }}
              className="mt-6 rounded-2xl border-2 border-lime/35 bg-lime/12 p-4 sm:mt-7 sm:p-5"
            >
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-dark/45 sm:text-xs">
                Final Step
              </p>
              <p className="mt-1.5 font-display text-lg font-extrabold text-dark sm:text-xl">
                All rounds finished
              </p>
              <p className="mt-2 font-body text-sm font-semibold text-dark/60">
                See how you performed across the full quiz.
              </p>
            </motion.div>
          )}

          <div className="mt-7 w-full sm:mt-8 sm:max-w-sm lg:max-w-xs">
            <Button variant="primary" size="xl" fullWidth onClick={onContinue}>
              {continueLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
