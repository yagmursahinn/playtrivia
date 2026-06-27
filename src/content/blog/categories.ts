import type { BlogCategory, BlogQuizPage } from "./types";

export type BlogCategoryConfig = {
  id: BlogCategory;
  label: string;
  quizPage: BlogQuizPage;
  quizLabel: string;
};

export const BLOG_CATEGORIES: Record<BlogCategory, BlogCategoryConfig> = {
  science: {
    id: "science",
    label: "Science",
    quizPage: "/science",
    quizLabel: "Science Quiz",
  },
  geography: {
    id: "geography",
    label: "Geography",
    quizPage: "/geography",
    quizLabel: "Geography Quiz",
  },
  history: {
    id: "history",
    label: "History",
    quizPage: "/history",
    quizLabel: "History Quiz",
  },
  "general-knowledge": {
    id: "general-knowledge",
    label: "General Knowledge",
    quizPage: "/general-knowledge",
    quizLabel: "General Knowledge Quiz",
  },
};

export function getBlogCategoryConfig(category: BlogCategory): BlogCategoryConfig {
  return BLOG_CATEGORIES[category];
}
