"use client";

import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { ROUND_META } from "@/data/quiz/rounds";
import { findQuestionPositionById, getCurrentQuestionFromQuizData } from "@/store/quiz/helpers";
import { useQuizStore } from "@/store/quiz";

export function useQuiz() {
  return useQuizStore();
}

export function useQuizSetup() {
  return useQuizStore(
    useShallow((state) => ({
      phase: state.phase,
      mode: state.mode,
      categoryId: state.categoryId,
      initSolo: state.initSolo,
      initMultiplayer: state.initMultiplayer,
      resetQuiz: state.resetQuiz,
    })),
  );
}

export function useQuizGame() {
  const phase = useQuizStore((state) => state.phase);
  const mode = useQuizStore((state) => state.mode);
  const sessionId = useQuizStore((state) => state.sessionId);
  const categoryId = useQuizStore((state) => state.categoryId);
  const startedAt = useQuizStore((state) => state.startedAt);
  const completedAt = useQuizStore((state) => state.completedAt);
  const currentRoundIndex = useQuizStore((state) => state.currentRoundIndex);
  const currentQuestionIndex = useQuizStore((state) => state.currentQuestionIndex);
  const currentQuestionId = useQuizStore((state) => state.currentQuestionId);
  const rounds = useQuizStore((state) => state.rounds);
  const quizData = useQuizStore((state) => state.quizData);
  const players = useQuizStore((state) => state.players);
  const activePlayerIndex = useQuizStore((state) => state.activePlayerIndex);
  const feedback = useQuizStore((state) => state.lastFeedback);
  const answerHistory = useQuizStore((state) => state.answerHistory);

  const startGame = useQuizStore((state) => state.startGame);
  const startRound = useQuizStore((state) => state.startRound);
  const submitQuestionAnswer = useQuizStore((state) => state.submitQuestionAnswer);
  const continueFromFeedback = useQuizStore((state) => state.continueFromFeedback);
  const continueFromRoundComplete = useQuizStore((state) => state.continueFromRoundComplete);
  const continueFromPlayerHandoff = useQuizStore((state) => state.continueFromPlayerHandoff);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  const session = useMemo(
    () => ({
      sessionId,
      mode,
      categoryId,
      phase,
      startedAt,
      completedAt,
    }),
    [sessionId, mode, categoryId, phase, startedAt, completedAt],
  );

  const currentRound = rounds[currentRoundIndex] ?? null;
  const activePlayer = players[activePlayerIndex] ?? null;
  const handoffPlayer = players[activePlayerIndex] ?? null;

  const currentQuestion = useMemo(
    () => {
      const position = findQuestionPositionById(quizData, currentQuestionId);
      if (position) {
        return getCurrentQuestionFromQuizData(quizData, position.roundIndex, position.questionIndex);
      }
      return getCurrentQuestionFromQuizData(quizData, currentRoundIndex, currentQuestionIndex);
    },
    [quizData, currentQuestionId, currentRoundIndex, currentQuestionIndex],
  );

  const progress = useMemo(() => {
    if (!currentRound) return null;

    return {
      roundNumber: currentRound.number,
      roundTitle: currentRound.title,
      roundDescription: currentRound.description,
      questionNumber: currentQuestionIndex + 1,
      totalQuestions: currentRound.questionCount,
      totalRounds: rounds.length,
    };
  }, [currentRound, currentQuestionIndex, rounds.length]);

  const roundStats = useMemo(() => {
    if (!currentRound || !activePlayer) return null;

    const roundAnswers = answerHistory.filter(
      (answer) =>
        answer.playerId === activePlayer.id && answer.roundId === currentRound.id,
    );

    const currentRoundMeta = ROUND_META.find((round) => round.id === currentRound.id);
    const nextRoundState = rounds[currentRoundIndex + 1] ?? null;
    const nextRoundMeta = nextRoundState
      ? ROUND_META.find((round) => round.id === nextRoundState.id)
      : null;

    return {
      roundNumber: currentRound.number,
      roundTitle: currentRound.title,
      roundScore: activePlayer.roundScores[currentRound.id] ?? 0,
      correctCount: roundAnswers.filter((answer) => answer.pointsAwarded > 0).length,
      totalQuestions: currentRound.questionCount,
      totalRounds: rounds.length,
      questionType: currentRoundMeta?.questionType ?? "multiple-choice",
      isFinalRound: currentRoundIndex >= rounds.length - 1,
      nextRound: nextRoundState
        ? {
            number: nextRoundState.number,
            title: nextRoundState.title,
            description: nextRoundState.description,
            questionCount: nextRoundState.questionCount,
            questionType: nextRoundMeta?.questionType ?? "multiple-choice",
          }
        : null,
    };
  }, [currentRound, activePlayer, answerHistory, currentRoundIndex, rounds]);

  return {
    phase,
    mode,
    session,
    currentRound,
    currentQuestion,
    progress,
    feedback,
    activePlayer,
    handoffPlayer,
    roundStats,
    totalRounds: rounds.length,
    rounds,
    answerHistory,
    isRoundIntro: phase === "round-intro",
    isQuestion: phase === "question",
    isFeedback: phase === "feedback",
    isRoundComplete: phase === "round-complete",
    isPlayerHandoff: phase === "player-handoff",
    isGameComplete: phase === "game-complete",
    startGame,
    startRound,
    submitQuestionAnswer,
    continueFromFeedback,
    continueFromRoundComplete,
    continueFromPlayerHandoff,
    resetQuiz,
  };
}

export function useQuizScores() {
  const players = useQuizStore((state) => state.players);
  const phase = useQuizStore((state) => state.phase);
  const completedAt = useQuizStore((state) => state.completedAt);
  const getLeaderboardPayload = useQuizStore((state) => state.getLeaderboardPayload);

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.totalScore - a.totalScore),
    [players],
  );

  const allPlayersStats = useMemo(
    () =>
      players.map((player) => ({
        id: player.id,
        name: player.name,
        totalScore: player.totalScore,
        correctAnswers: player.answersCorrect,
        totalQuestions: player.answersTotal,
        accuracy:
          player.answersTotal === 0
            ? 0
            : Math.round((player.answersCorrect / player.answersTotal) * 100),
      })),
    [players],
  );

  return {
    players,
    sortedPlayers,
    winner: sortedPlayers[0] ?? null,
    allPlayersStats,
    isLeaderboardReady: phase === "game-complete" && completedAt !== null,
    getLeaderboardPayload,
  };
}

export { useQuizPlayInit } from "./use-quiz-play-init";
export { useQuizStoreHydrated } from "./use-quiz-store-hydrated";
