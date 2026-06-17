import { Header, PageContainer } from "@/components/layout";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME, getSiteUrl } from "@/lib/seo/site";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles your data. No accounts, no tracking cookies — gameplay data stays in your browser.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <PageContainer narrow className="pb-16">
        <h1 className="font-display text-3xl font-extrabold text-dark sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 font-body text-sm font-semibold text-dark/50">Last updated: June 2026</p>

        <div className="mt-8 space-y-6 font-body text-base leading-relaxed text-dark/80">
          <section>
            <h2 className="font-display text-xl font-bold text-dark">Overview</h2>
            <p className="mt-2">
              {SITE_NAME} is a free browser-based trivia game. We do not require accounts, email
              addresses, or payment information to play.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-dark">Data stored on your device</h2>
            <p className="mt-2">
              Quiz progress, streaks, and achievements are saved locally in your browser using
              localStorage. This data never leaves your device unless you choose to share your
              results.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-dark">Analytics</h2>
            <p className="mt-2">
              We may use privacy-friendly analytics in the future to understand how the game is
              used. No personal information is sold or shared with third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-dark">Contact</h2>
            <p className="mt-2">
              Questions about this policy? Visit{" "}
              <a href={getSiteUrl()} className="font-semibold text-pink underline-offset-2 hover:underline">
                play-trivia.fun
              </a>
              .
            </p>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
