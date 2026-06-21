import { Header, PageContainer, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME } from "@/lib/seo/site";

export const metadata = buildPageMetadata({
  title: "About PlayTrivia",
  description:
    "Learn more about PlayTrivia, the free quiz platform featuring trivia challenges, picture rounds, daily challenges, and multiplayer games.",
  path: "/about",
});

function SectionCard({
  title,
  children,
  accent = "cream",
}: {
  title: string;
  children: React.ReactNode;
  accent?: "pink" | "blue" | "lime" | "cream";
}) {
  return (
    <Card accent={accent} padding="lg" className="w-full">
      <h2 className="font-display text-xl font-extrabold text-dark sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-3 font-body text-base font-semibold leading-relaxed text-dark/75">
        {children}
      </div>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <PageContainer narrow className="pb-12">
        <PageHeader
          title={SITE_NAME}
          subtitle="Challenge your knowledge with fun, fast, and accessible quizzes."
        />

        <div className="space-y-5 sm:space-y-6">
          <SectionCard title="What is PlayTrivia?" accent="pink">
            <p>
              {SITE_NAME} is a free quiz platform featuring multiple categories and game modes.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Topics include General Knowledge, Science, Geography, and History.</li>
              <li>Includes picture rounds, daily challenges, and multiplayer gameplay.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Why I Built It" accent="blue">
            <ul className="list-disc space-y-2 pl-5">
              <li>Built as an independent side project.</li>
              <li>Goal is to make learning and trivia more engaging.</li>
              <li>Focus on simple UX, accessibility, and fun competition.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Our Mission" accent="lime">
            <ul className="list-disc space-y-2 pl-5">
              <li>Make trivia enjoyable for everyone.</li>
              <li>Encourage curiosity and lifelong learning.</li>
              <li>Provide a fast, mobile-friendly experience.</li>
            </ul>
          </SectionCard>
        </div>

        <div className="mt-10 flex justify-center sm:mt-12">
          <Button href="/solo" variant="primary" size="xl" className="min-w-[220px]">
            Play a Quiz
          </Button>
        </div>
      </PageContainer>
    </>
  );
}
