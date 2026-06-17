"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { QuizProgressBar } from "@/components/quiz/QuizProgressBar";
import { useQuizStore } from "@/store/quiz";
import type { GameMode } from "@/types/quiz";

type QuizTopBarProps = {
  mode: GameMode;
  roundNumber: number;
  roundTitle: string;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  onStartNewQuiz?: () => void;
};

export function QuizTopBar({
  mode,
  roundNumber,
  roundTitle,
  questionNumber,
  totalQuestions,
  score,
  onStartNewQuiz,
}: QuizTopBarProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const phase = useQuizStore((state) => state.phase);
  const showNewQuiz =
    mode === "solo" &&
    onStartNewQuiz &&
    phase !== "idle" &&
    phase !== "setup" &&
    phase !== "game-complete" &&
    phase !== "player-handoff";

  return (
    <>
      <div className="mb-5 space-y-4 sm:mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-dark/45 sm:text-sm">
              Round {roundNumber}
            </p>
            <h1 className="mt-1 font-display text-xl font-extrabold text-dark sm:text-2xl lg:text-3xl">
              {roundTitle}
            </h1>
            <p className="mt-1 font-body text-sm font-semibold text-dark/60 sm:text-base">
              Question {questionNumber} / {totalQuestions}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="rounded-2xl border-2 border-lime/40 bg-lime/15 px-4 py-2 text-center">
              <p className="font-body text-[10px] font-bold uppercase tracking-wide text-dark/45">
                Score
              </p>
              <p className="font-display text-lg font-extrabold text-dark sm:text-xl">{score}</p>
            </div>

            {showNewQuiz && (
              <Button
                variant="outline"
                size="md"
                className="hidden sm:inline-flex"
                onClick={() => setShowConfirm(true)}
              >
                New Quiz
              </Button>
            )}
          </div>
        </div>

        <QuizProgressBar current={questionNumber} total={totalQuestions} />

        {showNewQuiz && (
          <Button
            variant="outline"
            size="md"
            fullWidth
            className="sm:hidden"
            onClick={() => setShowConfirm(true)}
          >
            Start New Quiz
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Start a new quiz?"
        description="Your current progress will be lost."
        confirmLabel="Start New Quiz"
        cancelLabel="Cancel"
        confirmVariant="primary"
        onConfirm={() => {
          setShowConfirm(false);
          onStartNewQuiz?.();
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
