import { getAllQuizQuestionsByRound } from "@/content/questions";
import type { ContentRoundId } from "@/content/questions/types";
import { ROUND_META } from "@/data/quiz/rounds";
import type { QuizData, QuizQuestion } from "@/data/quiz/types";
import { getLocalDateKey, hashString } from "./date";

const DAILY_QUESTION_LIMITS: Record<string, number> = {
  "quick-picks": 3,
  "fill-the-gap": 3,
  "list-it": 2,
  "picture-round": 2,
};

export const DAILY_CHALLENGE_QUESTION_COUNT = Object.values(DAILY_QUESTION_LIMITS).reduce(
  (total, count) => total + count,
  0,
);

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function seededSelectFromPool(
  pool: QuizQuestion[],
  count: number,
  usedIds: Set<string>,
  seed: number,
): QuizQuestion[] {
  const available = pool.filter((question) => !usedIds.has(question.id));
  const random = createSeededRandom(seed);
  const copy = [...available];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  const selected = copy.slice(0, count);
  for (const question of selected) {
    usedIds.add(question.id);
  }

  return selected;
}

export function buildDailyChallengeData(dateKey = getLocalDateKey()): QuizData {
  const baseSeed = hashString(dateKey);
  const usedIds = new Set<string>();

  const rounds = ROUND_META.map((meta) => {
    const limit = DAILY_QUESTION_LIMITS[meta.id] ?? 0;
    const pool = getAllQuizQuestionsByRound(meta.id as ContentRoundId);
    const questions = seededSelectFromPool(pool, limit, usedIds, baseSeed + meta.number);

    return {
      ...meta,
      questionCount: questions.length,
      questions,
    };
  });

  return {
    categoryIds: ["mixed"],
    rounds,
  };
}

export function isDailyChallengeCompleted(
  completedDate: string | null,
  dateKey = getLocalDateKey(),
): boolean {
  return completedDate === dateKey;
}
