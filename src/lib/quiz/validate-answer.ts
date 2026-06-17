import type {
  AcceptedAnswerGroup,
  AnswerValidationResult,
  EnumerationQuestion,
  FillBlankQuestion,
  MultipleChoiceQuestion,
  PictureChoiceQuestion,
  QuizQuestion,
} from "@/data/quiz/types";
import { matchesAnyAlias, normalizeAnswer } from "@/lib/quiz/normalize-answer";
import {
  calculateEnumerationPoints,
  getBasePointsForType,
  getMaxPointsForQuestion,
} from "@/lib/quiz/scoring";

const EXAMPLE_ANSWER_LIMIT = 5;

function getRequiredCount(question: EnumerationQuestion): number {
  if (typeof question.count === "number" && question.count > 0) {
    return question.count;
  }

  const match = question.text.match(/\b(?:name|list)\s+(\d+)\b/i);
  if (match) {
    return Number.parseInt(match[1], 10);
  }

  return 3;
}

export function parseEnumerationInput(input: string): string[] {
  return input
    .split(/[,;\n|]+/u)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseEnumerationAnswers(rawAnswer: string | string[]): string[] {
  if (Array.isArray(rawAnswer)) {
    return rawAnswer.map((item) => item.trim()).filter(Boolean);
  }

  return parseEnumerationInput(String(rawAnswer));
}

function matchesAcceptedGroup(input: string, entry: AcceptedAnswerGroup): boolean {
  return matchesAnyAlias(input, [entry.label, ...entry.aliases]);
}

function validateMultipleChoice(
  question: MultipleChoiceQuestion,
  answer: string,
): AnswerValidationResult {
  const correct = normalizeAnswer(answer) === normalizeAnswer(question.correctAnswer);
  const points = getBasePointsForType("multiple-choice");

  return {
    correct,
    isFullyCorrect: correct,
    pointsEarned: correct ? points : 0,
    correctCount: correct ? 1 : 0,
    totalPossible: 1,
    correctAnswerDisplay: question.correctAnswer,
  };
}

function validateFillBlank(
  question: FillBlankQuestion,
  answer: string,
): AnswerValidationResult {
  const correct = matchesAnyAlias(answer, question.correctAnswers);
  const display = question.correctAnswers[0];

  return {
    correct,
    isFullyCorrect: correct,
    pointsEarned: correct ? getBasePointsForType("fill-blank") : 0,
    correctCount: correct ? 1 : 0,
    totalPossible: 1,
    correctAnswerDisplay: display,
  };
}

function validateEnumeration(
  question: EnumerationQuestion,
  rawAnswer: string | string[],
): AnswerValidationResult {
  const requiredCount = getRequiredCount(question);
  const answers = parseEnumerationAnswers(rawAnswer);
  const matchedLabels: string[] = [];
  const usedGroupIndexes = new Set<number>();

  for (const answer of answers) {
    if (!normalizeAnswer(answer)) continue;

    for (let index = 0; index < question.acceptedAnswers.length; index += 1) {
      if (usedGroupIndexes.has(index)) continue;

      const entry = question.acceptedAnswers[index];
      if (matchesAcceptedGroup(answer, entry)) {
        matchedLabels.push(entry.label);
        usedGroupIndexes.add(index);
        break;
      }
    }
  }

  const validMatchCount = matchedLabels.length;
  const isFullyCorrect = validMatchCount >= requiredCount;
  const isPartial = validMatchCount > 0 && !isFullyCorrect;
  const pointsEarned = calculateEnumerationPoints(validMatchCount, requiredCount);

  const unmatchedLabels = question.acceptedAnswers
    .map((entry) => entry.label)
    .filter((label) => !matchedLabels.includes(label));

  if (validMatchCount === 0) {
    return {
      correct: false,
      isFullyCorrect: false,
      isPartial: false,
      pointsEarned: 0,
      correctCount: 0,
      totalPossible: requiredCount,
      correctAnswerDisplay: question.acceptedAnswers
        .slice(0, EXAMPLE_ANSWER_LIMIT)
        .map((entry) => entry.label)
        .join(", "),
      exampleAnswers: question.acceptedAnswers
        .slice(0, EXAMPLE_ANSWER_LIMIT)
        .map((entry) => entry.label),
    };
  }

  if (isFullyCorrect) {
    return {
      correct: true,
      isFullyCorrect: true,
      isPartial: false,
      pointsEarned,
      correctCount: validMatchCount,
      totalPossible: requiredCount,
      correctAnswerDisplay: matchedLabels.slice(0, requiredCount).join(", "),
      matchedItems: matchedLabels.slice(0, requiredCount),
      enumerationSummary: `You named ${requiredCount} valid answers.`,
      otherPossibleAnswers: unmatchedLabels.slice(0, EXAMPLE_ANSWER_LIMIT),
    };
  }

  return {
    correct: false,
    isFullyCorrect: false,
    isPartial: true,
    pointsEarned,
    correctCount: validMatchCount,
    totalPossible: requiredCount,
    correctAnswerDisplay: matchedLabels.join(", "),
    matchedItems: matchedLabels,
    enumerationSummary: `You found ${validMatchCount} of ${requiredCount}.`,
    exampleAnswers: unmatchedLabels.slice(0, EXAMPLE_ANSWER_LIMIT),
  };
}

function validatePictureChoice(
  question: PictureChoiceQuestion,
  answer: string,
): AnswerValidationResult {
  const correct = normalizeAnswer(answer) === normalizeAnswer(question.correctAnswer);

  return {
    correct,
    isFullyCorrect: correct,
    pointsEarned: correct ? getBasePointsForType("picture-choice") : 0,
    correctCount: correct ? 1 : 0,
    totalPossible: 1,
    correctAnswerDisplay: question.correctAnswer,
  };
}

export function validateAnswer(
  question: QuizQuestion,
  rawAnswer: string | string[],
): AnswerValidationResult {
  switch (question.type) {
    case "multiple-choice":
      return validateMultipleChoice(question, String(rawAnswer));
    case "fill-blank":
      return validateFillBlank(question, String(rawAnswer));
    case "enumeration":
      return validateEnumeration(question, rawAnswer);
    case "picture-choice":
      return validatePictureChoice(question, String(rawAnswer));
  }
}

export function getQuestionPointLabel(question: QuizQuestion): string {
  if (question.type === "enumeration") {
    const perItem = getBasePointsForType("enumeration");
    const max = getMaxPointsForQuestion(question);
    return `${perItem} pts each · ${max} pts total`;
  }

  return `${getMaxPointsForQuestion(question)} pts`;
}
