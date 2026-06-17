import { CATEGORIES } from "@/lib/constants/categories";
import type { GameMode } from "@/types/quiz";

/** URL slug → internal category id */
export const CATEGORY_SLUG_TO_ID: Record<string, string> = {
  "general-knowledge": "general",
  science: "science",
  geography: "geography",
  history: "history",
  mixed: "mixed",
};

export const PLAY_CATEGORY_SLUGS = Object.keys(CATEGORY_SLUG_TO_ID);

export function slugToCategoryId(slug: string): string | null {
  return CATEGORY_SLUG_TO_ID[slug] ?? null;
}

export function categoryIdToSlug(categoryId: string): string | null {
  const match = Object.entries(CATEGORY_SLUG_TO_ID).find(([, id]) => id === categoryId);
  return match?.[0] ?? null;
}

export function isValidCategorySlug(slug: string): boolean {
  return slug in CATEGORY_SLUG_TO_ID;
}

export function getDailyChallengePath(): string {
  return "/play/mixed?daily=1";
}

export function getResumePathForSavedProgress(saved: {
  categoryId: string;
  mode: GameMode;
  sessionType?: "standard" | "daily" | null;
}): string {
  if (saved.sessionType === "daily") {
    return getDailyChallengePath();
  }

  return getPlayPath(saved.categoryId, saved.mode === "multiplayer" ? "multiplayer" : "solo");
}

export function getPlayPath(categoryId: string, mode: "solo" | "multiplayer" = "solo"): string {
  const slug = categoryIdToSlug(categoryId);
  if (!slug) return "/solo";

  if (mode === "multiplayer") {
    return `/play/${slug}?mode=multiplayer`;
  }

  return `/play/${slug}`;
}

export function getCategoryLabel(categoryId: string, sessionType?: "standard" | "daily" | null): string {
  if (sessionType === "daily") {
    return "Daily Challenge";
  }

  return CATEGORIES.find((category) => category.id === categoryId)?.label ?? categoryId;
}
