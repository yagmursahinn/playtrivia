import { ROUND_META } from "@/data/quiz/rounds";
import type { RoundDefinition } from "@/types/quiz";

export const TOTAL_ROUNDS = ROUND_META.length;

const QUESTION_COUNTS: Record<string, number> = {
  "quick-picks": 5,
  "fill-the-gap": 5,
  "list-it": 4,
  "picture-round": 4,
};

export const ROUND_DEFINITIONS: RoundDefinition[] = ROUND_META.map((round) => ({
  id: round.id,
  number: round.number,
  title: round.title,
  description: round.description,
  questionCount: QUESTION_COUNTS[round.id] ?? 5,
}));

export function getRoundDefinitionsFromData(
  rounds: { id: string; number: number; title: string; description: string; questions: unknown[] }[],
): RoundDefinition[] {
  return rounds.map((round) => ({
    id: round.id,
    number: round.number,
    title: round.title,
    description: round.description,
    questionCount: round.questions.length,
  }));
}
