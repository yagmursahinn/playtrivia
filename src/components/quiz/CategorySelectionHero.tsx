"use client";

import { motion } from "framer-motion";
import { fadeInUp, transitions } from "@/lib/theme/animations";

export function CategorySelectionHero() {
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={transitions.fast}
      className="mb-5 text-center sm:mb-6 lg:mb-5"
    >
      <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-pink sm:text-sm">
        Solo Mode
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-dark sm:text-4xl">
        Choose Your Challenge
      </h1>
      <p className="mx-auto mt-2 max-w-2xl font-body text-sm font-semibold leading-snug text-dark/60 sm:text-base">
        Pick a category and test your knowledge across four unique rounds.
      </p>
    </motion.header>
  );
}
