"use client";

import { useMemo } from "react";
import {
  DAILY_CHALLENGE_QUESTION_COUNT,
  isDailyChallengeCompleted,
} from "@/lib/retention/daily-challenge";
import { getLocalDateKey } from "@/lib/retention/date";
import { getAchievementDefinition } from "@/lib/retention/achievements";
import { useRetentionStore } from "@/store/retention";

export function useRetentionSummary() {
  const lastPlayedDate = useRetentionStore((state) => state.lastPlayedDate);
  const currentStreak = useRetentionStore((state) => state.currentStreak);
  const unlockedAchievements = useRetentionStore((state) => state.unlockedAchievements);
  const dailyChallengeCompletedDate = useRetentionStore(
    (state) => state.dailyChallengeCompletedDate,
  );
  const latestAchievement = useRetentionStore((state) => state.latestAchievement);

  const todayKey = getLocalDateKey();

  return useMemo(
    () => ({
      currentStreak,
      lastPlayedDate,
      unlockedAchievements,
      dailyChallengeCompleted: isDailyChallengeCompleted(dailyChallengeCompletedDate, todayKey),
      dailyChallengeQuestionCount: DAILY_CHALLENGE_QUESTION_COUNT,
      latestAchievement: latestAchievement
        ? {
            ...latestAchievement,
            description:
              getAchievementDefinition(latestAchievement.id)?.description ??
              "Achievement unlocked",
          }
        : null,
    }),
    [
      currentStreak,
      lastPlayedDate,
      unlockedAchievements,
      dailyChallengeCompletedDate,
      latestAchievement,
      todayKey,
    ],
  );
}
