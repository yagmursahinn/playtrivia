import type { BlogArticle, BlogFaqItem } from "@/content/blog";
import { getCategoryLandingConfig, getCategoryLandingStats, type CategoryLandingSlug } from "./categories";
import { FAQ_ITEMS } from "./faq";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "./site";

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  };
}

export function buildHomeGameJsonLd() {
  return buildGameJsonLd({
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
  });
}

export function buildGameJsonLd(input: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Game",
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

export function buildCategoryGameJsonLd(slug: CategoryLandingSlug) {
  const config = getCategoryLandingConfig(slug);
  if (!config) return null;

  const stats = getCategoryLandingStats(config.categoryId);

  return buildGameJsonLd({
    name: config.title,
    description: `${config.description} ${stats.questionCountLabel}. ${stats.roundCountLabel}. ${stats.priceLabel}.`,
    url: absoluteUrl(`/${slug}`),
  });
}

export function buildDailyChallengeGameJsonLd() {
  return buildGameJsonLd({
    name: `${SITE_NAME} Daily Challenge`,
    description: `Play today's free mixed ${SITE_NAME} challenge with ten questions that reset every day.`,
    url: absoluteUrl("/daily-challenge"),
  });
}

export function buildFaqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildHomeJsonLd() {
  return [buildWebSiteJsonLd(), buildHomeGameJsonLd(), buildFaqPageJsonLd()];
}

export function buildArticleJsonLd(article: BlogArticle) {
  const url = absoluteUrl(`/blog/${article.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishDate,
    dateModified: article.publishDate,
    url,
    keywords: article.keywords.join(", "),
    articleSection: article.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  };
}

export function buildBlogFaqJsonLd(items: BlogFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
      },
    })),
  };
}

export function buildBlogBreadcrumbJsonLd(article: BlogArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: absoluteUrl(`/blog/${article.slug}`),
      },
    ],
  };
}

export function buildOrganizationTaglineJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    description: SITE_TAGLINE,
    url: absoluteUrl("/"),
    applicationCategory: "GameApplication",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
