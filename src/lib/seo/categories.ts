import { getCategoryQuestionCountById } from "@/lib/constants/categories";
import { TOTAL_ROUNDS } from "@/lib/constants/quiz";
import { ROUND_DEFINITIONS } from "@/lib/constants/quiz";
import type { Category } from "@/types";
import { CATEGORIES } from "@/lib/constants/categories";

export const CATEGORY_LANDING_SLUGS = [
  "general-knowledge",
  "science",
  "geography",
  "history",
] as const;

export type CategoryLandingSlug = (typeof CATEGORY_LANDING_SLUGS)[number];

type CategoryLandingConfig = {
  slug: CategoryLandingSlug;
  categoryId: string;
  title: string;
  headline: string;
  description: string;
  seoDescription: string;
  topics: string[];
  difficulty: string;
  accent: Category["accent"];
  icon: Category["icon"];
};

const CATEGORY_LANDING_CONTENT: Record<CategoryLandingSlug, Omit<CategoryLandingConfig, "slug">> = {
  "general-knowledge": {
    categoryId: "general",
    title: "General Knowledge Quiz",
    headline: "General Knowledge Quiz",
    description:
      "Test your knowledge across geography, science, history, culture and technology with a balanced mix of trivia.",
    seoDescription:
      "Test your general knowledge with free quizzes covering geography, science, history, culture and technology.",
    topics: ["Geography", "Science", "History", "Culture", "Technology"],
    difficulty: "Medium",
    accent: "pink",
    icon: "general-knowledge",
  },
  science: {
    categoryId: "science",
    title: "Science Quiz",
    headline: "Science Quiz",
    description:
      "Test your knowledge of space, biology, chemistry and physics with four unique quiz rounds.",
    seoDescription:
      "Test your science knowledge with free quizzes covering space, biology, chemistry and physics.",
    topics: ["Space", "Biology", "Chemistry", "Physics", "Earth Science"],
    difficulty: "Medium",
    accent: "blue",
    icon: "science",
  },
  geography: {
    categoryId: "geography",
    title: "Geography Quiz",
    headline: "Geography Quiz",
    description:
      "Explore countries, capitals, landmarks, rivers and continents in a fast-paced geography challenge.",
    seoDescription:
      "Test your geography knowledge with free quizzes covering countries, capitals, landmarks and continents.",
    topics: ["Countries", "Capitals", "Landmarks", "Rivers", "Continents"],
    difficulty: "Medium",
    accent: "lime",
    icon: "geography",
  },
  history: {
    categoryId: "history",
    title: "History Quiz",
    headline: "History Quiz",
    description:
      "Travel through ancient civilizations, world events, inventions and iconic leaders across four rounds.",
    seoDescription:
      "Test your history knowledge with free quizzes covering ancient history, world events and inventions.",
    topics: ["Ancient History", "World Events", "Inventions", "Leaders", "Landmarks"],
    difficulty: "Medium",
    accent: "blue",
    icon: "history",
  },
};

export function isCategoryLandingSlug(slug: string): slug is CategoryLandingSlug {
  return CATEGORY_LANDING_SLUGS.includes(slug as CategoryLandingSlug);
}

export function getCategoryLandingConfig(slug: string): CategoryLandingConfig | null {
  if (!isCategoryLandingSlug(slug)) return null;
  return { slug, ...CATEGORY_LANDING_CONTENT[slug] };
}

export function getCategoryLandingStats(categoryId: string) {
  const questionCount = getCategoryQuestionCountById(categoryId);
  return {
    questionCount,
    questionCountLabel: `${questionCount}+ Questions`,
    roundCount: TOTAL_ROUNDS,
    roundCountLabel: `${TOTAL_ROUNDS} Quiz Rounds`,
    difficulty: "Medium",
    priceLabel: "Free to Play",
  };
}

export function getCategoryMetaCategory(slug: CategoryLandingSlug): Category | undefined {
  const config = getCategoryLandingConfig(slug);
  if (!config) return undefined;
  return CATEGORIES.find((category) => category.id === config.categoryId);
}

export { ROUND_DEFINITIONS };
