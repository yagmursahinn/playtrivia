import type { QuizQuestion } from "@/data/quiz/types";

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function selectQuestionsFromPool(
  pool: QuizQuestion[],
  count: number,
  usedIds: Set<string> = new Set(),
): QuizQuestion[] {
  const available = pool.filter((question) => !usedIds.has(question.id));
  const selected = shuffle(available).slice(0, count);

  for (const question of selected) {
    usedIds.add(question.id);
  }

  return selected;
}

export function selectQuestionsForRounds(
  poolsByRound: Record<string, QuizQuestion[]>,
  limitsByRound: Record<string, number>,
): Record<string, QuizQuestion[]> {
  const usedIds = new Set<string>();
  const selected: Record<string, QuizQuestion[]> = {};

  for (const [roundId, pool] of Object.entries(poolsByRound)) {
    const limit = limitsByRound[roundId] ?? pool.length;
    selected[roundId] = selectQuestionsFromPool(pool, limit, usedIds);
  }

  return selected;
}
