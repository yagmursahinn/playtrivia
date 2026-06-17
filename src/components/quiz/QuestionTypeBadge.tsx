import type { QuestionType } from "@/data/quiz/types";
import { getQuestionTypeLabel } from "@/lib/quiz/question-labels";
import { cn } from "@/lib/utils/cn";

const TYPE_STYLES: Record<QuestionType, string> = {
  "multiple-choice": "border-blue/30 bg-blue/10 text-dark",
  "fill-blank": "border-blue/25 bg-blue/10 text-dark",
  enumeration: "border-lime/40 bg-lime/15 text-dark",
  "picture-choice": "border-pink/30 bg-pink/10 text-dark",
};

type QuestionTypeBadgeProps = {
  type: QuestionType;
  className?: string;
};

export function QuestionTypeBadge({ type, className }: QuestionTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border-2 px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wide",
        TYPE_STYLES[type],
        className,
      )}
    >
      {getQuestionTypeLabel(type)}
    </span>
  );
}
