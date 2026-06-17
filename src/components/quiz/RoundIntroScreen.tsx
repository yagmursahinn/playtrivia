"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { QuestionTypeBadge } from "@/components/quiz/QuestionTypeBadge";
import type { IconName } from "@/lib/constants/icons";
import { getQuestionTypeLabel } from "@/lib/quiz/question-labels";
import { transitions } from "@/lib/theme/animations";
import type { QuestionType } from "@/data/quiz/types";
import { ROUND_META } from "@/data/quiz/rounds";
import type { RoundState } from "@/types/quiz";
import { cn } from "@/lib/utils/cn";

type RoundIntroScreenProps = {
  round: RoundState;
  playerName?: string;
  onStart: () => void;
};

type RoundPreviewConfig = {
  icon: IconName;
  questionType: QuestionType;
  example: {
    text: string;
    options?: string[];
    blankLabel?: string;
    hint?: string;
    showImage?: boolean;
  };
};

const ROUND_PREVIEW: Record<string, RoundPreviewConfig> = {
  "quick-picks": {
    icon: "fast-rounds",
    questionType: "multiple-choice",
    example: {
      text: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter"],
    },
  },
  "fill-the-gap": {
    icon: "science",
    questionType: "fill-blank",
    example: {
      text: 'The author of "1984" is George ____.',
      blankLabel: "Author's surname",
    },
  },
  "list-it": {
    icon: "score-big",
    questionType: "enumeration",
    example: {
      text: "Name three primary colours of light.",
      hint: "Separate answers with commas",
    },
  },
  "picture-round": {
    icon: "geography",
    questionType: "picture-choice",
    example: {
      text: "What landmark is shown in this image?",
      options: ["Big Ben", "Eiffel Tower"],
      showImage: true,
    },
  },
};

const contentEnter = {
  hidden: { opacity: 0, x: -18 },
  visible: { opacity: 1, x: 0 },
};

const visualEnter = {
  hidden: { opacity: 0, x: 18 },
  visible: { opacity: 1, x: 0 },
};

function RoundExampleCard({ config }: { config: RoundPreviewConfig }) {
  const { example, questionType } = config;

  return (
    <div className="rounded-2xl border-2 border-dark/10 bg-white/80 p-4 shadow-[0_8px_24px_rgba(26,26,46,0.06)] sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <QuestionTypeBadge type={questionType} />
        <span className="font-body text-[10px] font-bold uppercase tracking-wide text-dark/40">
          Example
        </span>
      </div>

      {example.showImage && (
        <div className="mb-3 flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-pink/25 bg-gradient-to-br from-pink/10 via-blue/10 to-lime/10 sm:h-28">
          <span className="font-body text-xs font-semibold text-dark/40">Picture prompt</span>
        </div>
      )}

      <p className="font-display text-sm font-bold leading-snug text-dark sm:text-base">
        {example.text}
      </p>

      {example.options && (
        <div className="mt-3 space-y-2">
          {example.options.map((option, index) => (
            <div
              key={option}
              className={cn(
                "rounded-xl border-2 px-3 py-2 font-body text-xs font-semibold sm:text-sm",
                index === 1
                  ? "border-pink/40 bg-pink/10 text-dark"
                  : "border-dark/8 bg-cream/60 text-dark/65",
              )}
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {example.blankLabel && (
        <div className="mt-3">
          <label className="font-body text-[10px] font-bold uppercase tracking-wide text-dark/45">
            {example.blankLabel}
          </label>
          <div className="mt-1.5 h-10 rounded-xl border-2 border-dashed border-blue/30 bg-blue/5" />
        </div>
      )}

      {example.hint && (
        <p className="mt-3 rounded-xl border-2 border-lime/30 bg-lime/10 px-3 py-2 font-body text-xs font-semibold text-dark/60">
          {example.hint}
        </p>
      )}
    </div>
  );
}

export function RoundIntroScreen({ round, playerName, onStart }: RoundIntroScreenProps) {
  const meta = ROUND_META.find((item) => item.id === round.id);
  const preview =
    ROUND_PREVIEW[round.id] ??
    ({
      icon: "fast-rounds",
      questionType: meta?.questionType ?? "multiple-choice",
      example: { text: round.description },
    } satisfies RoundPreviewConfig);

  const displayName = playerName?.trim() || "You";
  const typeLabel = getQuestionTypeLabel(preview.questionType);

  return (
    <div className="mx-auto w-full max-w-[75rem] py-3 sm:py-5">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-10 xl:gap-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentEnter}
          transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
          className="order-2 flex flex-col lg:order-1"
          style={{ willChange: "transform, opacity" }}
        >
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-pink sm:text-sm">
            Round {round.number}
          </p>

          <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-dark sm:text-4xl lg:text-5xl">
            {round.title}
          </h2>

          <p className="mt-3 max-w-xl font-body text-base font-semibold leading-relaxed text-dark/60 sm:text-lg">
            {round.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
            <span className="rounded-full border-2 border-dark/10 bg-white/70 px-3 py-1.5 font-body text-xs font-bold text-dark/70 sm:text-sm">
              {round.questionCount} questions
            </span>
            <span className="rounded-full border-2 border-blue/25 bg-blue/10 px-3 py-1.5 font-body text-xs font-bold text-dark/70 sm:text-sm">
              {typeLabel}
            </span>
            <span className="rounded-full border-2 border-lime/35 bg-lime/15 px-3 py-1.5 font-body text-xs font-bold text-dark/70 sm:text-sm">
              Playing as {displayName}
            </span>
          </div>

          <div className="mt-7 w-full sm:mt-8 sm:max-w-sm lg:max-w-xs">
            <Button variant="primary" size="xl" fullWidth onClick={onStart}>
              Start Round
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={visualEnter}
          transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1], delay: 0.06 }}
          className="order-1 lg:order-2"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="rounded-3xl border-[3px] border-dark/10 bg-white/85 p-5 shadow-[0_12px_40px_rgba(26,26,46,0.08)] sm:p-6 lg:p-7">
            <div className="flex flex-col items-center text-center">
              <div className="flex w-full items-center justify-center rounded-2xl border-2 border-dark/8 bg-gradient-to-br from-pink/10 via-cream to-blue/10 px-6 py-5 sm:py-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...transitions.fast, delay: 0.12 }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <Icon name={preview.icon} size="2xl" />
                </motion.div>
              </div>

              <p className="mt-4 font-display text-sm font-extrabold uppercase tracking-wide text-dark/50">
                {typeLabel}
              </p>
            </div>

            <div className="mt-5 sm:mt-6">
              <RoundExampleCard config={preview} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
