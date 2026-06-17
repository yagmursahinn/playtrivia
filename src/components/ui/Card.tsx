"use client";

import { motion } from "framer-motion";
import { cardHover } from "@/lib/theme/animations";
import { cn } from "@/lib/utils/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  accent?: "pink" | "blue" | "lime" | "cream" | "dark";
  padding?: "sm" | "md" | "lg";
};

const accentBorders = {
  pink: "border-pink/30 hover:border-pink/60",
  blue: "border-blue/30 hover:border-blue/60",
  lime: "border-lime/50 hover:border-lime/80",
  cream: "border-dark/8 hover:border-dark/15",
  dark: "border-dark/20 hover:border-dark/40",
};

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className,
  interactive = false,
  accent = "cream",
  padding = "md",
}: CardProps) {
  const baseClasses = cn(
    "rounded-3xl border-[3px] bg-white/90",
    "shadow-[0_8px_32px_rgba(26,26,46,0.08)]",
    accentBorders[accent],
    paddingStyles[padding],
    className,
  );

  if (interactive) {
    return (
      <motion.div
        className={cn(baseClasses, "cursor-pointer")}
        whileHover={cardHover}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClasses}>{children}</div>;
}
