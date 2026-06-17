import Link from "next/link";
import { Header, PageContainer } from "@/components/layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/Icon";
import {
  getCategoryLandingConfig,
  getCategoryLandingStats,
  ROUND_DEFINITIONS,
  type CategoryLandingSlug,
} from "@/lib/seo/categories";
import { buildCategoryGameJsonLd } from "@/lib/seo/structured-data";
import { getPlayPath } from "@/lib/quiz/routes";
import { colorVariants, type ThemeColor } from "@/lib/theme/colors";
import { cn } from "@/lib/utils/cn";

type CategoryLandingPageProps = {
  slug: CategoryLandingSlug;
};

const accentRing: Record<ThemeColor, string> = {
  pink: "border-pink/60 bg-pink/10",
  blue: "border-blue/60 bg-blue/10",
  lime: "border-lime/70 bg-lime/15",
  cream: "border-dark/25 bg-cream/70",
  dark: "border-dark/40 bg-dark/5",
};

function StatPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border-2 border-dark/10 bg-white/80 px-3 py-1.5 font-body text-xs font-bold text-dark/70 sm:text-sm">
      {label}
    </span>
  );
}

export function CategoryLandingPage({ slug }: CategoryLandingPageProps) {
  const config = getCategoryLandingConfig(slug);
  if (!config) return null;

  const stats = getCategoryLandingStats(config.categoryId);
  const accent = colorVariants[config.accent];
  const gameJsonLd = buildCategoryGameJsonLd(slug);

  return (
    <>
      {gameJsonLd ? <JsonLd data={gameJsonLd} /> : null}
      <Header />
      <PageContainer className="max-w-4xl">
        <section className="rounded-[2rem] border-[3px] border-dark/10 bg-white/80 p-6 shadow-[0_16px_48px_rgba(26,26,46,0.08)] sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                "mb-4 flex h-20 w-20 items-center justify-center rounded-[1.35rem] border-[3px]",
                accentRing[config.accent],
              )}
              style={{ boxShadow: `0 8px 24px ${accent.shadow}` }}
            >
              <Icon name={config.icon} size="lg" />
            </div>

            <h1 className="font-display text-4xl font-extrabold text-dark sm:text-5xl">
              {config.headline}
            </h1>
            <p className="mt-4 max-w-2xl font-body text-base font-semibold leading-relaxed text-dark/60 sm:text-lg">
              {config.description}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <StatPill label={stats.questionCountLabel} />
              <StatPill label={stats.roundCountLabel} />
              <StatPill label={stats.priceLabel} />
              <StatPill label={`${config.difficulty} Difficulty`} />
            </div>

            <Link
              href={getPlayPath(config.categoryId)}
              className="mt-8 inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-pink px-8 py-4 font-display text-lg font-extrabold text-dark shadow-[0_6px_0_0_#e040b8,0_12px_24px_rgba(251,100,208,0.35)] transition-transform hover:translate-y-0.5"
            >
              Start Quiz
            </Link>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl font-extrabold text-dark">Quiz Rounds</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ROUND_DEFINITIONS.map((round) => (
              <article
                key={round.id}
                className="rounded-2xl border-2 border-dark/10 bg-white/80 p-4"
              >
                <p className="font-display text-base font-extrabold text-dark">
                  Round {round.number} — {round.title}
                </p>
                <p className="mt-1 font-body text-sm font-semibold text-dark/55">
                  {round.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-2xl font-extrabold text-dark">Topics Covered</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {config.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border-2 border-blue/20 bg-blue/10 px-3 py-1 font-body text-sm font-semibold text-dark/70"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>
      </PageContainer>
    </>
  );
}
