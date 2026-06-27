export type BlogCategory = "science" | "geography" | "history" | "general-knowledge";

export type BlogQuizPage =
  | "/science"
  | "/geography"
  | "/history"
  | "/general-knowledge"
  | "/solo";

export type BlogFaqItem = {
  question: string;
  answer: string;
};

/** Editorial metadata — single source of truth in registry.ts */
export type BlogArticleMeta = {
  slug: string;
  title: string;
  description: string;
  /** Optional shorter title for metadata (keep under ~60 chars with site name). */
  seoTitle?: string;
  category: BlogCategory;
  keywords: string[];
  publishDate: string;
  featured: boolean;
  relatedArticles: string[];
  quizPage: BlogQuizPage;
  /** Optional CTA overrides for flagship articles */
  ctaHeadline?: string;
  ctaLinkText?: string;
};

/** Structured article body sections (reusable template) */
export type BlogArticleSections = {
  introduction: string;
  mainContent: string;
  triviaTips: string;
  faq?: BlogFaqItem[];
};

/** Fully resolved article ready for rendering */
export type BlogArticle = BlogArticleMeta & {
  readingTime: number;
  sections: BlogArticleSections;
  content: string;
  faq?: BlogFaqItem[];
};

/** @deprecated Use BlogArticle — kept for gradual migration */
export type BlogPost = Pick<BlogArticle, "slug" | "title" | "description" | "content"> & {
  publishedAt: string;
};
