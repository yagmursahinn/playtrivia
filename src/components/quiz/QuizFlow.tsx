"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuizGame, useQuizScores } from "@/hooks/quiz";
import {
  cardStackActive,
  cardStackEnter,
  cardStackTransition,
} from "@/lib/theme/animations";
import { getCategoryLabel } from "@/lib/quiz/routes";
import { useQuizStore } from "@/store/quiz";
import { FinalResultScreen } from "./FinalResultScreen";
import { PlayerHandoffScreen } from "./PlayerHandoffScreen";
import { QuizChallengeStack } from "./QuizChallengeStack";
import { RoundCompleteScreen } from "./RoundCompleteScreen";
import { RoundIntroScreen } from "./RoundIntroScreen";

type QuizFlowProps = {
  mode: "solo" | "multiplayer";
  categoryId: string;
  onPlayAgain: () => void;
  onStartNewQuiz?: () => void;
};

function StackScreen({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={cardStackEnter}
      animate={cardStackActive}
      transition={cardStackTransition}
      className="w-full"
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}

export function QuizFlow({
  mode,
  categoryId,
  onPlayAgain,
  onStartNewQuiz,
}: QuizFlowProps) {
  const router = useRouter();
  const sessionType = useQuizStore((state) => state.sessionType);
  const startedAt = useQuizStore((state) => state.startedAt);
  const completedAt = useQuizStore((state) => state.completedAt);
  const {
    currentRound,
    currentQuestion,
    progress,
    feedback,
    activePlayer,
    isRoundIntro,
    isQuestion,
    isFeedback,
    isRoundComplete,
    isPlayerHandoff,
    isGameComplete,
    handoffPlayer,
    roundStats,
    totalRounds,
    rounds,
    answerHistory,
    startRound,
    submitQuestionAnswer,
    continueFromFeedback,
    continueFromRoundComplete,
    continueFromPlayerHandoff,
    resetQuiz,
  } = useQuizGame();
  const { allPlayersStats } = useQuizScores();

  const score = activePlayer?.totalScore ?? 0;

  if (isRoundIntro && currentRound) {
    return (
      <StackScreen>
        <RoundIntroScreen
          round={currentRound}
          playerName={activePlayer?.name}
          onStart={startRound}
        />
      </StackScreen>
    );
  }

  if ((isQuestion || isFeedback) && currentQuestion && progress && currentRound) {
    return (
      <QuizChallengeStack
        mode={mode}
        roundNumber={progress.roundNumber}
        roundTitle={progress.roundTitle}
        questionNumber={progress.questionNumber}
        totalQuestions={progress.totalQuestions}
        score={score}
        question={currentQuestion}
        feedback={feedback}
        isFeedback={isFeedback}
        onSubmit={submitQuestionAnswer}
        onContinue={continueFromFeedback}
        onStartNewQuiz={onStartNewQuiz}
      />
    );
  }

  if (isRoundComplete && roundStats) {
    return (
      <StackScreen>
        <RoundCompleteScreen
          roundNumber={roundStats.roundNumber}
          roundTitle={roundStats.roundTitle}
          roundScore={roundStats.roundScore}
          correctCount={roundStats.correctCount}
          totalQuestions={roundStats.totalQuestions}
          totalRounds={roundStats.totalRounds}
          questionType={roundStats.questionType}
          isFinalRound={roundStats.isFinalRound}
          nextRound={roundStats.nextRound}
          onContinue={continueFromRoundComplete}
        />
      </StackScreen>
    );
  }

  if (isPlayerHandoff && handoffPlayer) {
    return (
      <StackScreen>
        <div className="mx-auto w-full max-w-3xl py-4 sm:py-8">
          <PlayerHandoffScreen
            playerName={handoffPlayer.name}
            onContinue={continueFromPlayerHandoff}
          />
        </div>
      </StackScreen>
    );
  }

  if (isGameComplete) {
    return (
      <StackScreen>
        <FinalResultScreen
          mode={mode}
          categoryLabel={getCategoryLabel(categoryId, sessionType)}
          categoryId={categoryId}
          sessionType={sessionType}
          totalRounds={totalRounds}
          players={allPlayersStats}
          answerHistory={answerHistory}
          rounds={rounds.map((round) => ({
            id: round.id,
            title: round.title,
            questionCount: round.questionCount,
          }))}
          startedAt={startedAt}
          completedAt={completedAt}
          onPlayAgain={() => {
            if (mode === "solo") {
              onPlayAgain();
              return;
            }
            resetQuiz();
            router.push("/multiplayer");
          }}
          onTryAnotherCategory={() => {
            resetQuiz();
            router.push("/solo");
          }}
          onHome={() => {
            resetQuiz();
            router.push("/");
          }}
        />
      </StackScreen>
    );
  }

  return (
    <div className="py-20 text-center font-body font-semibold text-dark/50">
      Loading round...
    </div>
  );
}
