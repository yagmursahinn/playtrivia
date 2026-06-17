import type { ContentQuestion, QuestionValidationIssue } from "./types";

function hasValidAnswers(question: ContentQuestion): boolean {
  switch (question.type) {
    case "multiple-choice":
      return (
        question.options.length >= 2 &&
        question.options.includes(question.correctAnswer)
      );
    case "fill-blank":
      return question.correctAnswers.length > 0;
    case "enumeration":
      return question.count > 0 && question.acceptedAnswers.length >= question.count;
    case "picture-choice":
      return (
        Boolean(question.imageSrc) &&
        Boolean(question.imageAlt) &&
        question.options.length >= 2 &&
        question.options.includes(question.correctAnswer)
      );
  }
}

export function validateContentQuestion(question: ContentQuestion): QuestionValidationIssue[] {
  const issues: QuestionValidationIssue[] = [];

  if (!question.id?.trim()) {
    issues.push({
      code: "invalid-structure",
      questionId: question.id,
      message: "Question is missing an id.",
    });
  }

  if (!question.text?.trim()) {
    issues.push({
      code: "invalid-structure",
      questionId: question.id,
      message: "Question is missing text.",
    });
  }

  if (!question.category || !question.round) {
    issues.push({
      code: "invalid-structure",
      questionId: question.id,
      message: "Question is missing category or round metadata.",
    });
  }

  if (!question.difficulty) {
    issues.push({
      code: "invalid-structure",
      questionId: question.id,
      message: "Question is missing difficulty metadata.",
    });
  }

  if (!Array.isArray(question.tags) || question.tags.length === 0) {
    issues.push({
      code: "invalid-structure",
      questionId: question.id,
      message: "Question is missing tags metadata.",
    });
  }

  if (!hasValidAnswers(question)) {
    issues.push({
      code: "missing-answer",
      questionId: question.id,
      message: "Question is missing valid answer data.",
    });
  }

  return issues;
}

export function validateQuestionBank(questions: ContentQuestion[]): QuestionValidationIssue[] {
  const issues: QuestionValidationIssue[] = [];
  const seenIds = new Set<string>();

  for (const question of questions) {
    if (seenIds.has(question.id)) {
      issues.push({
        code: "duplicate-id",
        questionId: question.id,
        message: `Duplicate question id: ${question.id}`,
      });
    } else {
      seenIds.add(question.id);
    }

    issues.push(...validateContentQuestion(question));
  }

  return issues;
}

export function assertValidQuestionBank(
  questions: ContentQuestion[],
  label: string,
): void {
  const issues = validateQuestionBank(questions);
  if (issues.length === 0) return;

  const summary = issues.map((issue) => `- [${issue.code}] ${issue.message}`).join("\n");
  throw new Error(`Invalid question bank (${label}):\n${summary}`);
}
