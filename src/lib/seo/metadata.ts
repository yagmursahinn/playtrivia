import type { Metadata } from "next";
import { getCategoryLandingConfig, type CategoryLandingSlug } from "./categories";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "./site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

function buildOpenGraph(input: PageMetadataInput): Metadata["openGraph"] {
  return {
    title: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  };
}

function buildTwitter(input: PageMetadataInput): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title: input.title,
    description: input.description,
    images: [absoluteUrl("/opengraph-image")],
  };
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const fullTitle = input.title.includes(SITE_NAME)
    ? input.title
    : `${input.title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical: absoluteUrl(input.path),
    },
    openGraph: buildOpenGraph({ ...input, title: fullTitle }),
    twitter: buildTwitter({ ...input, title: fullTitle }),
  };
}

export function buildHomeMetadata(): Metadata {
  return buildPageMetadata({
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    path: "/",
    keywords: ["quiz", "trivia", "free quiz", "multiplayer quiz", "daily challenge"],
  });
}

export function buildCategoryMetadata(slug: CategoryLandingSlug): Metadata {
  const config = getCategoryLandingConfig(slug);
  if (!config) {
    return buildHomeMetadata();
  }

  return buildPageMetadata({
    title: `${config.title}`,
    description: config.seoDescription,
    path: `/${slug}`,
    keywords: [config.title.toLowerCase(), "free quiz", "trivia", ...config.topics.map((t) => t.toLowerCase())],
  });
}

export function buildDailyChallengeMetadata(): Metadata {
  return buildPageMetadata({
    title: "Daily Challenge",
    description: `Play today's free mixed ${SITE_NAME} challenge. Ten questions, one shared puzzle for everyone, resets every day.`,
    path: "/daily-challenge",
    keywords: ["daily quiz", "daily challenge", "mixed trivia", "free quiz"],
  });
}
