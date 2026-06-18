"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { QuizConfetti } from "@/components/quiz/QuizConfetti";
import { ShareResultModal } from "@/components/quiz/ShareResultModal";
import { useToast } from "@/components/ui/Toast";
import {
  evaluateSessionAchievements,
  getAchievementDefinitions,
} from "@/lib/retention/achievements";
import { getLocalDateKey } from "@/lib/retention/date";
import { getKnowledgeRank, getKnowledgeRankStyle } from "@/lib/retention/rank";
import { RANK_STYLES } from "@/lib/quiz/final-results";
import { transitions } from "@/lib/theme/animations";
import { useRetentionStore } from "@/store/retention";
import type { AnswerRecord } from "@/types/quiz";
import { cn } from "@/lib/utils/cn";

type PlayerStat = {
  id: string;
  name: string;
  totalScore: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
};

type RoundSummary = {
  id: string;
  title: string;
  questionCount: number;
};

type FinalResultScreenProps = {
  mode: "solo" | "multiplayer";
  categoryLabel: string;
  categoryId: string | null;
  sessionType: "standard" | "daily" | null;
  totalRounds: number;
  players: PlayerStat[];
  answerHistory: AnswerRecord[];
  rounds: RoundSummary[];
  startedAt: number | null;
  completedAt: number | null;
  onPlayAgain: () => void;
  onTryAnotherCategory: () => void;
  onHome: () => void;
};

const contentEnter = {
  hidden: { opacity: 0, x: -18 },
  visible: { opacity: 1, x: 0 },
};

const visualEnter = {
  hidden: { opacity: 0, x: 18 },
  visible: { opacity: 1, x: 0 },
};

function useCountUp(target: number, durationMs = 750) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) {
      queueMicrotask(() => setValue(0));
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

function StatRow({
  label,
  value,
  valueClassName,
  delay = 0,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...transitions.fast, delay }}
      className="flex items-center justify-between gap-4 border-b border-dark/8 py-4 last:border-0 last:pb-0 first:pt-0"
    >
      <span className="font-body text-sm font-semibold text-dark/55 sm:text-base">{label}</span>
      <span className={cn("font-display text-xl font-extrabold sm:text-2xl", valueClassName)}>
        {value}
      </span>
    </motion.div>
  );
}

function ActionCard({
  title,
  description,
  variant = "default",
  onClick,
}: {
  title: string;
  description: string;
  variant?: "primary" | "default";
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={transitions.micro}
      style={{ willChange: "transform" }}
      className={cn(
        "w-full rounded-2xl border-[3px] p-4 text-left transition-shadow duration-200 sm:p-5",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/40",
        variant === "primary"
          ? "border-pink bg-pink/12 shadow-[0_8px_28px_rgba(251,100,208,0.2)] hover:shadow-[0_12px_32px_rgba(251,100,208,0.28)]"
          : "border-dark/10 bg-white/85 shadow-[0_6px_20px_rgba(26,26,46,0.06)] hover:shadow-[0_10px_28px_rgba(26,26,46,0.1)]",
      )}
    >
      <p className="font-display text-base font-extrabold text-dark sm:text-lg">{title}</p>
      <p className="mt-1 font-body text-sm font-semibold text-dark/55">{description}</p>
    </motion.button>
  );
}

function AchievementBadge({
  achievement,
  index,
  isNew,
}: {
  achievement: { title: string; description: string };
  index: number;
  isNew?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...transitions.fast, delay: 0.2 + index * 0.08 }}
      className="rounded-2xl border-2 border-lime/35 bg-lime/10 px-4 py-3"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-sm font-extrabold text-dark">{achievement.title}</p>
        {isNew ? (
          <span className="rounded-full bg-lime/25 px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide text-dark/70">
            New
          </span>
        ) : null}
      </div>
      <p className="mt-1 font-body text-xs font-semibold text-dark/60 sm:text-sm">
        {achievement.description}
      </p>
    </motion.div>
  );
}

