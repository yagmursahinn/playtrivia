"use client";

import { motion } from "framer-motion";
import { buttonTap, cardHover, transitions } from "@/lib/theme/animations";
import { cn } from "@/lib/utils/cn";

type MultipleChoiceAnswerProps = {
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
};

export function MultipleChoiceAnswer({
  options,
  selected,
  onSelect,
}: MultipleChoiceAnswerProps) {
  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      {options.map((option) => {
        const isSelected = selected === option;

        return (
          <motion.button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            whileHover={isSelected ? undefined : cardHover}
            whileTap={buttonTap}
            animate={isSelected ? { scale: 1.02, y: -2 } : { scale: 1, y: 0 }}
            transition={transitions.micro}
            style={{ willChange: "transform" }}
            className={cn(
              "rounded-2xl border-[3px] px-4 py-4 text-left font-body text-base font-semibold sm:px-6 sm:py-5 sm:text-lg",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/30",
              isSelected
                ? "border-pink bg-pink/15 text-dark shadow-[0_4px_0_0_#e040b8] ring-2 ring-pink/25"
                : "border-dark/10 bg-white/70 text-dark/80 hover:border-pink/35 hover:bg-pink/5",
            )}
          >
            <span className="flex items-center justify-between gap-3">
              <span>{option}</span>
              {isSelected && (
                <span className="rounded-full bg-pink px-2.5 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-wide text-dark">
                  Selected
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
