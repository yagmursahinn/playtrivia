"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { getDailyChallengePath } from "@/lib/quiz/routes";
import { getIconPath } from "@/lib/constants/icons";
import { fadeInUp, transitions } from "@/lib/theme/animations";
import { useRetentionSummary } from "@/hooks/retention";
import { cn } from "@/lib/utils/cn";

function EngagementIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-dark/10 bg-cream/80 p-2">
      <Image src={src} alt={alt} width={32} height={32} className="h-8 w-8 object-contain" />
    </div>
  );
}

export function HomeEngagementCards() {
  const {
    currentStreak,
    dailyChallengeCompleted,
    dailyChallengeQuestionCount,
    latestAchievement,
  } = useRetentionSummary();

  return (
    <motion.div
      variants={fadeInUp}
      transition={{ ...transitions.fast, delay: 0.08 }}
      className="mt-8 grid w-full max-w-4xl gap-4 sm:grid-cols-3"
    >
      <Link href={getDailyChallengePath()} className="block h-full">
        <Card
          interactive
          accent="pink"
          padding="sm"
          className={cn(
            "h-full text-left transition-transform",
            dailyChallengeCompleted && "border-lime/45 bg-lime/8",
          )}
        >
          <div className="flex items-start gap-3">
            <EngagementIcon src={getIconPath("mixed")} alt="Daily Challenge" />
            <div className="min-w-0">
              <p className="font-display text-base font-extrabold text-dark">Today&apos;s Challenge</p>
              <p className="mt-1 font-body text-sm font-semibold text-dark/55">
                {dailyChallengeQuestionCount} Questions · Mixed
              </p>
              <p
                className={cn(
                  "mt-3 inline-flex rounded-full px-3 py-1 font-body text-xs font-bold uppercase tracking-wide",
                  dailyChallengeCompleted
                    ? "bg-lime/20 text-dark"
                    : "bg-pink/12 text-dark/70",
                )}
              >
                {dailyChallengeCompleted ? "Completed Today" : "Play Daily Challenge"}
              </p>
            </div>
          </div>
        </Card>
      </Link>

      <Card accent="blue" padding="sm" className="h-full">
        <div className="flex items-start gap-3">
          <EngagementIcon src={getIconPath("score-big")} alt="Streak" />
          <div className="min-w-0">
            <p className="font-display text-base font-extrabold text-dark">Current Streak</p>
            <motion.p
              key={currentStreak}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitions.micro}
              className="mt-2 font-display text-3xl font-extrabold text-pink"
            >
              {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
            </motion.p>
            <p className="mt-2 font-body text-sm font-semibold text-dark/55">
              {currentStreak > 0 ? "Keep your streak alive." : "Play today to start a streak."}
            </p>
          </div>
        </div>
      </Card>

      <Card accent="lime" padding="sm" className="h-full">
        <div className="flex items-start gap-3">
          <EngagementIcon src={getIconPath("party-ready")} alt="Achievement" />
          <div className="min-w-0">
            <p className="font-display text-base font-extrabold text-dark">Latest Achievement</p>
            {latestAchievement ? (
              <>
                <p className="mt-2 font-display text-lg font-extrabold text-dark">
                  {latestAchievement.title}
                </p>
                <p className="mt-1 font-body text-sm font-semibold text-dark/55">
                  {latestAchievement.description}
                </p>
              </>
            ) : (
              <p className="mt-2 font-body text-sm font-semibold text-dark/55">
                Complete a quiz to unlock your first achievement.
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
