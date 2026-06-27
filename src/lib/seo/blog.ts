import type { Metadata } from "next";
import type { BlogArticle } from "@/content/blog";
import { DEFAULT_OG_IMAGE } from "./metadata";
import { absoluteUrl, SITE_NAME } from "./site";

export function buildBlogIndexMetadata(): Metadata {
  const title = "PlayTrivia Blog";
  const description =
    "Tips, updates, and trivia insights from PlayTrivia — the free quiz platform for Science, Geography, History, and General Knowledge.";
  const path = "/blog";

  return {
    title,
    description,
    keywords: [
      "trivia blog",
      "quiz tips",
      "science trivia",
      "geography trivia",
      "history quiz",
      "general knowledge",
    ],
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export function buildBlogArticleMetadata(article: BlogArticle): Metadata {
  const path = `/blog/${article.slug}`;
  const baseTitle = article.seoTitle ?? article.title;
  const fullTitle = baseTitle.includes(SITE_NAME)
    ? baseTitle
    : `${baseTitle} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title: fullTitle,
      description: article.description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: "en_US",
      type: "article",
      publishedTime: article.publishDate,
      tags: article.keywords,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: article.description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}
