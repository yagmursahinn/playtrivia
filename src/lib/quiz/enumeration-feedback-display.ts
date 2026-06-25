export const MAX_VISIBLE_ENUMERATION_ANSWERS = 6;

export type EnumerationAcceptedAnswersDisplay = {
  title: string;
  visibleAnswers: string[];
  showEllipsis: boolean;
  helperText?: string;
};

export function getEnumerationAcceptedAnswersDisplay(
  totalAcceptedCount: number,
  answers: string[],
): EnumerationAcceptedAnswersDisplay | null {
  if (answers.length === 0 || totalAcceptedCount <= 0) {
    return null;
  }

  const visibleAnswers = answers.slice(0, MAX_VISIBLE_ENUMERATION_ANSWERS);
  const isPartialList = totalAcceptedCount > visibleAnswers.length;

  if (isPartialList) {
    return {
      title: "Some accepted answers include",
      visibleAnswers,
      showEllipsis: true,
      helperText: "Other valid answers may also be accepted.",
    };
  }

  return {
    title: "Accepted answers",
    visibleAnswers,
    showEllipsis: false,
  };
}
