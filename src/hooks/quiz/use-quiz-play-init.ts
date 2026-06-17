"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { buildQuizData } from "@/data/quiz";
import { getLocalDateKey } from "@/lib/retention/date";
import {
  getSavedProgressConflict,
  hasRestorableProgress,
  type SavedProgressSummary,
} from "@/lib/quiz/progress-storage";
import { startNewQuiz as startNewQuizSession } from "@/lib/quiz/start-new-quiz";
import { findQuestionPositionById, getCurrentQuestionFromQuizData } from "@/store/quiz/helpers";
import { useQuizStoreHydrated } from "@/hooks/quiz/use-quiz-store-hydrated";
import { useQuizStore } from "@/store/quiz";
import type { GameMode } from "@/types/quiz";

type UseQuizPlayInitOptions = {
  categoryId: string;
  categorySlug: string;
  mode: GameMode;
  isDailyChallenge?: boolean;
};

type UseQuizPlayInitResult = {
  isReady: boolean;
  needsMultiplayerSetup: boolean;
  pendingOverwrite: boolean;
  savedProgressConflict: SavedProgressSummary | null;
  confirmOverwrite: () => void;
  cancelOverwrite: () => void;
  restartQuiz: () => void;
  startNewQuiz: () => void;
  sessionId: string | null;
};

