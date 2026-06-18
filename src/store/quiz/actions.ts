import {
  trackDailyChallengeStarted,
  trackMultiplayerStarted,
  trackQuizCompleted,
  trackQuizStarted,
  trackRoundCompleted,
} from "@/lib/analytics";
import { CATEGORIES } from "@/lib/constants/categories";
import { buildDailyChallengeData } from "@/lib/retention/daily-challenge";
import { getLocalDateKey } from "@/lib/retention/date";
import { getKnowledgeRank } from "@/lib/retention/rank";
import { buildQuizData, invalidateQuizDataCache } from "@/data/quiz";
import type { QuizQuestion } from "@/data/quiz/types";
import { clearQuizProgressStorage } from "@/lib/quiz/progress-storage";
import { validateAnswer } from "@/lib/quiz/validate-answer";
import type {
  AnswerRecord,
  GameMode,
  LeaderboardEntry,
  Player,
  RoundState,
} from "@/types/quiz";
import {
  createAnswerId,
  createInitialRoundsFromQuizData,
  createPlayer,
  createSessionId,
  getCurrentQuestionFromQuizData,
  findQuestionPositionById,
  getNextPlayerIndex,
} from "./helpers";
import type { QuizStore } from "./types";
import { initialQuizState } from "./types";

function getCategoryLabel(categoryId: string | null): string | null {
  if (!categoryId) return null;
  return CATEGORIES.find((category) => category.id === categoryId)?.label ?? null;
}

function getActivePlayer(state: QuizStore): Player | undefined {
  return state.players[state.activePlayerIndex];
}

function getCurrentRound(state: QuizStore): RoundState | undefined {
  return state.rounds[state.currentRoundIndex];
}

function updatePlayerInList(players: Player[], updated: Player): Player[] {
  return players.map((player) => (player.id === updated.id ? updated : player));
}

function resetRoundsForPlayer(categoryId: string): RoundState[] {
  const quizData = buildQuizData(categoryId);
  return createInitialRoundsFromQuizData(quizData);
}

function buildLeaderboardPayload(state: QuizStore): LeaderboardEntry[] {
  if (!state.sessionId || !state.mode || !state.completedAt) {
    return [];
  }

  const completedAt = state.completedAt;
  const sorted = [...state.players].sort((a, b) => b.totalScore - a.totalScore);
  const categoryLabel = getCategoryLabel(state.categoryId);

  return sorted.map((player, index) => ({
    sessionId: state.sessionId!,
    playerId: player.id,
    playerName: player.name,
    rank: index + 1,
    totalScore: player.totalScore,
    mode: state.mode!,
    categoryId: state.categoryId,
    categoryLabel,
    roundScores: player.roundScores,
    answersCorrect: player.answersCorrect,
    answersTotal: player.answersTotal,
    completedAt: new Date(completedAt).toISOString(),
  }));
}

function applyScoreToPlayer(
  player: Player,
  round: RoundState,
  result: ReturnType<typeof validateAnswer>,
): Player {
  const roundScore = (player.roundScores[round.id] ?? 0) + result.pointsEarned;
  const questionCorrect = result.pointsEarned > 0;

  return {
    ...player,
    totalScore: player.totalScore + result.pointsEarned,
    roundScores: { ...player.roundScores, [round.id]: roundScore },
    answersCorrect: player.answersCorrect + (questionCorrect ? 1 : 0),
    answersTotal: player.answersTotal + 1,
  };
}

function formatUserAnswer(answer: string | string[]): string {
  if (Array.isArray(answer)) {
    return answer.join(", ");
  }
  return String(answer);
}

function getAcceptedAnswersSnapshot(question: QuizQuestion | null): string[] | undefined {
  if (!question || question.type !== "enumeration") return undefined;
  return question.acceptedAnswers.map((entry) => entry.label);
}

function getPlayerAccuracy(player: Player): number {
  if (player.answersTotal === 0) return 0;
  return Math.round((player.answersCorrect / player.answersTotal) * 100);
}

