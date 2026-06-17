import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getAchievementDefinition } from "@/lib/retention/achievements";
import { getLocalDateKey } from "@/lib/retention/date";
import { calculateStreakUpdate } from "@/lib/retention/streak";
import {
  initialRetentionState,
  RETENTION_STORAGE_KEY,
  type RetentionStore,
} from "./types";

export const useRetentionStore = create<RetentionStore>()(
  persist(
    (set, get) => ({
      ...initialRetentionState,

      hydrate: () => {
        set(get());
      },

      recordQuizCompletion: ({
        newlyUnlockedAchievementIds,
        isDailyChallenge = false,
        playedDate = getLocalDateKey(),
      }) => {
        const state = get();
        const streakUpdate = calculateStreakUpdate(
          state.lastPlayedDate,
          state.currentStreak,
          playedDate,
        );

        const mergedAchievements = [...state.unlockedAchievements];
        let latestAchievement = state.latestAchievement;

        for (const achievementId of newlyUnlockedAchievementIds) {
          if (mergedAchievements.includes(achievementId)) continue;
          mergedAchievements.push(achievementId);

          const definition = getAchievementDefinition(achievementId);
          if (definition) {
            latestAchievement = {
              id: definition.id,
              title: definition.title,
              unlockedAt: Date.now(),
            };
          }
        }

        set({
          ...streakUpdate,
          unlockedAchievements: mergedAchievements,
          latestAchievement,
          dailyChallengeCompletedDate: isDailyChallenge
            ? playedDate
            : state.dailyChallengeCompletedDate,
        });
      },
    }),
    {
      name: RETENTION_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lastPlayedDate: state.lastPlayedDate,
        currentStreak: state.currentStreak,
        unlockedAchievements: state.unlockedAchievements,
        dailyChallengeCompletedDate: state.dailyChallengeCompletedDate,
        latestAchievement: state.latestAchievement,
      }),
    },
  ),
);
