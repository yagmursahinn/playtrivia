"use client";

import { useMemo } from "react";
import {
  getSavedProgressSummary,
  isInProgressSavedPhase,
  type SavedProgressSummary,
} from "@/lib/quiz/progress-storage";
import { useQuizStoreHydrated } from "@/hooks/quiz/use-quiz-store-hydrated";
import { useQuizStore } from "@/store/quiz";
import type { Player } from "@/types/quiz";

function summaryFromStore(state: {
  categoryId: string | null;
  mode: SavedProgressSummary["mode"] | null;
  phase: SavedProgressSummary["phase"];
  sessionType: SavedProgressSummary["sessionType"];
  dailyChallengeDate: string | null;
  currentRoundIndex: number;
  currentQuestionIndex: number;
  players: Player[];
  activePlayerIndex: number;
}): SavedProgressSummary | null {
  if (!state.categoryId || !state.mode || !isInProgressSavedPhase(state.phase)) {
    return null;
  }

  const activePlayer = state.players[state.activePlayerIndex];

  return {
    categoryId: state.categoryId,
    mode: state.mode,
    phase: state.phase,
    sessionType: state.sessionType,
    dailyChallengeDate: state.dailyChallengeDate,
    currentRound: state.currentRoundIndex + 1,
    currentQuestion: state.currentQuestionIndex + 1,
    score: activePlayer?.totalScore ?? 0,
  };
}

export function useSavedQuizProgress(): SavedProgressSummary | null {
  const hydrated = useQuizStoreHydrated();
  const categoryId = useQuizStore((state) => state.categoryId);
  const mode = useQuizStore((state) => state.mode);
  const phase = useQuizStore((state) => state.phase);
  const sessionType = useQuizStore((state) => state.sessionType);
  const dailyChallengeDate = useQuizStore((state) => state.dailyChallengeDate);
  const currentRoundIndex = useQuizStore((state) => state.currentRoundIndex);
  const currentQuestionIndex = useQuizStore((state) => state.currentQuestionIndex);
  const players = useQuizStore((state) => state.players);
  const activePlayerIndex = useQuizStore((state) => state.activePlayerIndex);

  return useMemo(() => {
    if (!hydrated) {
      return null;
    }

    const fromStore = summaryFromStore({
      categoryId,
      mode,
      phase,
      sessionType,
      dailyChallengeDate,
      currentRoundIndex,
      currentQuestionIndex,
      players,
      activePlayerIndex,
    });
    if (fromStore) return fromStore;

    const saved = getSavedProgressSummary();
    if (saved && isInProgressSavedPhase(saved.phase)) {
      return saved;
    }

    return null;
  }, [
    hydrated,
    categoryId,
    mode,
    phase,
    sessionType,
    dailyChallengeDate,
    currentRoundIndex,
    currentQuestionIndex,
    players,
    activePlayerIndex,
  ]);
}
