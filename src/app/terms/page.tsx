import { Header, PageContainer } from "@/components/layout";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/seo/site";

export const metadata = buildPageMetadata({
  title: "Terms of Use",
  description: `Terms of use for ${SITE_NAME}. Free to play, for personal entertainment.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Header />
      <PageContainer narrow className="pb-16">
        <h1 className="font-display text-3xl font-extrabold text-dark sm:text-4xl">Terms of Use</h1>
        <p className="mt-2 font-body text-sm font-semibold text-dark/50">Last updated: June 2026</p>

        <div className="mt-8 space-y-6 font-body text-base leading-relaxed text-dark/80">
          <section>
            <h2 className="font-display text-xl font-bold text-dark">Acceptance</h2>
            <p className="mt-2">
              By using {SITE_NAME}, you agree to these terms. If you do not agree, please do not use
              the site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-dark">Use of the game</h2>
            <p className="mt-2">
              {SITE_NAME} is provided free of charge for personal, non-commercial entertainment.
              Question content is for educational and fun purposes — we do not guarantee every
              answer is error-free.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-dark">No warranty</h2>
            <p className="mt-2">
              The game is offered &ldquo;as is&rdquo; without warranties of any kind. We may update,
              pause, or discontinue features at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-dark">Limitation of liability</h2>
            <p className="mt-2">
              {SITE_NAME} and its operators are not liable for any damages arising from use of the
              site or reliance on quiz content.
            </p>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
