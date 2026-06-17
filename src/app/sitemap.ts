import type { MetadataRoute } from "next";
import { PUBLIC_SITEMAP_PATHS } from "@/lib/seo/routes";
import { absoluteUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_SITEMAP_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/daily-challenge" ? 0.9 : 0.8,
  }));
}
