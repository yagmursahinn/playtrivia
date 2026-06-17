import { CATEGORY_LANDING_SLUGS } from "./categories";

export const PUBLIC_SITEMAP_PATHS = [
  "/",
  ...CATEGORY_LANDING_SLUGS.map((slug) => `/${slug}`),
  "/daily-challenge",
] as const;
