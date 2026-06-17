export type QuestionType =
  | "multiple-choice"
  | "fill-blank"
  | "enumeration"
  | "picture-choice";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuizCategoryId =
  | "general"
  | "science"
  | "geography"
  | "history"
  | "mixed";

type BaseQuestion = {
  id: string;
  roundId: string;
  categoryIds: QuizCategoryId[];
  text: string;
  difficulty?: QuestionDifficulty;
  tags?: string[];
};

export type MultipleChoiceQuestion = BaseQuestion & {
  type: "multiple-choice";
  options: string[];
  correctAnswer: string;
};

export type FillBlankQuestion = BaseQuestion & {
  type: "fill-blank";
  blankLabel?: string;
  correctAnswers: string[];
};

export type AcceptedAnswerGroup = {
  label: string;
  aliases: string[];
};

export type EnumerationQuestion = BaseQuestion & {
  type: "enumeration";
  count: number;
  acceptedAnswers: AcceptedAnswerGroup[];
  hint?: string;
};

export type PictureChoiceQuestion = BaseQuestion & {
  type: "picture-choice";
  imageId: string;
  imageSrc: string;
  imageAlt: string;
  options: string[];
  correctAnswer: string;
};

export type QuizQuestion =
  | MultipleChoiceQuestion
  | FillBlankQuestion
  | EnumerationQuestion
  | PictureChoiceQuestion;

export type QuizRoundData = {
  id: string;
  number: number;
  title: string;
  description: string;
  questionType: QuestionType;
  questions: QuizQuestion[];
};

export type QuizData = {
  categoryIds: QuizCategoryId[];
  rounds: QuizRoundData[];
};

export type AnswerValidationResult = {
  correct: boolean;
  isPartial?: boolean;
  isFullyCorrect?: boolean;
  pointsEarned: number;
  correctCount: number;
  totalPossible: number;
  correctAnswerDisplay: string;
  matchedItems?: string[];
  otherPossibleAnswers?: string[];
  exampleAnswers?: string[];
  enumerationSummary?: string;
};
