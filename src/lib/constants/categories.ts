import type { Category } from "@/types";
import {
  CATEGORY_ID_TO_SLUG,
  getAllCategoryQuestionCounts,
  getCategoryQuestionCount,
} from "@/content/questions";

export const CATEGORY_DURATION_LABEL = "3–5 Minutes";
export const CATEGORY_ESTIMATED_MINUTES = 4;

export const CATEGORIES: Category[] = [
  {
    id: "general",
    label: "General Knowledge",
    icon: "general-knowledge",
    description: "A bit of everything",
    accent: "pink",
  },
  {
    id: "science",
    label: "Science",
    icon: "science",
    description: "Facts, formulas & discovery",
    accent: "blue",
  },
  {
    id: "geography",
    label: "Geography",
    icon: "geography",
    description: "Countries, capitals & landmarks",
    accent: "lime",
  },
  {
    id: "history",
    label: "History",
    icon: "history",
    description: "Events that shaped the world",
    accent: "blue",
  },
  {
    id: "mixed",
    label: "Mixed",
    icon: "mixed",
    description: "Surprise me with variety",
    accent: "pink",
  },
];

export function getCategoryQuestionCountById(categoryId: string): number {
  if (categoryId === "mixed") {
    return getCategoryQuestionCount("mixed");
  }

  const slug = CATEGORY_ID_TO_SLUG[categoryId as keyof typeof CATEGORY_ID_TO_SLUG];
  if (!slug) return 0;
  return getCategoryQuestionCount(slug);
}

export function getAllCategoryQuestionCountsById(): Record<string, number> {
  const bySlug = getAllCategoryQuestionCounts();
  return {
    general: bySlug["general-knowledge"],
    science: bySlug.science,
    geography: bySlug.geography,
    history: bySlug.history,
    mixed: bySlug.mixed,
  };
}