function emitQuizCompletedAnalytics(state: QuizStore): void {
  if (!state.sessionId || !state.mode) return;

  const featuredPlayer = [...state.players].sort((a, b) => b.totalScore - a.totalScore)[0];
  if (!featuredPlayer) return;

  trackQuizCompleted({
    mode: state.mode,
    category: state.categoryId ?? "mixed",
    isDaily: state.sessionType === "daily",
    score: featuredPlayer.totalScore,
    accuracy: getPlayerAccuracy(featuredPlayer),
    totalQuestions: featuredPlayer.answersTotal,
    rank: getKnowledgeRank(getPlayerAccuracy(featuredPlayer)).title,
    sessionId: state.sessionId,
  });
}

function emitRoundCompletedAnalytics(state: QuizStore, round: RoundState): void {
  if (!state.sessionId || !state.mode || !state.categoryId) return;

  const accuracy =
    round.questionCount > 0 ? Math.round((round.correctAnswers / round.questionCount) * 100) : 0;

  trackRoundCompleted({
    mode: state.mode,
    category: state.categoryId,
    round: round.number,
    score: round.roundScore,
    accuracy,
    sessionId: state.sessionId,
  });
}

export const createQuizStoreActions = (
  set: (partial: Partial<QuizStore> | ((state: QuizStore) => Partial<QuizStore>)) => void,
  get: () => QuizStore,
): Pick<
  QuizStore,
  | "initSolo"
  | "initDailyChallenge"
  | "initMultiplayer"
  | "resetQuiz"
  | "startNewQuiz"
  | "startGame"
  | "startRound"
  | "submitQuestionAnswer"
  | "continueFromFeedback"
  | "continueFromRoundComplete"
  | "continueFromPlayerHandoff"
  | "getLeaderboardPayload"
