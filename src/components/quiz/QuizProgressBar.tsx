"use client";

import { motion } from "framer-motion";
import { transitions } from "@/lib/theme/animations";
import { cn } from "@/lib/utils/cn";

type QuizProgressBarProps = {
  current: number;
  total: number;
  className?: string;
};

export function QuizProgressBar({ current, total, className }: QuizProgressBarProps) {
  const percent = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2.5 flex items-center justify-between font-display text-xs font-bold uppercase tracking-widest text-dark/50 sm:text-sm">
        <span>Progress</span>
        <span>
          Question {current} of {total}
        </span>
      </div>
      <div className="h-3.5 overflow-hidden rounded-full border-2 border-dark/12 bg-white/70 shadow-inner sm:h-4">
        <motion.div
          className="h-full w-full origin-left rounded-full bg-gradient-to-r from-pink via-pink/90 to-blue"
          initial={{ scaleX: 0, opacity: 0.85 }}
          animate={{ scaleX: percent / 100, opacity: 1 }}
          transition={{ ...transitions.fast, duration: 0.35 }}
          style={{ willChange: "transform, opacity" }}
        />
      </div>
    </div>
  );
}
