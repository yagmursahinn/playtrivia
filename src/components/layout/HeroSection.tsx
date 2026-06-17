"use client";

import { motion } from "framer-motion";
import { HomeEngagementCards, HomeQuizPreview } from "@/components/home";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer, transitions } from "@/lib/theme/animations";

export function HeroSection() {
  return (
    <section className="relative flex w-full flex-col items-center text-center">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex w-full flex-col items-center"
      >
        <motion.div
          variants={fadeInUp}
          transition={transitions.fast}
          className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-dark/10 bg-white/70 px-4 py-2"
        >
          <span className="h-2 w-2 rounded-full bg-lime" />
          <span className="text-xs font-bold uppercase tracking-widest text-dark/60 sm:text-sm">
            Free to play · No sign-up
          </span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          transition={transitions.fast}
          className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-dark sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Challenge Your{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-pink">Knowledge</span>
            <span className="absolute -bottom-1 left-0 z-0 h-3 w-full rounded-full bg-lime/60 sm:h-4" />
          </span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          transition={transitions.fast}
          className="mt-5 max-w-md font-body text-lg font-semibold text-dark/60 sm:mt-6 sm:text-xl md:max-w-lg md:text-2xl"
        >
          Four exciting rounds. Endless fun.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          transition={transitions.micro}
          className="mt-10 flex w-full max-w-md flex-col gap-4 sm:mt-12 sm:max-w-none sm:flex-row sm:justify-center"
        >
          <Button href="/solo" variant="primary" size="xl" fullWidth className="sm:w-auto sm:min-w-[220px]">
            Play Solo
          </Button>
          <Button href="/multiplayer" variant="secondary" size="xl" fullWidth className="sm:w-auto sm:min-w-[220px]">
            Play With Friends
          </Button>
        </motion.div>

        <HomeEngagementCards />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transitions.fast, delay: 0.15 }}
        className="mt-12 w-full max-w-2xl sm:mt-14 lg:max-w-3xl"
      >
        <div className="rounded-[2rem] border-[3px] border-dark/10 bg-white/50 p-4 shadow-[0_16px_48px_rgba(26,26,46,0.08)] backdrop-blur-[2px] sm:p-6">
          <HomeQuizPreview />
        </div>
      </motion.div>
    </section>
  );
}
