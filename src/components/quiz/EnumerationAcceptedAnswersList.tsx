import { getEnumerationAcceptedAnswersDisplay } from "@/lib/quiz/enumeration-feedback-display";
import { cn } from "@/lib/utils/cn";

type EnumerationAcceptedAnswersListProps = {
  totalAcceptedCount: number;
  answers: string[];
  className?: string;
};

export function EnumerationAcceptedAnswersList({
  totalAcceptedCount,
  answers,
  className,
}: EnumerationAcceptedAnswersListProps) {
  const display = getEnumerationAcceptedAnswersDisplay(totalAcceptedCount, answers);

  if (!display) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-4 w-full rounded-2xl border-2 border-dark/10 bg-white/70 px-4 py-3 text-left sm:mt-5 sm:px-5 sm:py-4",
        className,
      )}
    >
      <p className="font-body text-xs font-semibold text-dark/50 sm:text-sm">{display.title}</p>
      <p className="mt-1.5 font-display text-sm font-bold leading-relaxed text-dark sm:text-base">
        {display.visibleAnswers.join(", ")}
        {display.showEllipsis ? "..." : ""}
      </p>
      {display.helperText && (
        <p className="mt-2 font-body text-xs font-semibold text-dark/45 sm:text-sm">
          {display.helperText}
        </p>
      )}
    </div>
  );
}
