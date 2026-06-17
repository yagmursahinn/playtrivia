import type { MetadataRoute } from "next";
import { PUBLIC_SITEMAP_ENTRIES } from "@/lib/seo/routes";
import { absoluteUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_SITEMAP_ENTRIES.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
