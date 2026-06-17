import type {
  AcceptedAnswerGroup,
  QuestionType,
  QuizCategoryId,
} from "@/data/quiz/types";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type ContentCategorySlug =
  | "general-knowledge"
  | "science"
  | "geography"
  | "history";

export type ContentRoundFile = "quick-picks" | "fill-gap" | "list-it" | "picture-round";

export type ContentRoundId =
  | "quick-picks"
  | "fill-the-gap"
  | "list-it"
  | "picture-round";

export const ROUND_FILE_TO_ID: Record<ContentRoundFile, ContentRoundId> = {
  "quick-picks": "quick-picks",
  "fill-gap": "fill-the-gap",
  "list-it": "list-it",
  "picture-round": "picture-round",
};

export const CATEGORY_SLUG_TO_ID: Record<ContentCategorySlug, Exclude<QuizCategoryId, "mixed">> = {
  "general-knowledge": "general",
  science: "science",
  geography: "geography",
  history: "history",
};

export const CATEGORY_ID_TO_SLUG: Record<
  Exclude<QuizCategoryId, "mixed">,
  ContentCategorySlug
> = {
  general: "general-knowledge",
  science: "science",
  geography: "geography",
  history: "history",
};

type ContentQuestionBase = {
  id: string;
  category: ContentCategorySlug;
  round: ContentRoundId;
  difficulty: QuestionDifficulty;
  tags: string[];
  text: string;
};

export type ContentMultipleChoiceQuestion = ContentQuestionBase & {
  type: "multiple-choice";
  options: string[];
  correctAnswer: string;
};

export type ContentFillBlankQuestion = ContentQuestionBase & {
  type: "fill-blank";
  blankLabel?: string;
  correctAnswers: string[];
};

export type ContentEnumerationQuestion = ContentQuestionBase & {
  type: "enumeration";
  count: number;
  acceptedAnswers: AcceptedAnswerGroup[];
  hint?: string;
};

export type ContentPictureChoiceQuestion = ContentQuestionBase & {
  type: "picture-choice";
  imageId: string;
  imageSrc: string;
  imageAlt: string;
  options: string[];
  correctAnswer: string;
};

export type ContentQuestion =
  | ContentMultipleChoiceQuestion
  | ContentFillBlankQuestion
  | ContentEnumerationQuestion
  | ContentPictureChoiceQuestion;

export type ContentQuestionBank = Record<ContentCategorySlug, ContentQuestion[]>;

export type QuestionValidationIssue = {
  code: "duplicate-id" | "missing-answer" | "invalid-structure";
  questionId?: string;
  message: string;
};
