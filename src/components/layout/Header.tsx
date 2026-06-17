"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/ui/ArrowLeftIcon";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ACTIVE_QUIZ_LEAVE_PHASES,
  useQuizLeaveGuard,
} from "@/hooks/quiz/use-quiz-leave-guard";
import { useQuizStore } from "@/store/quiz";
import { cn } from "@/lib/utils/cn";

const LEAVE_DIALOG_DESCRIPTION =
  "Your progress is saved locally. You can continue from Home or Solo anytime.";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const isPlayRoute = pathname.startsWith("/play/");
  const phase = useQuizStore((state) => state.phase);
  const isQuizInProgress = isPlayRoute && ACTIVE_QUIZ_LEAVE_PHASES.includes(phase);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const handleGoHome = () => {
    setShowLeaveConfirm(false);
    router.push("/");
  };

  const handleLeaveAttempt = useCallback(() => {
    setShowLeaveConfirm(true);
  }, []);

  useQuizLeaveGuard({
    enabled: isQuizInProgress,
    onBackAttempt: handleLeaveAttempt,
  });

  const logoContent = (
    <>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime text-lg font-bold text-dark shadow-[0_4px_0_0_#c8d84a] transition-transform duration-150 group-hover:scale-105">
        P
      </span>
      <span className="font-display text-xl font-bold text-dark sm:text-2xl">
        Play<span className="text-pink">Trivia</span>
      </span>
    </>
  );

  return (
    <>
      <header className="relative z-20 w-full px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          {isQuizInProgress ? (
            <button
              type="button"
              onClick={handleLeaveAttempt}
              className="group flex items-center gap-2"
            >
              {logoContent}
            </button>
          ) : (
            <Link href="/" prefetch className="group flex items-center gap-2">
              {logoContent}
            </Link>
          )}

          {!isHome &&
            (isQuizInProgress ? (
              <button
                type="button"
                onClick={handleLeaveAttempt}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-4 py-2",
                  "font-body text-sm font-bold text-dark/70 transition-colors duration-150",
                  "hover:bg-dark/5 hover:text-dark",
                )}
              >
                <ArrowLeftIcon size={14} />
                Home
              </button>
            ) : (
              <Link
                href="/"
                prefetch
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-4 py-2",
                  "font-body text-sm font-bold text-dark/70 transition-colors duration-150",
                  "hover:bg-dark/5 hover:text-dark",
                )}
              >
                <ArrowLeftIcon size={14} />
                Home
              </Link>
            ))}
        </div>
      </header>

      <ConfirmDialog
        open={showLeaveConfirm}
        title="Leave this quiz?"
        description={LEAVE_DIALOG_DESCRIPTION}
        confirmLabel="Go Home"
        cancelLabel="Stay"
        confirmVariant="secondary"
        onConfirm={handleGoHome}
        onCancel={() => setShowLeaveConfirm(false)}
      />
    </>
  );
}
