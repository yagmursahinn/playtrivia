import type {
  AcceptedAnswerGroup,
  EnumerationQuestion,
  FillBlankQuestion,
  MultipleChoiceQuestion,
  PictureChoiceQuestion,
  QuizCategoryId,
  QuizQuestion,
} from "../types";
import {
  getPictureRoundAsset,
  resolvePictureRoundImageId,
} from "@/lib/quiz/picture-round-registry";

export const CATEGORY_FILE_MAP: Record<QuizCategoryId, string> = {
  general: "general-knowledge",
  science: "science",
  geography: "geography",
  history: "history",
  mixed: "mixed",
};

const IMAGE_CATEGORY_SLUG: Record<string, string> = {
  general: "general-knowledge",
  science: "science",
  geography: "geography",
  history: "history",
};

export function accept(label: string, ...extraAliases: string[]): AcceptedAnswerGroup {
  const aliases = new Set<string>([
    label.toLowerCase(),
    ...extraAliases.map((alias) => alias.toLowerCase()),
  ]);

  return { label, aliases: [...aliases] };
}

type QuestionSeed = {
  idSuffix: string;
} & (
  | Omit<MultipleChoiceQuestion, "id" | "categoryIds">
  | Omit<FillBlankQuestion, "id" | "categoryIds">
  | Omit<EnumerationQuestion, "id" | "categoryIds">
  | Omit<PictureChoiceQuestion, "id" | "categoryIds" | "imageId" | "imageSrc">
);

export function buildCategoryQuestions(
  categoryId: QuizCategoryId,
  seeds: QuestionSeed[],
): QuizQuestion[] {
  return seeds.map((seed) => {
    const { idSuffix, ...question } = seed;
    if (question.type === "picture-choice") {
      const imageId = resolvePictureRoundImageId(categoryId, idSuffix);
      const asset = getPictureRoundAsset(imageId);

      return {
        ...question,
        imageId,
        imageSrc: asset.src,
        id: `${categoryId}-${idSuffix}`,
        categoryIds: [categoryId],
      };
    }
    return {
      ...question,
      id: `${categoryId}-${idSuffix}`,
      categoryIds: [categoryId],
    };
  });
}

export function quizImage(categoryId: string, index: number): string {
  const slug = IMAGE_CATEGORY_SLUG[categoryId] ?? categoryId;
  return `/images/picture-round/${slug}/${index}.svg`;
}
