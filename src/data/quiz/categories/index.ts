import type { QuizCategoryId, QuizQuestion } from "../types";
import {
  getQuizQuestionBank,
  SOURCE_CATEGORY_SLUGS,
  CATEGORY_SLUG_TO_ID,
} from "@/content/questions";

export { CATEGORY_SLUG_TO_ID as CATEGORY_FILE_MAP };

export const CATEGORY_QUESTION_BANK: Record<
  Exclude<QuizCategoryId, "mixed">,
  QuizQuestion[]
> = {
  general: getQuizQuestionBank("general"),
  science: getQuizQuestionBank("science"),
  geography: getQuizQuestionBank("geography"),
  history: getQuizQuestionBank("history"),
};

export const SOURCE_CATEGORY_IDS = SOURCE_CATEGORY_SLUGS.map(
  (slug) => CATEGORY_SLUG_TO_ID[slug],
) as Exclude<QuizCategoryId, "mixed">[];

export function getCategoryQuestions(categoryId: Exclude<QuizCategoryId, "mixed">): QuizQuestion[] {
  return CATEGORY_QUESTION_BANK[categoryId];
}

export {
  GENERAL_KNOWLEDGE_QUESTIONS,
} from "@/content/questions/general-knowledge";
export { SCIENCE_QUESTIONS } from "@/content/questions/science";
export { GEOGRAPHY_QUESTIONS } from "@/content/questions/geography";
export { HISTORY_QUESTIONS } from "@/content/questions/history";
