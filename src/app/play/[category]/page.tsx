"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Header, PageContainer } from "@/components/layout";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import { OverwriteProgressDialog } from "@/components/quiz/OverwriteProgressDialog";
import {
  InvalidCategoryScreen,
  MultiplayerSetupRequiredScreen,
} from "@/components/quiz/QuizPlayScreens";
import { useQuizPlayInit } from "@/hooks/quiz/use-quiz-play-init";
import { slugToCategoryId } from "@/lib/quiz/routes";
import type { GameMode } from "@/types/quiz";

export default function PlayCategoryPage() {
  const params = useParams<{ category: string }>();
  const searchParams = useSearchParams();
  const categorySlug = params.category;
  const categoryId = slugToCategoryId(categorySlug);
  const mode: GameMode =
    searchParams.get("mode") === "multiplayer" ? "multiplayer" : "solo";
  const isDailyChallenge = searchParams.get("daily") === "1";

  if (!categoryId) {
    return (
      <>
        <Header />
        <PageContainer narrow className="pb-16">
          <InvalidCategoryScreen slug={categorySlug} />
        </PageContainer>
      </>
    );
  }

  if (isDailyChallenge && categoryId !== "mixed") {
    return (
      <>
        <Header />
        <PageContainer narrow className="pb-16">
          <InvalidCategoryScreen slug={categorySlug} />
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Header />
      <PageContainer className="max-w-[min(92rem,94vw)] px-3 pb-24 pt-2 sm:px-5 sm:pb-16 sm:pt-4 lg:px-6">
        <PlayCategoryShell
          key={`${categoryId}-${mode}-${isDailyChallenge ? "daily" : "standard"}`}
          categoryId={categoryId}
          categorySlug={categorySlug}
          mode={mode}
          isDailyChallenge={isDailyChallenge}
        />
      </PageContainer>
    </>
  );
}

function PlayCategoryShell({
  categoryId,
  categorySlug,
  mode,
  isDailyChallenge,
}: {
  categoryId: string;
  categorySlug: string;
  mode: GameMode;
  isDailyChallenge: boolean;
}) {
  const router = useRouter();
  const {
    isReady,
    needsMultiplayerSetup,
    pendingOverwrite,
    savedProgressConflict,
    confirmOverwrite,
    cancelOverwrite,
    restartQuiz,
    startNewQuiz,
    sessionId,
  } = useQuizPlayInit({
    categoryId,
    categorySlug,
    mode,
    isDailyChallenge,
  });

  if (needsMultiplayerSetup) {
    return (
      <MultiplayerSetupRequiredScreen
        playPath={`/play/${categorySlug}?mode=multiplayer`}
      />
    );
  }

  if (pendingOverwrite) {
    return (
      <OverwriteProgressDialog
        open={pendingOverwrite}
        saved={savedProgressConflict}
        onConfirm={confirmOverwrite}
        onCancel={() => {
          cancelOverwrite();
          router.push("/solo");
        }}
      />
    );
  }

  if (!isReady) {
    return (
      <div className="py-20 text-center font-body font-semibold text-dark/50">
        Preparing your quiz...
      </div>
    );
  }

  return (
    <QuizFlow
      key={sessionId ?? categoryId}
      mode={mode}
      categoryId={categoryId}
      onPlayAgain={restartQuiz}
      onStartNewQuiz={startNewQuiz}
    />
  );
}
