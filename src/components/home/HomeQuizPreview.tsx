"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MultipleChoiceAnswer } from "@/components/quiz/answers/MultipleChoiceAnswer";
import { QuestionTypeBadge } from "@/components/quiz/QuestionTypeBadge";
import { QuizConfetti } from "@/components/quiz/QuizConfetti";
import { QuizProgressBar } from "@/components/quiz/QuizProgressBar";
import {
  HOME_PREVIEW_QUESTIONS,
  HOME_PREVIEW_ROUND,
} from "@/lib/constants/home-preview-questions";
import {
  cardStackActive,
  cardStackEnter,
  cardStackExitUp,
  cardStackOverlayEnter,
  cardStackTransition,
  transitions,
} from "@/lib/theme/animations";
import { cn } from "@/lib/utils/cn";

type PreviewPhase = "question" | "selecting" | "feedback";

const QUESTION_HOLD_MS = 1200;
const SELECT_ANIMATION_MS = 700;
const FEEDBACK_HOLD_MS = 2200;

export function HomeQuizPreview() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<PreviewPhase>("question");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const question = HOME_PREVIEW_QUESTIONS[questionIndex]!;
  const questionNumber = (questionIndex % HOME_PREVIEW_ROUND.totalQuestions) + 1;
  const showFeedback = phase === "feedback";
  const stackKey = `${question.id}-${questionIndex}`;

  useEffect(() => {
    if (phase === "question") {
      const timer = window.setTimeout(() => setPhase("selecting"), QUESTION_HOLD_MS);
      return () => window.clearTimeout(timer);
    }

    if (phase === "selecting") {
      const selectTimer = window.setTimeout(() => {
        setSelectedOption(question.correctAnswer);
      }, 0);
      const timer = window.setTimeout(() => {
        setScore((current) => current + question.points);
        setPhase("feedback");
      }, SELECT_ANIMATION_MS);
      return () => {
        window.clearTimeout(selectTimer);
        window.clearTimeout(timer);
      };
    }

    if (phase === "feedback") {
      const timer = window.setTimeout(() => {
        setSelectedOption(null);
        setPhase("question");
        setQuestionIndex((current) => (current + 1) % HOME_PREVIEW_QUESTIONS.length);
      }, FEEDBACK_HOLD_MS);
      return () => window.clearTimeout(timer);
    }
  }, [phase, question.correctAnswer, question.points]);

  return (
    <div
      aria-hidden
      className="pointer-events-none w-full select-none"
    >
      <div className="mb-4 space-y-3 sm:mb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 text-left">
            <p className="font-display text-[10px] font-bold uppercase tracking-widest text-dark/45 sm:text-xs">
              Round {HOME_PREVIEW_ROUND.roundNumber}
            </p>
            <p className="mt-0.5 font-display text-base font-extrabold text-dark sm:text-lg">
              {HOME_PREVIEW_ROUND.roundTitle}
            </p>
            <p className="mt-0.5 font-body text-xs font-semibold text-dark/55 sm:text-sm">
              Question {questionNumber} / {HOME_PREVIEW_ROUND.totalQuestions}
            </p>
          </div>

          <motion.div
            key={score}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={transitions.spring}
            className="rounded-xl border-2 border-lime/40 bg-lime/15 px-3 py-1.5 text-center"
          >
            <p className="font-body text-[9px] font-bold uppercase tracking-wide text-dark/45">
              Score
            </p>
            <p className="font-display text-base font-extrabold text-dark sm:text-lg">{score}</p>
          </motion.div>
        </div>

        <QuizProgressBar current={questionNumber} total={HOME_PREVIEW_ROUND.totalQuestions} />
      </div>

      <div className="relative min-h-[300px] sm:min-h-[340px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={stackKey}
            initial={cardStackEnter}
            animate={showFeedback ? cardStackExitUp : cardStackActive}
            exit={cardStackExitUp}
            transition={cardStackTransition}
            className="relative z-10 w-full"
            style={{ willChange: "transform, opacity" }}
          >
            <div
              className={cn(
                "rounded-3xl border-[3px] border-dark/10 bg-white/90 p-4 shadow-[0_12px_40px_rgba(26,26,46,0.08)] sm:p-6",
                showFeedback && "opacity-60",
              )}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
                <QuestionTypeBadge type="multiple-choice" />
                <span className="rounded-full border-2 border-pink/30 bg-pink/10 px-2.5 py-0.5 font-display text-[10px] font-bold text-pink sm:text-xs">
                  10 pts
                </span>
              </div>

              <h3 className="text-left font-display text-base font-bold leading-snug text-dark sm:text-lg">
                {question.text}
              </h3>

              <div className="mt-4 sm:mt-5">
                <MultipleChoiceAnswer
                  options={question.options}
                  selected={selectedOption}
                  onSelect={() => undefined}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              key={`feedback-${stackKey}`}
              initial={cardStackOverlayEnter}
              animate={cardStackActive}
              exit={{ opacity: 0, y: 32, scale: 0.98 }}
              transition={cardStackTransition}
              className="absolute inset-x-0 bottom-0 z-30 w-full"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative overflow-hidden rounded-3xl border-[3px] border-lime/45 bg-lime/12 px-5 py-5 shadow-[0_16px_48px_rgba(26,26,46,0.12)] sm:px-7 sm:py-6">
                <QuizConfetti active />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <motion.h4
                    className="font-display text-2xl font-extrabold text-dark sm:text-3xl"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...transitions.fast, delay: 0.05 }}
                  >
                    Correct!
                  </motion.h4>

                  <motion.p
                    className="mt-3 font-display text-2xl font-extrabold text-pink sm:text-3xl"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={transitions.spring}
                  >
                    +{question.points} points
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
