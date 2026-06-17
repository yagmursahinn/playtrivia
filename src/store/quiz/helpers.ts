import { buildQuizData, getQuestionByIndex } from "@/data/quiz";
import type { QuizData, QuizQuestion } from "@/data/quiz/types";
import { getRoundDefinitionsFromData } from "@/lib/constants/quiz";
import type { Player, RoundState } from "@/types/quiz";

export function createSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createPlayerId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `player-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createAnswerId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `answer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createInitialRounds(categoryId: string): RoundState[] {
  const quizData = buildQuizData(categoryId);
  return createInitialRoundsFromQuizData(quizData);
}

export function createInitialRoundsFromQuizData(quizData: QuizData): RoundState[] {
  return getRoundDefinitionsFromData(quizData.rounds).map((round) => ({
    ...round,
    questionsAnswered: 0,
    correctAnswers: 0,
    roundScore: 0,
    completed: false,
  }));
}

export function createPlayer(name: string): Player {
  return {
    id: createPlayerId(),
    name: name.trim(),
    totalScore: 0,
    roundScores: {},
    answersCorrect: 0,
    answersTotal: 0,
  };
}

export function getQuizDataForCategory(categoryId: string | null): QuizData | null {
  if (!categoryId) return null;
  return buildQuizData(categoryId);
}

export function getCurrentQuestion(
  categoryId: string | null,
  roundIndex: number,
  questionIndex: number,
): QuizQuestion | null {
  const quizData = getQuizDataForCategory(categoryId);
  if (!quizData) return null;
  return getQuestionByIndex(quizData, roundIndex, questionIndex);
}

export function getCurrentQuestionFromQuizData(
  quizData: QuizData | null,
  roundIndex: number,
  questionIndex: number,
): QuizQuestion | null {
  if (!quizData) return null;
  return getQuestionByIndex(quizData, roundIndex, questionIndex);
}

export function findQuestionPositionById(
  quizData: QuizData | null,
  questionId: string | null,
): { roundIndex: number; questionIndex: number } | null {
  if (!quizData || !questionId) return null;
  for (let roundIndex = 0; roundIndex < quizData.rounds.length; roundIndex += 1) {
    const questionIndex = quizData.rounds[roundIndex].questions.findIndex(
      (question) => question.id === questionId,
    );
    if (questionIndex >= 0) {
      return { roundIndex, questionIndex };
    }
  }
  return null;
}

export function getNextPlayerIndex(
  players: Player[],
  completedPlayerIds: string[],
): number | null {
  const next = players.findIndex((player) => !completedPlayerIds.includes(player.id));
  return next >= 0 ? next : null;
}

export function getAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}
