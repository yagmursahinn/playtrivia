import Link from "next/link";
import { Header, PageContainer } from "@/components/layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { DAILY_CHALLENGE_QUESTION_COUNT } from "@/lib/retention/daily-challenge";
import { getDailyChallengePath } from "@/lib/quiz/routes";
import { buildDailyChallengeGameJsonLd } from "@/lib/seo/structured-data";

function StatPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border-2 border-dark/10 bg-white/80 px-3 py-1.5 font-body text-xs font-bold text-dark/70 sm:text-sm">
      {label}
    </span>
  );
}

export function DailyChallengeLandingPage() {
  return (
    <>
      <JsonLd data={buildDailyChallengeGameJsonLd()} />
      <Header />
      <PageContainer className="max-w-4xl">
        <section className="rounded-[2rem] border-[3px] border-dark/10 bg-white/80 p-6 text-center shadow-[0_16px_48px_rgba(26,26,46,0.08)] sm:p-8">
          <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-pink">
            Daily Challenge
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold text-dark sm:text-5xl">
            Today&apos;s Challenge
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base font-semibold leading-relaxed text-dark/60 sm:text-lg">
            One shared mixed quiz for everyone each day. Test yourself with ten questions across
            Quick Picks, Fill The Gap, List It and Picture Round.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <StatPill label={`${DAILY_CHALLENGE_QUESTION_COUNT} Questions`} />
            <StatPill label="Mixed Category" />
            <StatPill label="Resets Daily" />
            <StatPill label="Free to Play" />
          </div>

          <Link
            href={getDailyChallengePath()}
            className="mt-8 inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-pink px-8 py-4 font-display text-lg font-extrabold text-dark shadow-[0_6px_0_0_#e040b8,0_12px_24px_rgba(251,100,208,0.35)] transition-transform hover:translate-y-0.5"
          >
            Play Daily Challenge
          </Link>
        </section>
      </PageContainer>
    </>
  );
}
