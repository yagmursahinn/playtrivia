import { getBlogArticleMeta } from "./registry";
import type { BlogArticle, BlogArticleSections } from "./types";

const WORDS_PER_MINUTE = 200;

export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/u).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Assembles introduction, main content, and trivia tips into renderable markdown. */
export function buildArticleContent(sections: BlogArticleSections): string {
  return [
    sections.introduction.trim(),
    sections.mainContent.trim(),
    `## Trivia Tips\n\n${sections.triviaTips.trim()}`,
  ].join("\n\n");
}

/**
 * Creates a fully resolved blog article from registry metadata + section content.
 * CTA and related-article blocks are rendered by page components, not inline.
 */
export function defineBlogArticle(
  slug: string,
  sections: BlogArticleSections,
): BlogArticle {
  const meta = getBlogArticleMeta(slug);
  if (!meta) {
    throw new Error(`Blog article "${slug}" is missing from BLOG_ARTICLE_REGISTRY.`);
  }

  const content = buildArticleContent(sections);

  return {
    ...meta,
    sections,
    content,
    readingTime: estimateReadingTime(content),
    faq: sections.faq,
  };
}
