import type { QuestionType } from "@/data/quiz/types";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  "multiple-choice": "Multiple Choice",
  "fill-blank": "Fill The Gap",
  enumeration: "List It",
  "picture-choice": "Picture Round",
};

export function getQuestionTypeLabel(type: QuestionType): string {
  return QUESTION_TYPE_LABELS[type];
}
