import { Header, HeroSection, PageContainer } from "@/components/layout";
import { ContinueQuizBanner } from "@/components/quiz/ContinueQuizBanner";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildHomeMetadata } from "@/lib/seo/metadata";
import { buildHomeJsonLd } from "@/lib/seo/structured-data";

export const metadata = buildHomeMetadata();

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildHomeJsonLd()} />
      <Header />
      <PageContainer className="flex max-w-4xl flex-col items-center justify-center pb-16 pt-4 sm:pb-24 sm:pt-8 lg:max-w-5xl">
        <ContinueQuizBanner className="mb-6 w-full sm:mb-8" />
        <HeroSection />
        <FaqSection className="mt-16 w-full" />
      </PageContainer>
    </>
  );
}
