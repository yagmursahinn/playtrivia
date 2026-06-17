"use client";

import { motion } from "framer-motion";
import {
  CATEGORY_DURATION_LABEL,
} from "@/lib/constants/categories";
import { cardHover, transitions } from "@/lib/theme/animations";
import { CheckBadge } from "@/components/ui/CheckBadge";
import { Icon } from "@/components/ui/Icon";
import { colorVariants } from "@/lib/theme/colors";
import type { Category } from "@/types";
import { cn } from "@/lib/utils/cn";

type CategoryCardProps = {
  category: Category;
  questionCount: number;
  selected?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
};

const accentRing: Record<Category["accent"], string> = {
  pink: "ring-pink/35 border-pink/60",
  blue: "ring-blue/35 border-blue/60",
  lime: "ring-lime/45 border-lime/70",
  cream: "ring-dark/15 border-dark/25",
  dark: "ring-dark/25 border-dark/40",
};

export function CategoryCard({
  category,
  questionCount,
  selected = false,
  onSelect,
  className,
}: CategoryCardProps) {
  const accent = colorVariants[category.accent];

  return (
    <motion.button
      type="button"
      layout
      onClick={() => onSelect?.(category.id)}
      animate={
        selected
          ? { scale: 1.02, y: -4 }
          : { scale: 1, y: 0 }
      }
      whileHover={selected ? undefined : cardHover}
      whileTap={{ scale: selected ? 1.01 : 0.985 }}
      transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ willChange: "transform" }}
      className={cn(
        "group relative flex min-h-[132px] w-full items-start gap-3 rounded-3xl border-[3px] bg-white/90 p-4 text-left sm:gap-4 sm:p-4",
        "shadow-[0_8px_28px_rgba(26,26,46,0.08)] transition-shadow duration-200",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/40",
        "hover:shadow-[0_14px_36px_rgba(26,26,46,0.12)]",
        selected
          ? cn(
              "border-current bg-white ring-4",
              accentRing[category.accent],
              "shadow-[0_16px_44px_rgba(26,26,46,0.14)]",
            )
          : "border-dark/10",
        className,
      )}
    >
      {selected && (
        <motion.span
          initial={{ scale: 0, y: 8, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ ...transitions.spring, duration: 0.28 }}
          className="absolute -right-1.5 -top-1.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-lime text-dark shadow-[0_4px_12px_rgba(226,239,95,0.45)] sm:h-9 sm:w-9"
          aria-hidden
        >
          <CheckBadge size="sm" />
        </motion.span>
      )}

      <span
        className={cn(
          "inline-flex shrink-0 rounded-2xl border-2 border-dark/8 bg-cream/70 p-2 transition-transform duration-200",
          "group-hover:scale-105",
          selected && "scale-105",
        )}
        style={{
          boxShadow: selected ? `0 6px 18px ${accent.shadow}` : undefined,
        }}
      >
        <Icon name={category.icon} size="xl" />
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <h3 className="font-display text-lg font-extrabold leading-tight text-dark sm:text-xl">
          {category.label}
        </h3>

        <p className="mt-1 font-body text-sm font-semibold leading-snug text-dark/55">
          {category.description}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-0.5 font-body text-[11px] font-bold uppercase tracking-wide text-dark/45 sm:text-xs">
          <span>{questionCount} Questions</span>
          <span className="text-dark/20">·</span>
          <span>{CATEGORY_DURATION_LABEL}</span>
        </div>
      </div>
    </motion.button>
  );
}
