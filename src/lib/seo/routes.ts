import { CATEGORY_LANDING_SLUGS } from "./categories";

export type SitemapEntry = {
  path: `/${string}` | "/";
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
};

const CATEGORY_SITEMAP_ENTRIES: SitemapEntry[] = CATEGORY_LANDING_SLUGS.map((slug) => ({
  path: `/${slug}`,
  changeFrequency: "monthly",
  priority: 0.85,
}));

/** Public routes included in /sitemap.xml for https://play-trivia.fun */
export const PUBLIC_SITEMAP_ENTRIES: SitemapEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/daily-challenge", changeFrequency: "daily", priority: 0.9 },
  ...CATEGORY_SITEMAP_ENTRIES,
  { path: "/solo", changeFrequency: "monthly", priority: 0.6 },
  { path: "/multiplayer", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export const PUBLIC_SITEMAP_PATHS = PUBLIC_SITEMAP_ENTRIES.map((entry) => entry.path);

export { CATEGORY_LANDING_SLUGS };
