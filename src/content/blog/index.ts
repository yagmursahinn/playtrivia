import { famousExplorersTriviaQuestions } from "./posts/famous-explorers-trivia-questions";
import { scienceQuizQuestions } from "./posts/science-quiz-questions";
import { top20GeographyTriviaQuestions } from "./posts/top-20-geography-trivia-questions";
import type { BlogPost } from "./types";

const BLOG_POSTS: BlogPost[] = [
  scienceQuizQuestions,
  famousExplorersTriviaQuestions,
  top20GeographyTriviaQuestions,
];

function sortByPublishedAtDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getAllBlogPosts(): BlogPost[] {
  return sortByPublishedAtDesc(BLOG_POSTS);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}

export function getBlogPostPath(slug: string): `/blog/${string}` {
  return `/blog/${slug}`;
}

export type { BlogPost } from "./types";
