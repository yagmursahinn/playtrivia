"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  cardStackActive,
  cardStackEnter,
  cardStackExitUp,
  cardStackTransition,
} from "@/lib/theme/animations";
import type { FeedbackState } from "@/types/quiz";
import type { QuizQuestion } from "@/data/quiz/types";
import { FeedbackOverlay } from "./FeedbackOverlay";
import { QuestionCard } from "./QuestionCard";
import { QuizTopBar } from "./QuizTopBar";
import type { GameMode } from "@/types/quiz";

type QuizChallengeStackProps = {
  mode: GameMode;
  roundNumber: number;
  roundTitle: string;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  question: QuizQuestion;
  feedback: FeedbackState | null;
  isFeedback: boolean;
  onSubmit: (answer: string | string[]) => void;
  onContinue: () => void;
  onStartNewQuiz?: () => void;
};

export function QuizChallengeStack({
  mode,
  roundNumber,
  roundTitle,
  questionNumber,
  totalQuestions,
  score,
  question,
  feedback,
  isFeedback,
  onSubmit,
  onContinue,
  onStartNewQuiz,
}: QuizChallengeStackProps) {
  const stackKey = `${question.id}-${questionNumber}`;
  const showFeedback = isFeedback && feedback;

  return (
    <div className="w-full">
      <QuizTopBar
        mode={mode}
        roundNumber={roundNumber}
        roundTitle={roundTitle}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        score={score}
        onStartNewQuiz={onStartNewQuiz}
      />

      <div className="relative min-h-[min(58vh,680px)] pb-4 sm:min-h-[520px] sm:pb-8">
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
            <QuestionCard
              question={question}
              frozen={Boolean(showFeedback)}
              onSubmit={onSubmit}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showFeedback && feedback && (
            <FeedbackOverlay
              key={`feedback-${stackKey}`}
              feedback={feedback}
              onContinue={onContinue}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
