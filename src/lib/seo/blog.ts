import type { Metadata } from "next";
import type { BlogPost } from "@/content/blog";
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

export function buildBlogArticleMetadata(post: BlogPost): Metadata {
  const path = `/blog/${post.slug}`;
  const fullTitle = `${post.title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description: post.description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title: fullTitle,
      description: post.description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: "en_US",
      type: "article",
      publishedTime: post.publishedAt,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: post.description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}
