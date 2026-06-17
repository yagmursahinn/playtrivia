"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useQuizStore } from "@/store/quiz";

type QuizPlayToolbarProps = {
  mode: "solo" | "multiplayer";
  onStartNewQuiz: () => void;
};

export function QuizPlayToolbar({ mode, onStartNewQuiz }: QuizPlayToolbarProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const phase = useQuizStore((state) => state.phase);
  const currentRoundIndex = useQuizStore((state) => state.currentRoundIndex);
  const currentQuestionIndex = useQuizStore((state) => state.currentQuestionIndex);
  const activePlayerIndex = useQuizStore((state) => state.activePlayerIndex);
  const players = useQuizStore((state) => state.players);

  const activePlayer = players[activePlayerIndex];
  const score = activePlayer?.totalScore ?? 0;

  if (mode !== "solo") {
    return null;
  }

  if (
    phase === "idle" ||
    phase === "setup" ||
    phase === "game-complete" ||
    phase === "player-handoff"
  ) {
    return null;
  }

  const handleConfirm = () => {
    setShowConfirm(false);
    onStartNewQuiz();
  };

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border-2 border-dark/10 bg-white/70 px-4 py-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-left">
          <p className="font-body text-xs font-bold uppercase tracking-wide text-dark/45">
            Saved progress
          </p>
          <p className="mt-1 font-display text-base font-bold text-dark sm:text-lg">
            Round {currentRoundIndex + 1} · Question {currentQuestionIndex + 1} · {score} pts
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          className="shrink-0 sm:min-w-[9.5rem]"
          onClick={() => setShowConfirm(true)}
        >
          Start New Quiz
        </Button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Start a new quiz?"
        description="Your current progress will be lost."
        confirmLabel="Start New Quiz"
        cancelLabel="Cancel"
        confirmVariant="primary"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
