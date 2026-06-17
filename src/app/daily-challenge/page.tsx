import { DailyChallengeLandingPage } from "@/components/seo/DailyChallengeLandingPage";
import { buildDailyChallengeMetadata } from "@/lib/seo/metadata";

export const metadata = buildDailyChallengeMetadata();

export default function DailyChallengePage() {
  return <DailyChallengeLandingPage />;
}
