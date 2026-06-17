import type { QuestionType, QuizQuestion } from "@/data/quiz/types";

export const QUESTION_POINTS: Record<QuestionType, number> = {
  "multiple-choice": 10,
  "fill-blank": 15,
  enumeration: 5,
  "picture-choice": 20,
};

export function getBasePointsForType(type: QuestionType): number {
  return QUESTION_POINTS[type];
}

export function getMaxPointsForQuestion(question: QuizQuestion): number {
  if (question.type === "enumeration") {
    const requiredCount =
      typeof question.count === "number" && question.count > 0 ? question.count : 3;
    return requiredCount * QUESTION_POINTS.enumeration;
  }

  return QUESTION_POINTS[question.type];
}

export function calculateEnumerationPoints(
  matchedCount: number,
  requiredCount: number,
): number {
  if (matchedCount >= requiredCount) {
    return requiredCount * QUESTION_POINTS.enumeration;
  }

  return matchedCount * QUESTION_POINTS.enumeration;
}
