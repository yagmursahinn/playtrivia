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
