export const RETENTION_STORAGE_KEY = "quizverse-retention";

export type LatestAchievement = {
  id: string;
  title: string;
  unlockedAt: number;
};

export type RetentionState = {
  lastPlayedDate: string | null;
  currentStreak: number;
  unlockedAchievements: string[];
  dailyChallengeCompletedDate: string | null;
  latestAchievement: LatestAchievement | null;
};

export type RetentionActions = {
  recordQuizCompletion: (input: {
    newlyUnlockedAchievementIds: string[];
    isDailyChallenge?: boolean;
    playedDate?: string;
  }) => void;
  hydrate: () => void;
};

export type RetentionStore = RetentionState & RetentionActions;

export const initialRetentionState: RetentionState = {
  lastPlayedDate: null,
  currentStreak: 0,
  unlockedAchievements: [],
  dailyChallengeCompletedDate: null,
  latestAchievement: null,
};
