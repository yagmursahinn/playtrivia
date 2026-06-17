import { ROUND_META } from "./rounds";
import {
  getAllQuizQuestionsByRound,
  getQuizQuestionsByRound,
  SOURCE_CATEGORY_SLUGS,
  CATEGORY_SLUG_TO_ID,
} from "@/content/questions";
import type { ContentRoundId } from "@/content/questions/types";
import { selectQuestionsForRounds } from "@/content/questions/select";
import type { QuizCategoryId, QuizData, QuizQuestion, QuizRoundData } from "./types";

const QUIZ_DATA_VERSION = 6;

const quizDataCache = new Map<string, QuizData>();

const ROUND_QUESTION_LIMITS: Record<string, number> = {
  "quick-picks": 5,
  "fill-the-gap": 5,
  "list-it": 4,
  "picture-round": 4,
};

function cloneQuestion(question: QuizQuestion, categoryId: QuizCategoryId, index: number): QuizQuestion {
  return {
    ...question,
    id: `mixed-${question.id}-${index}`,
    categoryIds: [categoryId],
  };
}

function buildMixedRoundQuestions(roundId: ContentRoundId): QuizQuestion[] {
  const limit = ROUND_QUESTION_LIMITS[roundId] ?? 5;
  const pool = getAllQuizQuestionsByRound(roundId);

  const selected = selectQuestionsForRounds(
    { [roundId]: pool },
    { [roundId]: limit },
  )[roundId];

  return selected.map((question, index) => cloneQuestion(question, "mixed", index));
}

function buildCategoryRounds(categoryId: QuizCategoryId): QuizRoundData[] {
  if (categoryId === "mixed") {
    return ROUND_META.map((round) => ({
      ...round,
      questions: buildMixedRoundQuestions(round.id as ContentRoundId),
    }));
  }

  const poolsByRound = Object.fromEntries(
    ROUND_META.map((round) => [
      round.id,
      getQuizQuestionsByRound(categoryId, round.id as ContentRoundId),
    ]),
  );

  const selectedByRound = selectQuestionsForRounds(poolsByRound, ROUND_QUESTION_LIMITS);

  return ROUND_META.map((round) => ({
    ...round,
    questions: selectedByRound[round.id] ?? [],
  }));
}

export function invalidateQuizDataCache(categoryId?: string): void {
  if (categoryId) {
    quizDataCache.delete(`${QUIZ_DATA_VERSION}:${categoryId}`);
    quizDataCache.delete(`${QUIZ_DATA_VERSION - 1}:${categoryId}`);
    quizDataCache.delete(categoryId);
    return;
  }

  quizDataCache.clear();
}

export function buildQuizData(categoryId: string): QuizData {
  const normalized = categoryId as QuizCategoryId;
  const cacheKey = `${QUIZ_DATA_VERSION}:${normalized}`;

  const cached = quizDataCache.get(cacheKey);
  if (cached) return cached;

  const rounds = buildCategoryRounds(normalized);
  const data: QuizData = {
    categoryIds: [normalized],
    rounds,
  };

  quizDataCache.set(cacheKey, data);
  return data;
}

export function getQuestionsForCategory(categoryId: string): QuizQuestion[] {
  const normalized = categoryId as QuizCategoryId;

  if (normalized === "mixed") {
    return ROUND_META.flatMap((round) =>
      buildMixedRoundQuestions(round.id as ContentRoundId),
    );
  }

  return buildCategoryRounds(normalized).flatMap((round) => round.questions);
}

export function getQuestionByIndex(
  quizData: QuizData,
  roundIndex: number,
  questionIndex: number,
): QuizQuestion | null {
  const round = quizData.rounds[roundIndex];
  if (!round) return null;
  return round.questions[questionIndex] ?? null;
}

export function getRoundQuestionCount(quizData: QuizData, roundIndex: number): number {
  return quizData.rounds[roundIndex]?.questions.length ?? 0;
}

export function getTotalQuestionCount(quizData: QuizData): number {
  return quizData.rounds.reduce((total, round) => total + round.questions.length, 0);
}

export { ROUND_META, SOURCE_CATEGORY_SLUGS, CATEGORY_SLUG_TO_ID };
export type * from "./types";
