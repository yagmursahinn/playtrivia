import { geographyQuizQuestions } from "./posts/geography-quiz-questions";
import { famousExplorersTriviaQuestions } from "./posts/famous-explorers-trivia-questions";
import { funTriviaQuestions } from "./posts/fun-trivia-questions";
import { generalKnowledgeQuizQuestions } from "./posts/general-knowledge-quiz-questions";
import { historyQuizQuestions } from "./posts/history-quiz-questions";
import { scienceQuizQuestions } from "./posts/science-quiz-questions";
import { top20GeographyTriviaQuestions } from "./posts/top-20-geography-trivia-questions";
import { getBlogArticleMeta, getRelatedArticleMeta } from "./registry";
import type { BlogArticle, BlogArticleMeta, BlogArticleSections, BlogPost } from "./types";

export { BLOG_ARTICLE_REGISTRY, BLOG_ARTICLE_REGISTRY_BY_SLUG, getBlogArticleMeta, getRelatedArticleMeta } from "./registry";
export { BLOG_CATEGORIES, getBlogCategoryConfig } from "./categories";
export { buildArticleContent, defineBlogArticle, estimateReadingTime } from "./template";
export type {
  BlogArticle,
  BlogArticleMeta,
  BlogArticleSections,
  BlogCategory,
  BlogFaqItem,
  BlogPost,
  BlogQuizPage,
} from "./types";

const BLOG_ARTICLES: BlogArticle[] = [
  funTriviaQuestions,
  historyQuizQuestions,
  geographyQuizQuestions,
  generalKnowledgeQuizQuestions,
  scienceQuizQuestions,
  famousExplorersTriviaQuestions,
  top20GeographyTriviaQuestions,
];

/** All published articles — featured first, then newest by publish date. */
export function getAllBlogArticles(): BlogArticle[] {
  return [...BLOG_ARTICLES].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });
}

export function getBlogArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_ARTICLES.map((article) => article.slug);
}

export function getBlogPostPath(slug: string): `/blog/${string}` {
  return `/blog/${slug}`;
}

export function getRelatedArticlesForSlug(slug: string): BlogArticleMeta[] {
  const meta = getBlogArticleMeta(slug);
  if (!meta) return [];
  return getRelatedArticleMeta(meta.relatedArticles);
}

/** @deprecated Use getAllBlogArticles */
export function getAllBlogPosts(): BlogPost[] {
  return getAllBlogArticles().map(toBlogPost);
}

/** @deprecated Use getBlogArticleBySlug */
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const article = getBlogArticleBySlug(slug);
  return article ? toBlogPost(article) : undefined;
}

function toBlogPost(article: BlogArticle): BlogPost {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    content: article.content,
    publishedAt: article.publishDate,
  };
}
