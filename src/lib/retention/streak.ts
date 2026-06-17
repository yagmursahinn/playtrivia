import { getLocalDateKey } from "./date";

export function calculateStreakUpdate(
  lastPlayedDate: string | null,
  currentStreak: number,
  playedDate = getLocalDateKey(),
): { lastPlayedDate: string; currentStreak: number } {
  if (lastPlayedDate === playedDate) {
    return { lastPlayedDate, currentStreak };
  }

  if (!lastPlayedDate) {
    return { lastPlayedDate: playedDate, currentStreak: 1 };
  }

  const previous = new Date(`${lastPlayedDate}T12:00:00`);
  const current = new Date(`${playedDate}T12:00:00`);
  const dayDiff = Math.round((current.getTime() - previous.getTime()) / (24 * 60 * 60 * 1000));

  if (dayDiff === 1) {
    return { lastPlayedDate: playedDate, currentStreak: currentStreak + 1 };
  }

  return { lastPlayedDate: playedDate, currentStreak: 1 };
}
