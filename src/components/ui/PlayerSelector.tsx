"use client";

import { motion } from "framer-motion";
import { transitions } from "@/lib/theme/animations";
import type { PlayerCount } from "@/types";
import { CheckBadge } from "@/components/ui/CheckBadge";
import { cn } from "@/lib/utils/cn";

type PlayerSelectorProps = {
  value: PlayerCount;
  onChange: (count: PlayerCount) => void;
};

const OPTIONS: PlayerCount[] = [2, 3, 4];

export function PlayerSelector({ value, onChange }: PlayerSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {OPTIONS.map((count) => {
        const selected = value === count;

        return (
          <motion.button
            key={count}
            type="button"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={transitions.micro}
            style={{ willChange: "transform" }}
            onClick={() => onChange(count)}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-3xl border-[3px] py-6",
              "font-display text-2xl font-bold transition-shadow duration-150 sm:py-8 sm:text-3xl",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/40",
              selected
                ? "border-blue bg-blue/15 text-dark shadow-[0_6px_0_0_#3a96e8,0_10px_24px_rgba(89,176,247,0.3)]"
                : "border-dark/10 bg-white/80 text-dark/70 hover:border-blue/40 hover:bg-blue/5",
            )}
          >
            <span className="leading-none">{count}</span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-dark/50 sm:text-sm">
              Players
            </span>
            {selected && (
              <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-lime text-dark shadow-md">
                <CheckBadge size="sm" />
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
