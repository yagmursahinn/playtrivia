import type { BlogArticleMeta } from "./types";

/**
 * Central metadata registry for every published blog article.
 * To add a new article: add an entry here + a sections file in posts/.
 */
export const BLOG_ARTICLE_REGISTRY: BlogArticleMeta[] = [
  {
    slug: "fun-trivia-questions",
    title: "100 Fun Trivia Questions (With Answers)",
    seoTitle: "100 Fun Trivia Questions",
    description:
      "One hundred fun trivia questions with answers for families, quiz nights, and classrooms — science, geography, history, animals, space, food, and pop culture.",
    category: "general-knowledge",
    keywords: [
      "fun trivia questions",
      "trivia questions and answers",
      "family trivia",
      "quiz night questions",
      "fun quiz questions",
      "easy trivia",
      "trivia for friends",
    ],
    publishDate: "2025-06-28",
    featured: false,
    relatedArticles: [
      "general-knowledge-quiz-questions",
      "science-quiz-questions",
      "geography-quiz-questions",
      "history-quiz-questions",
    ],
    quizPage: "/general-knowledge",
    ctaHeadline: "Ready for even more questions?",
    ctaLinkText: "Play PlayTrivia",
  },
  {
    slug: "history-quiz-questions",
    title: "Top 50 History Quiz Questions (With Answers)",
    seoTitle: "Top 50 History Quiz Questions",
    description:
      "Fifty history quiz questions with answers — ancient civilisations, world wars, leaders, and explorers. Easy to hard trivia for students and quiz nights.",
    category: "history",
    keywords: [
      "history quiz questions",
      "history quiz",
      "history trivia",
      "world history quiz",
      "ancient history questions",
      "world war quiz",
      "history quiz for students",
    ],
    publishDate: "2025-06-27",
    featured: true,
    relatedArticles: [
      "general-knowledge-quiz-questions",
      "geography-quiz-questions",
      "science-quiz-questions",
    ],
    quizPage: "/history",
    ctaHeadline: "Ready to test yourself?",
    ctaLinkText: "Play the History Quiz",
  },
  {
    slug: "geography-quiz-questions",
    title: "Top 50 Geography Quiz Questions (With Answers)",
    seoTitle: "Top 50 Geography Quiz Questions",
    description:
      "Fifty geography quiz questions with answers — capitals, countries, rivers, landmarks, and flags. Easy to hard trivia for quiz nights. Play free on PlayTrivia.",
    category: "geography",
    keywords: [
      "geography quiz questions",
      "geography quiz",
      "geography trivia",
      "world capitals quiz",
      "country quiz",
      "flags quiz",
      "landmarks quiz",
    ],
    publishDate: "2025-06-26",
    featured: true,
    relatedArticles: ["general-knowledge-quiz-questions", "science-quiz-questions", "history-quiz-questions"],
    quizPage: "/geography",
    ctaHeadline: "Ready to test yourself?",
    ctaLinkText: "Play the Geography Quiz",
  },
  {
    slug: "general-knowledge-quiz-questions",
    title: "Top 50 General Knowledge Quiz Questions (With Answers)",
    seoTitle: "Top 50 General Knowledge Quiz Questions",
    description:
      "Fifty general knowledge quiz questions with answers — easy, medium, and hard trivia for adults. Perfect for pub quizzes, family nights, or playing free online.",
    category: "general-knowledge",
    keywords: [
      "general knowledge quiz questions",
      "general knowledge quiz",
      "trivia questions and answers",
      "pub quiz questions",
      "easy trivia",
      "hard trivia questions",
    ],
    publishDate: "2025-06-24",
    featured: true,
    relatedArticles: [
      "fun-trivia-questions",
      "science-quiz-questions",
      "geography-quiz-questions",
      "history-quiz-questions",
    ],
    quizPage: "/general-knowledge",
    ctaHeadline: "Ready for a real challenge?",
    ctaLinkText: "Play the General Knowledge Quiz",
  },
  {
    slug: "science-quiz-questions",
    title: "Top 50 Science Quiz Questions (With Answers)",
    seoTitle: "Top 50 Science Quiz Questions",
    description:
      "Fifty science quiz questions with answers — easy, medium, and hard. Biology, chemistry, physics, and space trivia. Play free on PlayTrivia.",
    category: "science",
    keywords: [
      "science quiz questions",
      "science quiz",
      "science trivia",
      "biology quiz",
      "chemistry questions",
      "physics trivia",
      "space quiz",
    ],
    publishDate: "2025-06-25",
    featured: true,
    relatedArticles: [
      "general-knowledge-quiz-questions",
      "geography-quiz-questions",
      "history-quiz-questions",
    ],
    quizPage: "/science",
    ctaHeadline: "Ready to test yourself?",
    ctaLinkText: "Play the Science Quiz",
  },
  {
    slug: "famous-explorers-trivia-questions",
    title: "15 Famous Explorers Trivia Questions",
    description:
      "Explore history through famous explorers, voyages, discoveries, and world-changing journeys.",
    category: "history",
    keywords: [
      "explorer trivia",
      "famous explorers",
      "history quiz",
      "age of discovery",
      "exploration history",
    ],
    publishDate: "2025-06-22",
    featured: false,
    relatedArticles: [
      "top-20-geography-trivia-questions",
      "history-quiz-questions",
      "science-quiz-questions",
    ],
    quizPage: "/history",
  },
  {
    slug: "top-20-geography-trivia-questions",
    title: "Top 20 Geography Trivia Questions",
    description:
      "Test your knowledge of countries, capitals, landmarks, rivers, mountains, and world geography with these fun trivia questions.",
    category: "geography",
    keywords: [
      "geography trivia",
      "geography quiz",
      "world capitals",
      "country quiz",
      "landmarks quiz",
    ],
    publishDate: "2025-06-21",
    featured: true,
    relatedArticles: [
      "famous-explorers-trivia-questions",
      "science-quiz-questions",
    ],
    quizPage: "/geography",
  },
];

export const BLOG_ARTICLE_REGISTRY_BY_SLUG: Record<string, BlogArticleMeta> =
  Object.fromEntries(BLOG_ARTICLE_REGISTRY.map((entry) => [entry.slug, entry]));

export function getBlogArticleMeta(slug: string): BlogArticleMeta | undefined {
  return BLOG_ARTICLE_REGISTRY_BY_SLUG[slug];
}

export function getRelatedArticleMeta(slugs: string[]): BlogArticleMeta[] {
  return slugs
    .map((slug) => BLOG_ARTICLE_REGISTRY_BY_SLUG[slug])
    .filter((entry): entry is BlogArticleMeta => entry !== undefined);
}
