import { GENERAL_KNOWLEDGE_QUESTIONS } from "./general-knowledge";
import { SCIENCE_QUESTIONS } from "./science";
import { GEOGRAPHY_QUESTIONS } from "./geography";
import { HISTORY_QUESTIONS } from "./history";
import { toQuizQuestion, toQuizQuestions } from "./shared";
import { assertValidQuestionBank } from "./validate";
import { shuffle } from "./select";
import type {
  ContentCategorySlug,
  ContentQuestion,
  ContentQuestionBank,
  ContentRoundId,
} from "./types";
import { CATEGORY_ID_TO_SLUG, CATEGORY_SLUG_TO_ID } from "./types";
import type { QuizCategoryId, QuizQuestion } from "@/data/quiz/types";
import { validateQuestionBank } from "./audit";
import { validatePictureRoundImageIds } from "@/lib/quiz/picture-round-registry";

export const CONTENT_QUESTION_BANK: ContentQuestionBank = {
  "general-knowledge": GENERAL_KNOWLEDGE_QUESTIONS,
  science: SCIENCE_QUESTIONS,
  geography: GEOGRAPHY_QUESTIONS,
  history: HISTORY_QUESTIONS,
};

export const SOURCE_CATEGORY_SLUGS = Object.keys(
  CONTENT_QUESTION_BANK,
) as ContentCategorySlug[];

if (process.env.NODE_ENV !== "production") {
  const auditKey = "__playtrivia_question_bank_audit__";
  const globalScope = globalThis as Record<string, unknown>;

  if (!globalScope[auditKey]) {
    globalScope[auditKey] = true;
    const audit = validateQuestionBank(CONTENT_QUESTION_BANK);
    console.table(
      audit.rows.map((row) => ({
        category: row.category,
        total: row.totalQuestions,
        errors: row.errors,
        warnings: row.warnings,
        rounds: row.rounds,
      })),
    );

    if (audit.warnings.length > 0) {
      console.warn("[PlayTrivia] Question bank warnings:\n" + audit.warnings.join("\n"));
    }

    const pictureImageIds = Object.values(CONTENT_QUESTION_BANK)
      .flat()
      .filter((question) => question.type === "picture-choice")
      .map((question) => question.imageId);
    const imageValidation = validatePictureRoundImageIds(pictureImageIds);

    if (imageValidation.duplicateImageIds.length > 0) {
      console.warn(
        "[PlayTrivia] Duplicate picture image ids in questions:\n" +
          imageValidation.duplicateImageIds.join("\n"),
      );
    }
    if (imageValidation.missing.length > 0) {
      console.warn(
        "[PlayTrivia] Missing picture image ids in registry:\n" + imageValidation.missing.join("\n"),
      );
    }

    if (audit.errors.length > 0) {
      throw new Error("[PlayTrivia] Question bank audit failed:\n" + audit.errors.join("\n"));
    }
  }

  for (const [slug, questions] of Object.entries(CONTENT_QUESTION_BANK)) {
    assertValidQuestionBank(questions, slug);
  }
}

export function getContentQuestionsForCategory(
  categorySlug: ContentCategorySlug,
): ContentQuestion[] {
  return CONTENT_QUESTION_BANK[categorySlug] ?? [];
}

/** Scalable utility API: category -> full content questions */
export function getQuestionsByCategory(categorySlug: ContentCategorySlug): ContentQuestion[] {
  return getContentQuestionsForCategory(categorySlug);
}

export function getContentQuestionsForCategoryId(
  categoryId: Exclude<QuizCategoryId, "mixed">,
): ContentQuestion[] {
  const slug = CATEGORY_ID_TO_SLUG[categoryId];
  return getContentQuestionsForCategory(slug);
}

export function getContentQuestionsByRound(
  categorySlug: ContentCategorySlug,
  roundId: ContentRoundId,
): ContentQuestion[] {
  return getContentQuestionsForCategory(categorySlug).filter(
    (question) => question.round === roundId,
  );
}

/** Scalable utility API: category+round -> content questions */
export function getQuestionsByRound(
  categorySlug: ContentCategorySlug,
  roundId: ContentRoundId,
): ContentQuestion[] {
  return getContentQuestionsByRound(categorySlug, roundId);
}

/**
 * Scalable utility API: random unique draw.
 * Prevents duplicates by question id within the same selection.
 */
export function getRandomQuestions(
  questions: ContentQuestion[],
  count: number,
): ContentQuestion[] {
  const uniqueById = new Map<string, ContentQuestion>();
  for (const question of questions) {
    if (!uniqueById.has(question.id)) {
      uniqueById.set(question.id, question);
    }
  }
  return shuffle([...uniqueById.values()]).slice(0, count);
}

export function getCategoryQuestionCount(categorySlug: ContentCategorySlug | "mixed"): number {
  if (categorySlug === "mixed") {
    return SOURCE_CATEGORY_SLUGS.reduce(
      (total, slug) => total + getContentQuestionsForCategory(slug).length,
      0,
    );
  }

  return getContentQuestionsForCategory(categorySlug).length;
}

export function getAllCategoryQuestionCounts(): Record<ContentCategorySlug | "mixed", number> {
  const counts = {
    mixed: getCategoryQuestionCount("mixed"),
  } as Record<ContentCategorySlug | "mixed", number>;

  for (const slug of SOURCE_CATEGORY_SLUGS) {
    counts[slug] = getCategoryQuestionCount(slug);
  }

  return counts;
}

export function getQuizQuestionBank(
  categoryId: Exclude<QuizCategoryId, "mixed">,
): QuizQuestion[] {
  return toQuizQuestions(getContentQuestionsForCategoryId(categoryId));
}

export function getQuizQuestionsByRound(
  categoryId: Exclude<QuizCategoryId, "mixed">,
  roundId: ContentRoundId,
): QuizQuestion[] {
  const slug = CATEGORY_ID_TO_SLUG[categoryId];
  return toQuizQuestions(getContentQuestionsByRound(slug, roundId));
}

export function getAllQuizQuestionsByRound(roundId: ContentRoundId): QuizQuestion[] {
  return SOURCE_CATEGORY_SLUGS.flatMap((slug) =>
    toQuizQuestions(getContentQuestionsByRound(slug, roundId)),
  );
}

export function findContentQuestionById(questionId: string): ContentQuestion | null {
  for (const questions of Object.values(CONTENT_QUESTION_BANK)) {
    const match = questions.find((question) => question.id === questionId);
    if (match) return match;
  }
  return null;
}

export function findQuizQuestionById(questionId: string): QuizQuestion | null {
  const content = findContentQuestionById(questionId);
  return content ? toQuizQuestion(content) : null;
}

export { CATEGORY_SLUG_TO_ID, CATEGORY_ID_TO_SLUG };
export { validateQuestionBank } from "./audit";
export * from "./types";
export * from "./shared";
export * from "./validate";
export * from "./select";
