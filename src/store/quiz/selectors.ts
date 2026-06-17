import { findQuestionPositionById, getCurrentQuestionFromQuizData } from "./helpers";
import type { QuizStore } from "./types";

export const selectSessionMeta = (state: QuizStore) => ({
  sessionId: state.sessionId,
  mode: state.mode,
  categoryId: state.categoryId,
  phase: state.phase,
  startedAt: state.startedAt,
  completedAt: state.completedAt,
});

export const selectPlayers = (state: QuizStore) => state.players;

export const selectActivePlayer = (state: QuizStore) =>
  state.players[state.activePlayerIndex] ?? null;

export const selectSortedPlayers = (state: QuizStore) =>
  [...state.players].sort((a, b) => b.totalScore - a.totalScore);

export const selectCurrentRound = (state: QuizStore) =>
  state.rounds[state.currentRoundIndex] ?? null;

export const selectCurrentQuestion = (state: QuizStore) =>
  (() => {
    const pos = findQuestionPositionById(state.quizData, state.currentQuestionId);
    if (pos) {
      return getCurrentQuestionFromQuizData(state.quizData, pos.roundIndex, pos.questionIndex);
    }
    return getCurrentQuestionFromQuizData(
      state.quizData,
      state.currentRoundIndex,
      state.currentQuestionIndex,
    );
  })();

export const selectRoundProgress = (state: QuizStore) => {
  const round = state.rounds[state.currentRoundIndex];
  if (!round) return null;

  return {
    roundNumber: round.number,
    roundTitle: round.title,
    roundDescription: round.description,
    questionNumber: state.currentQuestionIndex + 1,
    totalQuestions: round.questionCount,
    totalRounds: state.rounds.length,
  };
};

export const selectLastFeedback = (state: QuizStore) => state.lastFeedback;

export const selectIsRoundIntro = (state: QuizStore) => state.phase === "round-intro";

export const selectIsQuestion = (state: QuizStore) => state.phase === "question";

export const selectIsFeedback = (state: QuizStore) => state.phase === "feedback";

export const selectIsRoundComplete = (state: QuizStore) => state.phase === "round-complete";

export const selectIsPlayerHandoff = (state: QuizStore) => state.phase === "player-handoff";

export const selectIsGameComplete = (state: QuizStore) => state.phase === "game-complete";

export const selectNextHandoffPlayer = (state: QuizStore) =>
  state.players[state.activePlayerIndex] ?? null;

export const selectRoundStats = (state: QuizStore) => {
  const round = state.rounds[state.currentRoundIndex];
  const player = state.players[state.activePlayerIndex];
  if (!round || !player) return null;

  const roundAnswers = state.answerHistory.filter(
    (answer) => answer.playerId === player.id && answer.roundId === round.id,
  );

  return {
    roundTitle: round.title,
    roundScore: player.roundScores[round.id] ?? 0,
    correctCount: roundAnswers.filter((answer) => answer.pointsAwarded > 0).length,
    totalQuestions: round.questionCount,
  };
};

export const selectFinalStats = (state: QuizStore) => {
  const player = state.players[state.activePlayerIndex];
  if (!player) return null;

  const totalQuestions = state.answerHistory.filter(
    (answer) => answer.playerId === player.id,
  ).length;

  return {
    totalScore: player.totalScore,
    correctAnswers: player.answersCorrect,
    totalQuestions: player.answersTotal,
    accuracy:
      player.answersTotal === 0
        ? 0
        : Math.round((player.answersCorrect / player.answersTotal) * 100),
  };
};

export const selectAllPlayersFinalStats = (state: QuizStore) =>
  state.players.map((player) => ({
    id: player.id,
    name: player.name,
    totalScore: player.totalScore,
    correctAnswers: player.answersCorrect,
    totalQuestions: player.answersTotal,
    accuracy:
      player.answersTotal === 0
        ? 0
        : Math.round((player.answersCorrect / player.answersTotal) * 100),
  }));

export const selectWinner = (state: QuizStore) => selectSortedPlayers(state)[0] ?? null;

export const selectLeaderboardReady = (state: QuizStore) =>
  state.phase === "game-complete" && state.completedAt !== null;

export const selectTotalRounds = (state: QuizStore) => state.rounds.length;
