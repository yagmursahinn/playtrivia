export const SITE_NAME = "PlayTrivia";

export const SITE_TAGLINE = "Challenge Your Knowledge";

export const SITE_DEFAULT_TITLE = `${SITE_NAME} - ${SITE_TAGLINE}`;

export const SITE_DESCRIPTION =
  "Play exciting trivia quizzes across Science, Geography, History and General Knowledge. Four unique rounds. Endless fun.";

/** Canonical production domain when NEXT_PUBLIC_SITE_URL is unset (e.g. local builds). */
export const PRODUCTION_SITE_URL = "https://play-trivia.fun";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return PRODUCTION_SITE_URL;
}

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}
