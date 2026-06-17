"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  CATEGORY_DURATION_LABEL,
  CATEGORY_ESTIMATED_MINUTES,
  CATEGORIES,
  getCategoryQuestionCountById,
} from "@/lib/constants/categories";
import { ROUND_DEFINITIONS } from "@/lib/constants/quiz";
import { transitions } from "@/lib/theme/animations";
import { cn } from "@/lib/utils/cn";

type CategoryPreviewPanelProps = {
  categoryId: string | null;
  onStart: () => void;
  className?: string;
};

export function CategoryPreviewPanel({
  categoryId,
  onStart,
  className,
}: CategoryPreviewPanelProps) {
  const category = CATEGORIES.find((item) => item.id === categoryId);
  const questionCount = category ? getCategoryQuestionCountById(category.id) : 0;

  return (
    <div
      className={cn(
        "rounded-3xl border-[3px] border-dark/10 bg-white/85 p-5 shadow-[0_12px_40px_rgba(26,26,46,0.08)] sm:p-6",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {category ? (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.26, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-dark/45 sm:text-sm">
              {category.label}
            </p>

            <ul className="mt-3 space-y-1.5 sm:space-y-2">
              {ROUND_DEFINITIONS.map((round) => (
                <li
                  key={round.id}
                  className="flex items-baseline gap-2 font-body text-sm font-semibold text-dark/75"
                >
                  <span className="font-display text-[11px] font-extrabold uppercase tracking-wide text-pink sm:text-xs">
                    Round {round.number}
                  </span>
                  <span className="text-dark/35">—</span>
                  <span>{round.title}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-body text-xs font-semibold text-dark/60 sm:text-sm">
              <span>{questionCount} Questions</span>
              <span className="text-dark/25">·</span>
              <span>{CATEGORY_DURATION_LABEL}</span>
              <span className="text-dark/25">·</span>
              <span>Estimated {CATEGORY_ESTIMATED_MINUTES} Minutes</span>
            </div>

            <div className="mt-5 sm:mx-auto sm:max-w-md">
              <Button variant="primary" size="lg" fullWidth onClick={onStart}>
                Start Challenge
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.fast}
            className="py-6 text-center"
          >
            <p className="font-display text-lg font-bold text-dark/70 sm:text-xl">
              Select a category
            </p>
            <p className="mt-2 font-body text-sm font-semibold text-dark/50 sm:text-base">
              Your round preview and challenge details will appear here.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