function MultiplayerRanking({ players }: { players: PlayerStat[] }) {
  const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="space-y-3">
      {sorted.map((player, index) => {
        const rankStyle = RANK_STYLES[index] ?? {
          label: `${index + 1}th`,
          border: "border-dark/10",
          bg: "bg-white/70",
          badge: "bg-dark/10 text-dark",
        };
        const isWinner = index === 0;

        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitions.fast, delay: 0.1 + index * 0.06 }}
            className={cn(
              "flex items-center justify-between gap-4 rounded-2xl border-[3px] px-4 py-4 sm:px-5",
              rankStyle.border,
              rankStyle.bg,
              isWinner && "shadow-[0_10px_32px_rgba(226,239,95,0.25)]",
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-extrabold",
                  rankStyle.badge,
                )}
              >
                {rankStyle.label}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-extrabold text-dark">
                  {player.name}
                  {isWinner && (
                    <span className="ml-2 font-body text-xs font-bold uppercase tracking-wide text-lime">
                      Winner
                    </span>
                  )}
                </p>
                <p className="font-body text-sm font-semibold text-dark/55">
                  {player.correctAnswers}/{player.totalQuestions} correct · {player.accuracy}%
                </p>
              </div>
            </div>
            <p className="shrink-0 font-display text-xl font-extrabold text-pink sm:text-2xl">
              {player.totalScore} pts
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

export function FinalResultScreen({
  mode,
  categoryLabel,
  categoryId,
  sessionType,
  totalRounds,
  players,
  answerHistory,
  rounds,
  startedAt,
  completedAt,
  onPlayAgain,
  onTryAnotherCategory,
  onHome,
}: FinalResultScreenProps) {
  const { showToast } = useToast();
  const recordQuizCompletion = useRetentionStore((state) => state.recordQuizCompletion);
  const unlockedBeforeRef = useRef(useRetentionStore.getState().unlockedAchievements);
  const recordedRef = useRef(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const featuredPlayer = sorted[0];
  const rank = featuredPlayer ? getKnowledgeRank(featuredPlayer.accuracy) : null;
  const showConfetti = Boolean(featuredPlayer && featuredPlayer.accuracy >= 75);

  const sessionAchievementIds =
    featuredPlayer == null
      ? []
      : evaluateSessionAchievements({
          playerId: featuredPlayer.id,
          categoryId,
          accuracy: featuredPlayer.accuracy,
          answerHistory,
          rounds,
          startedAt,
          completedAt,
        });

  const sessionAchievements = getAchievementDefinitions(sessionAchievementIds);

  const persistedAchievements = useRetentionStore((state) => state.unlockedAchievements);
  const fallbackAchievements = useMemo(
    () => getAchievementDefinitions(persistedAchievements).slice(-3),
    [persistedAchievements],
  );

  const displayAchievements =
    sessionAchievements.length > 0 ? sessionAchievements : fallbackAchievements;

  useEffect(() => {
    if (recordedRef.current || !featuredPlayer || !completedAt) return;
    recordedRef.current = true;

    const newlyUnlockedAchievementIds = sessionAchievementIds.filter(
      (id) => !unlockedBeforeRef.current.includes(id),
    );

    recordQuizCompletion({
      newlyUnlockedAchievementIds,
      isDailyChallenge: sessionType === "daily",
      playedDate: getLocalDateKey(new Date(completedAt)),
    });
  }, [
    featuredPlayer,
    completedAt,
    sessionAchievementIds,
    sessionType,
    recordQuizCompletion,
  ]);

  const animatedScore = useCountUp(featuredPlayer?.totalScore ?? 0, 800);
  const animatedAccuracy = useCountUp(featuredPlayer?.accuracy ?? 0, 800);
  const animatedCorrect = useCountUp(featuredPlayer?.correctAnswers ?? 0, 700);

  const handleShare = () => {
    if (!featuredPlayer || !rank) return;
    setIsShareOpen(true);
  };

  return (
    <div className="relative mx-auto w-full max-w-[75rem] py-3 sm:py-5">
      {featuredPlayer && rank ? (
        <ShareResultModal
          open={isShareOpen}
          score={featuredPlayer.totalScore}
          rankTitle={rank.title}
          category={categoryId ?? "mixed"}
          onClose={() => setIsShareOpen(false)}
          onCopied={() => showToast("Copied to clipboard!")}
          onShareError={(message) => showToast(message)}
        />
      ) : null}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-52 overflow-hidden">
          <QuizConfetti active />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-10 xl:gap-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentEnter}
          transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 order-1 flex flex-col"
          style={{ willChange: "transform, opacity" }}
        >
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-pink sm:text-sm">
            Quiz Complete
          </p>

          <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-dark sm:text-4xl lg:text-5xl">
            {mode === "multiplayer" ? "Final Standings" : "Challenge Complete"}
          </h2>

          <p className="mt-2 font-display text-xl font-bold text-dark/75 sm:text-2xl">
            {categoryLabel}
          </p>

          {rank && (
            <div
              className={cn(
                "mt-5 inline-flex w-fit flex-col rounded-2xl border-2 px-4 py-3 sm:px-5 sm:py-4",
                getKnowledgeRankStyle(rank.tier),
              )}
            >
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.18em] text-dark/50 sm:text-xs">
                Knowledge Rank
              </p>
              <p className="mt-1 font-display text-xl font-extrabold sm:text-2xl">{rank.title}</p>
            </div>
          )}

          <p className="mt-4 max-w-xl font-body text-base font-semibold leading-relaxed text-dark/60 sm:text-lg">
            {mode === "multiplayer" && featuredPlayer
              ? `${featuredPlayer.name} takes the crown. ${rank?.message ?? ""}`
              : rank?.message}
          </p>

          {displayAchievements.length > 0 && (
            <div className="mt-6 space-y-2.5 sm:mt-7">
              <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-dark/45">
                Achievements
              </p>
              {displayAchievements.map((achievement, index) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  index={index}
                  isNew={sessionAchievementIds.includes(achievement.id)}
                />
              ))}
            </div>
          )}

          {mode === "multiplayer" && (
            <div className="mt-6 lg:hidden">
              <p className="mb-3 font-display text-xs font-bold uppercase tracking-[0.18em] text-dark/45">
                Final Ranking
              </p>
              <MultiplayerRanking players={players} />
            </div>
          )}

          <div className="mt-7 grid gap-3 sm:mt-8">
            <ActionCard
              title="Play Again"
              description={
                mode === "solo"
                  ? "Jump straight back into the same category."
                  : "Set up a rematch with your crew."
              }
              variant="primary"
              onClick={onPlayAgain}
            />
            {mode === "solo" && sessionType !== "daily" && (
              <ActionCard
                title="Try Another Category"
                description="Pick a new challenge and keep the streak going."
                onClick={onTryAnotherCategory}
              />
            )}
            <ActionCard
              title="Share Result"
              description="Challenge friends with your score and rank."
              onClick={handleShare}
            />
            <ActionCard
              title="Home"
              description="Return to the PlayTrivia homepage."
              onClick={onHome}
            />
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={visualEnter}
          transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1], delay: 0.06 }}
          className="relative z-10 order-2"
          style={{ willChange: "transform, opacity" }}
        >
          {mode === "multiplayer" ? (
            <div className="hidden lg:block">
              <p className="mb-4 font-display text-xs font-bold uppercase tracking-[0.18em] text-dark/45">
                Final Ranking
              </p>
              <MultiplayerRanking players={players} />
            </div>
          ) : null}

          {featuredPlayer && (
            <div
              className={cn(
                "rounded-3xl border-[3px] border-dark/10 bg-white/90 p-5 shadow-[0_12px_40px_rgba(26,26,46,0.08)] sm:p-7",
                mode === "multiplayer" && "mt-0 lg:mt-6",
              )}
            >
              <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-dark/45 sm:text-sm">
                {mode === "multiplayer" ? "Winner Stats" : "Final Results"}
              </p>

              <div className="mt-4 sm:mt-5">
                <StatRow
                  label="Final Score"
                  value={`${animatedScore} pts`}
                  valueClassName="text-pink"
                  delay={0.08}
                />
                <StatRow
                  label="Accuracy"
                  value={`${animatedAccuracy}%`}
                  valueClassName="text-dark"
                  delay={0.14}
                />
                <StatRow
                  label="Correct Answers"
                  value={`${animatedCorrect} / ${featuredPlayer.totalQuestions}`}
                  valueClassName="text-dark"
                  delay={0.2}
                />
                <StatRow
                  label="Rounds Completed"
                  value={`${totalRounds} / ${totalRounds}`}
                  valueClassName="text-dark"
                  delay={0.26}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
