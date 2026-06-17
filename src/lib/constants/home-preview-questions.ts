export type HomePreviewQuestion = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  points: number;
};

import { getContentQuestionsByRound } from "@/content/questions";

export const HOME_PREVIEW_QUESTIONS: HomePreviewQuestion[] = getContentQuestionsByRound(
  "general-knowledge",
  "quick-picks",
)
  .filter((question) => question.type === "multiple-choice")
  .slice(0, 4)
  .map((question) => ({
    id: question.id,
    text: question.text,
    options: question.options,
    correctAnswer: question.correctAnswer,
    points: 10,
  }));

export const HOME_PREVIEW_ROUND = {
  roundNumber: 1,
  roundTitle: "Quick Picks",
  totalQuestions: 5,
} as const;
