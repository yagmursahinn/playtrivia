import { Header, PageContainer, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Contact PlayTrivia",
  description:
    "Get in touch with PlayTrivia for feedback, bug reports, questions, and suggestions.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Header />
      <PageContainer narrow className="pb-12">
        <PageHeader
          title="Contact PlayTrivia"
          subtitle="Questions, suggestions, bug reports, or feedback are always welcome."
        />

        <div className="space-y-5 sm:space-y-6">
          <Card accent="blue" padding="lg">
            <h2 className="font-display text-xl font-extrabold text-dark sm:text-2xl">Contact</h2>
            <p className="mt-4 font-body text-base font-semibold leading-relaxed text-dark/75">
              Coming soon: Contact email
            </p>
          </Card>

          <Card accent="cream" padding="lg">
            <h2 className="font-display text-xl font-extrabold text-dark sm:text-2xl">Feedback</h2>
            <p className="mt-4 font-body text-base font-semibold leading-relaxed text-dark/75">
              If you found a bug, have an idea for a new category, or want to share feedback, feel
              free to reach out.
            </p>
          </Card>
        </div>

        <div className="mt-10 flex justify-center sm:mt-12">
          <Button href="/" variant="secondary" size="xl" className="min-w-[220px]">
            Back to Home
          </Button>
        </div>
      </PageContainer>
    </>
  );
}