> => ({
  initSolo: (categoryId) => {
    invalidateQuizDataCache(categoryId);
    const quizData = buildQuizData(categoryId);
    set({
      ...initialQuizState,
      sessionId: createSessionId(),
      mode: "solo",
      categoryId,
      sessionType: "standard",
      dailyChallengeDate: null,
      phase: "setup",
      players: [createPlayer("You")],
      rounds: createInitialRoundsFromQuizData(quizData),
      quizData,
      questionOrder: quizData.rounds.map((round) => round.questions.map((q) => q.id)),
      activePlayerIndex: 0,
      currentQuestionId: quizData.rounds[0]?.questions[0]?.id ?? null,
    });
  },

  initDailyChallenge: (dateKey = getLocalDateKey()) => {
    const quizData = buildDailyChallengeData(dateKey);
    set({
      ...initialQuizState,
      sessionId: createSessionId(),
      mode: "solo",
      categoryId: "mixed",
      sessionType: "daily",
      dailyChallengeDate: dateKey,
      phase: "setup",
      players: [createPlayer("You")],
      rounds: createInitialRoundsFromQuizData(quizData),
      quizData,
      questionOrder: quizData.rounds.map((round) => round.questions.map((q) => q.id)),
      activePlayerIndex: 0,
      currentQuestionId: quizData.rounds[0]?.questions[0]?.id ?? null,
    });
    trackDailyChallengeStarted();
  },

  initMultiplayer: (playerNames) => {
    invalidateQuizDataCache("mixed");
    const quizData = buildQuizData("mixed");
    set({
      ...initialQuizState,
      sessionId: createSessionId(),
      mode: "multiplayer",
      categoryId: "mixed",
      sessionType: "standard",
      dailyChallengeDate: null,
      phase: "setup",
      players: playerNames.map((name) => createPlayer(name)),
      rounds: createInitialRoundsFromQuizData(quizData),
      quizData,
      questionOrder: quizData.rounds.map((round) => round.questions.map((q) => q.id)),
      activePlayerIndex: 0,
      currentQuestionId: quizData.rounds[0]?.questions[0]?.id ?? null,
    });
    trackMultiplayerStarted({ playerCount: playerNames.length });
  },

  resetQuiz: () => {
    clearQuizProgressStorage();
    set(initialQuizState);
  },

  startNewQuiz: (categoryId, mode = "solo") => {
    if (mode !== "solo") {
      return;
    }

    invalidateQuizDataCache(categoryId);
    const quizData = buildQuizData(categoryId);
    const sessionId = createSessionId();
    set({
      ...initialQuizState,
      sessionId,
      mode: "solo",
      categoryId,
      sessionType: "standard",
      dailyChallengeDate: null,
      phase: "round-intro",
      players: [createPlayer("You")],
      rounds: createInitialRoundsFromQuizData(quizData),
      quizData,
      questionOrder: quizData.rounds.map((round) => round.questions.map((q) => q.id)),
      activePlayerIndex: 0,
      currentRoundIndex: 0,
      currentQuestionIndex: 0,
      currentQuestionId: quizData.rounds[0]?.questions[0]?.id ?? null,
      completedPlayerIds: [],
      answerHistory: [],
      lastFeedback: null,
      startedAt: Date.now(),
      completedAt: null,
    });
    trackQuizStarted({
      mode: "solo",
      category: categoryId,
      isDaily: false,
      sessionId,
    });
  },

  startGame: () => {
    const state = get();
    if (state.phase !== "setup" || !state.categoryId || state.players.length === 0) {
      return;
    }

    invalidateQuizDataCache(state.categoryId);
    const quizData =
      state.sessionType === "daily" && state.quizData
        ? state.quizData
        : buildQuizData(state.categoryId);
    set({
      phase: "round-intro",
      currentRoundIndex: 0,
      currentQuestionIndex: 0,
      startedAt: Date.now(),
      completedAt: null,
      completedPlayerIds: [],
      answerHistory: [],
      lastFeedback: null,
      rounds: createInitialRoundsFromQuizData(quizData),
      quizData,
      questionOrder: quizData.rounds.map((round) => round.questions.map((q) => q.id)),
      currentQuestionId: quizData.rounds[0]?.questions[0]?.id ?? null,
      activePlayerIndex: state.mode === "multiplayer" ? 0 : 0,
      players: state.players.map((player) => ({
        ...player,
        totalScore: 0,
        roundScores: {},
        answersCorrect: 0,
        answersTotal: 0,
      })),
    });

    if (state.mode && state.categoryId) {
      trackQuizStarted({
        mode: state.mode,
        category: state.categoryId,
        isDaily: state.sessionType === "daily",
        sessionId: state.sessionId,
      });
    }
  },

  startRound: () => {
    const state = get();
    if (state.phase !== "round-intro" || !state.categoryId) return;
    const firstQuestion = getCurrentQuestionFromQuizData(state.quizData, state.currentRoundIndex, 0);

    set({
      phase: "question",
      currentQuestionIndex: 0,
      currentQuestionId: firstQuestion?.id ?? null,
      lastFeedback: null,
    });
  },

  submitQuestionAnswer: (answer) => {
    const state = get();
    const round = getCurrentRound(state);
    const player = getActivePlayer(state);

    if (state.phase !== "question" || !round || !player || !state.categoryId) {
      return;
    }

    const currentFromIndex = getCurrentQuestionFromQuizData(
      state.quizData,
      state.currentRoundIndex,
      state.currentQuestionIndex,
    );
    const questionPos = findQuestionPositionById(state.quizData, state.currentQuestionId);
    const question = questionPos
      ? getCurrentQuestionFromQuizData(state.quizData, questionPos.roundIndex, questionPos.questionIndex)
      : currentFromIndex;

    if (!question) return;

    const result = validateAnswer(question, answer);
    const userAnswer = formatUserAnswer(answer);
    const acceptedAnswers = getAcceptedAnswersSnapshot(question);

    const updatedPlayer = applyScoreToPlayer(player, round, result);

    const answerRecord: AnswerRecord = {
      id: createAnswerId(),
      questionId: question.id,
      playerId: player.id,
      roundId: round.id,
      roundNumber: round.number,
      questionIndex: state.currentQuestionIndex,
      correct: result.correct,
      pointsAwarded: result.pointsEarned,
      correctAnswerDisplay: result.correctAnswerDisplay,
      answeredAt: Date.now(),
    };

    const updatedRound: RoundState = {
      ...round,
      questionsAnswered: round.questionsAnswered + 1,
      correctAnswers: round.correctAnswers + (result.pointsEarned > 0 ? 1 : 0),
      roundScore: round.roundScore + result.pointsEarned,
    };

    const rounds = state.rounds.map((item, index) =>
      index === state.currentRoundIndex ? updatedRound : item,
    );

    set({
      phase: "feedback",
      players: updatePlayerInList(state.players, updatedPlayer),
      rounds,
      answerHistory: [...state.answerHistory, answerRecord],
      lastFeedback: {
        questionId: question.id,
        questionText: question.text,
        questionType: question.type,
        userAnswer,
        acceptedAnswers,
        correct:
          question.type === "enumeration"
            ? Boolean(result.isFullyCorrect)
            : result.pointsEarned > 0,
        pointsEarned: result.pointsEarned,
        correctAnswerDisplay: result.correctAnswerDisplay,
        isPartial: result.isPartial,
        isFullyCorrect: result.isFullyCorrect,
        enumerationRequiredCount:
          question.type === "enumeration" ? question.count : undefined,
        enumerationMatchedCount:
          question.type === "enumeration" ? result.correctCount : undefined,
        otherPossibleAnswers: result.otherPossibleAnswers,
        exampleAnswers: result.exampleAnswers,
        enumerationSummary: result.enumerationSummary,
      },
      currentQuestionId: question.id,
    });
  },

  continueFromFeedback: () => {
    const state = get();
    const round = getCurrentRound(state);

    if (state.phase !== "feedback" || !round) return;

    const isLastQuestion = state.currentQuestionIndex >= round.questionCount - 1;

    if (isLastQuestion) {
      const completedRound = { ...round, completed: true };
      const rounds = state.rounds.map((item, index) =>
        index === state.currentRoundIndex ? completedRound : item,
      );
      set({ phase: "round-complete", rounds, lastFeedback: null });
      emitRoundCompletedAnalytics(state, completedRound);
      return;
    }

    const nextQuestionIndex = state.currentQuestionIndex + 1;
    const nextQuestion = getCurrentQuestionFromQuizData(
      state.quizData,
      state.currentRoundIndex,
      nextQuestionIndex,
    );

    set({
      phase: "question",
      currentQuestionIndex: nextQuestionIndex,
      currentQuestionId: nextQuestion?.id ?? null,
      lastFeedback: null,
    });
  },

  continueFromRoundComplete: () => {
    const state = get();
    const round = getCurrentRound(state);
    if (state.phase !== "round-complete" || !round || !state.categoryId) return;

    const isFinalRound = state.currentRoundIndex >= state.rounds.length - 1;

    if (isFinalRound) {
      const activePlayer = getActivePlayer(state);
      const completedPlayerIds = activePlayer
        ? [...state.completedPlayerIds, activePlayer.id]
        : state.completedPlayerIds;

      const nextIndex = getNextPlayerIndex(state.players, completedPlayerIds);

      if (state.mode === "multiplayer" && nextIndex !== null) {
        set({
          phase: "player-handoff",
          completedPlayerIds,
          activePlayerIndex: nextIndex,
        });
        return;
      }

      set({
        phase: "game-complete",
        completedAt: Date.now(),
        completedPlayerIds,
      });
      emitQuizCompletedAnalytics(get());
      return;
    }

    set({
      phase: "round-intro",
      currentRoundIndex: state.currentRoundIndex + 1,
      currentQuestionIndex: 0,
      currentQuestionId:
        getCurrentQuestionFromQuizData(state.quizData, state.currentRoundIndex + 1, 0)?.id ?? null,
      lastFeedback: null,
      rounds: state.rounds.map((item, index) =>
        index === state.currentRoundIndex + 1
          ? { ...item, questionsAnswered: 0, correctAnswers: 0, roundScore: 0, completed: false }
          : item,
      ),
    });
  },

  continueFromPlayerHandoff: () => {
    const state = get();
    if (state.phase !== "player-handoff" || !state.categoryId) return;

    invalidateQuizDataCache(state.categoryId);
    const quizData = buildQuizData(state.categoryId);
    set({
      phase: "round-intro",
      currentRoundIndex: 0,
      currentQuestionIndex: 0,
      currentQuestionId: getCurrentQuestionFromQuizData(quizData, 0, 0)?.id ?? null,
      lastFeedback: null,
      quizData,
      questionOrder: quizData.rounds.map((round) => round.questions.map((q) => q.id)),
      rounds: createInitialRoundsFromQuizData(quizData),
    });
  },

  getLeaderboardPayload: () => buildLeaderboardPayload(get()),
});
