"use client";

import { Button } from "@/components/ui/Button";
import { trackResumeQuizClicked } from "@/lib/analytics";
import { useSavedQuizProgress } from "@/hooks/quiz/use-saved-quiz-progress";
import { getCategoryLabel, getResumePathForSavedProgress } from "@/lib/quiz/routes";
import { cn } from "@/lib/utils/cn";

type ContinueQuizBannerProps = {
  className?: string;
};

export function ContinueQuizBanner({ className }: ContinueQuizBannerProps) {
  const saved = useSavedQuizProgress();

  if (!saved) return null;

  const resumePath = getResumePathForSavedProgress(saved);
  const categoryLabel = getCategoryLabel(saved.categoryId, saved.sessionType);
  const modeLabel = saved.mode === "multiplayer" ? "Multiplayer" : "Solo";

  return (
    <div
      className={cn(
        "rounded-2xl border-[3px] border-blue/30 bg-blue/10 p-4 shadow-[0_6px_20px_rgba(26,26,46,0.06)] sm:p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 text-left">
          <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-blue">
            Saved Progress
          </p>
          <p className="mt-1 font-display text-lg font-extrabold text-dark sm:text-xl">
            Continue your {categoryLabel} quiz
          </p>
          <p className="mt-1 font-body text-sm font-semibold text-dark/60">
            {modeLabel} · Round {saved.currentRound} · Question {saved.currentQuestion} ·{" "}
            {saved.score} pts
          </p>
        </div>

        <Button
          href={resumePath}
          variant="secondary"
          size="lg"
          className="shrink-0 sm:min-w-[11rem]"
          onClick={() => {
            trackResumeQuizClicked({
              category: saved.categoryId,
              mode: saved.mode,
            });
          }}
        >
          Continue Quiz
        </Button>
      </div>
    </div>
  );
}
