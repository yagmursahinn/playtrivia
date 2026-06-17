import type { LeaderboardEntry } from "@/types/quiz";

/**
 * Future leaderboard integration point.
 * Replace submitToLeaderboard with an API call when backend is ready.
 */
export type LeaderboardSubmitResult = {
  success: boolean;
  entries: LeaderboardEntry[];
};

export async function submitToLeaderboard(
  entries: LeaderboardEntry[],
): Promise<LeaderboardSubmitResult> {
  return { success: true, entries };
}

export function formatLeaderboardForExport(entries: LeaderboardEntry[]) {
  return entries.map(({ playerName, rank, totalScore, mode, categoryLabel }) => ({
    rank,
    playerName,
    totalScore,
    mode,
    categoryLabel,
  }));
}
