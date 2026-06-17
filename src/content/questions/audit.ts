import { toQuizQuestions } from "./shared";
import { selectQuestionsForRounds } from "./select";
import type { ContentCategorySlug, ContentQuestion, ContentQuestionBank, ContentRoundId } from "./types";

const REQUIRED_ROUNDS: ContentRoundId[] = [
  "quick-picks",
  "fill-the-gap",
  "list-it",
  "picture-round",
];

const ID_PREFIX: Record<ContentCategorySlug, string> = {
  "general-knowledge": "gk",
  science: "sci",
  geography: "geo",
  history: "hist",
};

const MIXED_LIMITS: Record<ContentRoundId, number> = {
  "quick-picks": 5,
  "fill-the-gap": 5,
  "list-it": 4,
  "picture-round": 4,
};

type CategoryAuditRow = {
  category: ContentCategorySlug | "mixed";
  totalQuestions: number;
  errors: number;
  warnings: number;
  rounds: string;
};

export type QuestionBankAudit = {
  rows: CategoryAuditRow[];
  errors: string[];
  warnings: string[];
};

function roundCounts(questions: ContentQuestion[]): Record<ContentRoundId, number> {
  const counts: Record<ContentRoundId, number> = {
    "quick-picks": 0,
    "fill-the-gap": 0,
    "list-it": 0,
    "picture-round": 0,
  };
  for (const question of questions) {
    if (question.round in counts) {
      counts[question.round as ContentRoundId] += 1;
    }
  }
  return counts;
}

function validateQuestionShape(question: ContentQuestion, category: ContentCategorySlug): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!question.id) errors.push(`${category}: missing id`);
  if (!question.category) errors.push(`${category}/${question.id}: missing category`);
  if (!question.round) errors.push(`${category}/${question.id}: missing round`);
  if (!question.difficulty) errors.push(`${category}/${question.id}: missing difficulty`);
  if (!Array.isArray(question.tags) || question.tags.length === 0) {
    errors.push(`${category}/${question.id}: missing tags`);
  }
  if (!question.text?.trim()) errors.push(`${category}/${question.id}: missing question text`);

  const idPattern = new RegExp(`^${ID_PREFIX[category]}-(qp|fg|li|pr)-\\d{3}$`);
  if (!idPattern.test(question.id)) {
    warnings.push(`${category}/${question.id}: non-standard id format`);
  }

  switch (question.type) {
    case "multiple-choice":
      if (question.options.length !== 4) {
        errors.push(`${category}/${question.id}: multiple choice must have exactly 4 options`);
      }
      if (!question.options.includes(question.correctAnswer)) {
        errors.push(`${category}/${question.id}: correctAnswer missing from options`);
      }
      break;
    case "fill-blank":
      if (!question.correctAnswers?.length) {
        errors.push(`${category}/${question.id}: fill-blank missing correctAnswers`);
      }
      break;
    case "enumeration":
      if (!question.count || question.count <= 0) {
        errors.push(`${category}/${question.id}: list-it missing valid count`);
      }
      if (!question.acceptedAnswers?.length || question.acceptedAnswers.length < question.count) {
        errors.push(`${category}/${question.id}: list-it acceptedAnswers insufficient for count`);
      }
      break;
    case "picture-choice":
      if (question.options.length !== 4) {
        errors.push(`${category}/${question.id}: picture-choice must have exactly 4 options`);
      }
      if (!question.options.includes(question.correctAnswer)) {
        errors.push(`${category}/${question.id}: picture correctAnswer missing from options`);
      }
      if (!question.imageSrc) {
        errors.push(`${category}/${question.id}: picture-choice missing image path`);
      } else if (!question.imageSrc.startsWith("/images/picture-round/")) {
        warnings.push(`${category}/${question.id}: image path should use /images/picture-round/...`);
      }
      break;
  }

  return { errors, warnings };
}

export function validateQuestionBank(bank: ContentQuestionBank): QuestionBankAudit {
  const errors: string[] = [];
  const warnings: string[] = [];
  const rows: CategoryAuditRow[] = [];

  const globalIds = new Set<string>();

  for (const [category, questions] of Object.entries(bank) as [ContentCategorySlug, ContentQuestion[]][]) {
    let categoryErrors = 0;
    let categoryWarnings = 0;

    const localIds = new Set<string>();
    for (const question of questions) {
      if (localIds.has(question.id)) {
        errors.push(`${category}: duplicate id inside category (${question.id})`);
        categoryErrors += 1;
      }
      localIds.add(question.id);

      if (globalIds.has(question.id)) {
        errors.push(`${category}: duplicate global id (${question.id})`);
        categoryErrors += 1;
      }
      globalIds.add(question.id);

      const shape = validateQuestionShape(question, category);
      errors.push(...shape.errors);
      warnings.push(...shape.warnings);
      categoryErrors += shape.errors.length;
      categoryWarnings += shape.warnings.length;
    }

    const counts = roundCounts(questions);
    for (const round of REQUIRED_ROUNDS) {
      if (counts[round] <= 0) {
        errors.push(`${category}: missing round questions for ${round}`);
        categoryErrors += 1;
      }
    }

    if (questions.length !== 50) {
      errors.push(`${category}: expected 50 questions, found ${questions.length}`);
      categoryErrors += 1;
    }

    rows.push({
      category,
      totalQuestions: questions.length,
      errors: categoryErrors,
      warnings: categoryWarnings,
      rounds: REQUIRED_ROUNDS.map((round) => `${round}:${counts[round]}`).join(" | "),
    });
  }

  // Mixed-category validation from all pools.
  const poolsByRound: Record<ContentRoundId, ReturnType<typeof toQuizQuestions>> = {
    "quick-picks": [],
    "fill-the-gap": [],
    "list-it": [],
    "picture-round": [],
  };

  for (const questions of Object.values(bank)) {
    for (const question of questions) {
      poolsByRound[question.round].push(...toQuizQuestions([question]));
    }
  }

  const mixedTotalAvailable = Object.values(bank).reduce((sum, items) => sum + items.length, 0);
  const selected = selectQuestionsForRounds(
    poolsByRound,
    MIXED_LIMITS as unknown as Record<string, number>,
  );
  const selectedAll = Object.values(selected).flat();
  const selectedIds = selectedAll.map((q) => q.id);
  const uniqueMixedIds = new Set(selectedIds);

  let mixedErrors = 0;
  if (uniqueMixedIds.size !== selectedIds.length) {
    errors.push("mixed: duplicate questions detected inside one mixed quiz selection");
    mixedErrors += 1;
  }

  rows.push({
    category: "mixed",
    totalQuestions: mixedTotalAvailable,
    errors: mixedErrors,
    warnings: 0,
    rounds: REQUIRED_ROUNDS.map((round) => `${round}:pool${poolsByRound[round].length}`).join(" | "),
  });

  return { rows, errors, warnings };
}
