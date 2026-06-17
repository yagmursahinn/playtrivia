import type { Metadata } from "next";
import { getCategoryLandingConfig, type CategoryLandingSlug } from "./categories";
import {
  absoluteUrl,
  getSiteUrl,
  SITE_DEFAULT_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "./site";

/** Shared 1200×630 social preview — resolved via metadataBase. */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} - ${SITE_TAGLINE}`,
  type: "image/png",
} as const;

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

function buildSocialMetadata(input: PageMetadataInput): Pick<
  Metadata,
  "alternates" | "openGraph" | "twitter"
> {
  return {
    alternates: {
      canonical: absoluteUrl(input.path),
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: absoluteUrl(input.path),
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [DEFAULT_OG_IMAGE.url],
    },
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
    ...buildSocialMetadata({ ...input, title: fullTitle }),
  };
}

export function buildHomeMetadata(): Metadata {
  return buildPageMetadata({
    title: SITE_DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    path: "/",
    keywords: [
      "quiz",
      "trivia",
      "free quiz",
      "multiplayer quiz",
      "daily challenge",
      "science quiz",
      "geography quiz",
      "history quiz",
    ],
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
    keywords: [
      config.title.toLowerCase(),
      "free quiz",
      "trivia",
      ...config.topics.map((t) => t.toLowerCase()),
    ],
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

export function buildRootLayoutMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: SITE_DEFAULT_TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    ...buildSocialMetadata({
      title: SITE_DEFAULT_TITLE,
      description: SITE_DESCRIPTION,
      path: "/",
    }),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/site.webmanifest",
    appleWebApp: {
      capable: true,
      title: SITE_NAME,
      statusBarStyle: "default",
    },
  };
}
