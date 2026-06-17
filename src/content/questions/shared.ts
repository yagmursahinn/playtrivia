import type { AcceptedAnswerGroup, QuizQuestion } from "@/data/quiz/types";
import type {
  ContentCategorySlug,
  ContentEnumerationQuestion,
  ContentFillBlankQuestion,
  ContentMultipleChoiceQuestion,
  ContentPictureChoiceQuestion,
  ContentQuestion,
  ContentRoundId,
  QuestionDifficulty,
} from "./types";
import { getPictureRoundAssetSrc } from "@/lib/quiz/picture-round-registry";
import { CATEGORY_SLUG_TO_ID } from "./types";

export function accept(label: string, ...extraAliases: string[]): AcceptedAnswerGroup {
  const aliases = new Set<string>([
    label.toLowerCase(),
    ...extraAliases.map((alias) => alias.toLowerCase()),
  ]);

  return { label, aliases: [...aliases] };
}

export function quizImage(categoryId: string, index: number): string {
  const normalized = categoryId === "general" ? "general-knowledge" : categoryId;
  void index;
  return `/images/picture-round/${normalized}/1.svg`;
}

type QuestionMeta = {
  id: string;
  category: ContentCategorySlug;
  round: ContentRoundId;
  difficulty?: QuestionDifficulty;
  tags?: string[];
  text: string;
};

export function defineQuickPick(
  meta: QuestionMeta & { options: string[]; correctAnswer: string },
): ContentMultipleChoiceQuestion {
  return {
    ...meta,
    difficulty: meta.difficulty ?? "medium",
    tags: meta.tags ?? [meta.category],
    type: "multiple-choice",
    options: meta.options,
    correctAnswer: meta.correctAnswer,
  };
}

export function defineFillGap(
  meta: QuestionMeta & { blankLabel?: string; correctAnswers: string[] },
): ContentFillBlankQuestion {
  return {
    ...meta,
    difficulty: meta.difficulty ?? "medium",
    tags: meta.tags ?? [meta.category],
    type: "fill-blank",
    blankLabel: meta.blankLabel,
    correctAnswers: meta.correctAnswers,
  };
}

export function defineListIt(
  meta: QuestionMeta & {
    count: number;
    acceptedAnswers: AcceptedAnswerGroup[];
    hint?: string;
  },
): ContentEnumerationQuestion {
  return {
    ...meta,
    difficulty: meta.difficulty ?? "medium",
    tags: meta.tags ?? [meta.category],
    type: "enumeration",
    count: meta.count,
    acceptedAnswers: meta.acceptedAnswers,
    hint: meta.hint,
  };
}

export function definePictureRound(
  meta: QuestionMeta & {
    imageId: string;
    imageSrc: string;
    imageAlt: string;
    options: string[];
    correctAnswer: string;
  },
): ContentPictureChoiceQuestion {
  return {
    ...meta,
    difficulty: meta.difficulty ?? "medium",
    tags: meta.tags ?? [meta.category],
    type: "picture-choice",
    imageId: meta.imageId,
    imageSrc: meta.imageSrc,
    imageAlt: meta.imageAlt,
    options: meta.options,
    correctAnswer: meta.correctAnswer,
  };
}

export function toQuizQuestion(content: ContentQuestion): QuizQuestion {
  const categoryId = CATEGORY_SLUG_TO_ID[content.category];
  const base = {
    id: content.id,
    roundId: content.round,
    categoryIds: [categoryId],
    text: content.text,
    difficulty: content.difficulty,
    tags: content.tags,
  };

  switch (content.type) {
    case "multiple-choice":
      return {
        ...base,
        type: "multiple-choice",
        options: content.options,
        correctAnswer: content.correctAnswer,
      };
    case "fill-blank":
      return {
        ...base,
        type: "fill-blank",
        blankLabel: content.blankLabel,
        correctAnswers: content.correctAnswers,
      };
    case "enumeration":
      return {
        ...base,
        type: "enumeration",
        count: content.count,
        acceptedAnswers: content.acceptedAnswers,
        hint: content.hint,
      };
    case "picture-choice":
      return {
        ...base,
        type: "picture-choice",
        imageId: content.imageId,
        imageSrc: getPictureRoundAssetSrc(content.imageId),
        imageAlt: content.imageAlt,
        options: content.options,
        correctAnswer: content.correctAnswer,
      };
  }
}

export function toQuizQuestions(contentQuestions: ContentQuestion[]): QuizQuestion[] {
  return contentQuestions.map(toQuizQuestion);
}

/** Bridge legacy quiz seeds into content format with stable bank IDs. */
export function legacyRoundToContent(input: {
  source: QuizQuestion[];
  category: ContentCategorySlug;
  idPrefix: string;
  defaultDifficulty?: QuestionDifficulty;
  defaultTags?: string[];
}): ContentQuestion[] {
  const { source, category, idPrefix, defaultDifficulty = "medium", defaultTags } = input;

  return source.map((question, index) => {
    const id = `${idPrefix}-${String(index + 1).padStart(3, "0")}`;
    const base = {
      id,
      category,
      round: question.roundId as ContentRoundId,
      difficulty: question.difficulty ?? defaultDifficulty,
      tags: question.tags ?? defaultTags ?? [category],
      text: question.text,
    };

    switch (question.type) {
      case "multiple-choice":
        return defineQuickPick({
          ...base,
          options: question.options,
          correctAnswer: question.correctAnswer,
        });
      case "fill-blank":
        return defineFillGap({
          ...base,
          blankLabel: question.blankLabel,
          correctAnswers: question.correctAnswers,
        });
      case "enumeration":
        return defineListIt({
          ...base,
          count: question.count,
          acceptedAnswers: question.acceptedAnswers,
          hint: question.hint,
        });
      case "picture-choice":
        return definePictureRound({
          ...base,
          imageId: question.imageId ?? id,
          imageSrc: question.imageSrc,
          imageAlt: question.imageAlt,
          options: question.options,
          correctAnswer: question.correctAnswer,
        });
    }
  });
}