export function useQuizPlayInit({
  categoryId,
  categorySlug,
  mode,
  isDailyChallenge = false,
}: UseQuizPlayInitOptions): UseQuizPlayInitResult {
  const hydrated = useQuizStoreHydrated();
  const phase = useQuizStore((state) => state.phase);
  const sessionId = useQuizStore((state) => state.sessionId);
  const storeMode = useQuizStore((state) => state.mode);
  const storeCategoryId = useQuizStore((state) => state.categoryId);
  const sessionType = useQuizStore((state) => state.sessionType);
  const dailyChallengeDate = useQuizStore((state) => state.dailyChallengeDate);
  const players = useQuizStore((state) => state.players);
  const initSolo = useQuizStore((state) => state.initSolo);
  const initDailyChallenge = useQuizStore((state) => state.initDailyChallenge);
  const startGame = useQuizStore((state) => state.startGame);

  const hydrationHandledRef = useRef(false);
  const [overwriteConfirmed, setOverwriteConfirmed] = useState(false);
  const todayKey = getLocalDateKey();

  const progressTarget = useMemo(
    () => ({
      categoryId,
      mode,
      sessionType: isDailyChallenge ? ("daily" as const) : ("standard" as const),
      dailyChallengeDate: isDailyChallenge ? todayKey : null,
    }),
    [categoryId, mode, isDailyChallenge, todayKey],
  );

  const confirmOverwrite = useCallback(() => {
    setOverwriteConfirmed(true);
  }, []);

  const cancelOverwrite = useCallback(() => {
    setOverwriteConfirmed(false);
  }, []);

  const restartQuiz = () => {
    if (mode !== "solo") return;
    if (isDailyChallenge) {
      useQuizStore.getState().initDailyChallenge(todayKey);
      useQuizStore.getState().startGame();
      return;
    }
    startNewQuizSession(categoryId, mode);
  };

  const startNewQuiz = () => {
    restartQuiz();
  };

  const needsMultiplayerSetup =
    mode === "multiplayer" && (players.length === 0 || storeMode !== "multiplayer");

  const needsInit = useMemo(() => {
    if (!hydrated || needsMultiplayerSetup) return false;

    if (mode === "multiplayer") {
      return phase === "setup";
    }

    return isDailyChallenge
      ? phase === "idle" ||
          phase === "setup" ||
          storeMode !== "solo" ||
          storeCategoryId !== categoryId ||
          sessionType !== "daily" ||
          dailyChallengeDate !== todayKey
      : phase === "idle" ||
          phase === "setup" ||
          storeMode !== "solo" ||
          storeCategoryId !== categoryId ||
          sessionType === "daily";
  }, [
    hydrated,
    needsMultiplayerSetup,
    mode,
    phase,
    isDailyChallenge,
    storeMode,
    storeCategoryId,
    sessionType,
    dailyChallengeDate,
    todayKey,
    categoryId,
  ]);

  const savedProgressConflict = useMemo((): SavedProgressSummary | null => {
    if (!needsInit || overwriteConfirmed) {
      return null;
    }

    return getSavedProgressConflict(progressTarget);
  }, [needsInit, progressTarget, overwriteConfirmed]);

  const pendingOverwrite = savedProgressConflict !== null;

  useLayoutEffect(() => {
    if (!hydrated) return;

    if (isDailyChallenge && mode !== "solo") {
      return;
    }

    if (mode === "multiplayer") {
      if (players.length === 0 || storeMode !== "multiplayer") {
        return;
      }

      if (!hydrationHandledRef.current) {
        hydrationHandledRef.current = true;

        const state = useQuizStore.getState();
        if (hasRestorableProgress(state, categoryId, mode)) {
          const quizData = state.quizData ?? buildQuizData(categoryId);
          const byId = findQuestionPositionById(quizData, state.currentQuestionId);
          const fallbackQuestion = getCurrentQuestionFromQuizData(
            quizData,
            state.currentRoundIndex,
            state.currentQuestionIndex,
          );
          useQuizStore.setState({
            quizData,
            questionOrder: quizData.rounds.map((round) => round.questions.map((q) => q.id)),
            currentRoundIndex: byId?.roundIndex ?? state.currentRoundIndex,
            currentQuestionIndex: byId?.questionIndex ?? state.currentQuestionIndex,
            currentQuestionId:
              (byId
                ? getCurrentQuestionFromQuizData(quizData, byId.roundIndex, byId.questionIndex)?.id
                : fallbackQuestion?.id) ?? null,
          });
          return;
        }
      }

      if (phase === "setup") {
        startGame();
      }

      return;
    }

    if (!hydrationHandledRef.current) {
      hydrationHandledRef.current = true;

      const state = useQuizStore.getState();
      const restoreOptions = isDailyChallenge
        ? { sessionType: "daily" as const, dailyChallengeDate: todayKey }
        : { sessionType: "standard" as const };

      if (hasRestorableProgress(state, categoryId, mode, restoreOptions)) {
        const quizData =
          state.quizData ?? (isDailyChallenge ? state.quizData : buildQuizData(categoryId));
        if (!quizData) return;

        const byId = findQuestionPositionById(quizData, state.currentQuestionId);
        const fallbackQuestion = getCurrentQuestionFromQuizData(
          quizData,
          state.currentRoundIndex,
          state.currentQuestionIndex,
        );
        useQuizStore.setState({
          quizData,
          questionOrder: quizData.rounds.map((round) => round.questions.map((q) => q.id)),
          currentRoundIndex: byId?.roundIndex ?? state.currentRoundIndex,
          currentQuestionIndex: byId?.questionIndex ?? state.currentQuestionIndex,
          currentQuestionId:
            (byId
              ? getCurrentQuestionFromQuizData(quizData, byId.roundIndex, byId.questionIndex)?.id
              : fallbackQuestion?.id) ?? null,
        });
        return;
      }
    }

    if (needsInit) {
      if (savedProgressConflict) {
        return;
      }

      if (isDailyChallenge) {
        initDailyChallenge(todayKey);
      } else {
        buildQuizData(categoryId);
        initSolo(categoryId);
      }
      startGame();
    }
  }, [
    hydrated,
    categoryId,
    categorySlug,
    mode,
    phase,
    storeMode,
    storeCategoryId,
    sessionType,
    dailyChallengeDate,
    players.length,
    initSolo,
    initDailyChallenge,
    startGame,
    isDailyChallenge,
    todayKey,
    needsInit,
    savedProgressConflict,
    needsMultiplayerSetup,
  ]);

  const isReady =
    hydrated &&
    !pendingOverwrite &&
    !needsMultiplayerSetup &&
    phase !== "idle" &&
    phase !== "setup" &&
    storeCategoryId === categoryId &&
    storeMode === mode &&
    (isDailyChallenge
      ? sessionType === "daily" && dailyChallengeDate === todayKey
      : sessionType !== "daily");

  return {
    isReady,
    needsMultiplayerSetup,
    pendingOverwrite,
    savedProgressConflict,
    confirmOverwrite,
    cancelOverwrite,
    restartQuiz,
    startNewQuiz,
    sessionId,
  };
}
