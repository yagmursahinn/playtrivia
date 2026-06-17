"use client";

import { useEffect, useRef } from "react";
import { IN_PROGRESS_QUIZ_PHASES } from "@/lib/quiz/progress-storage";

type UseQuizLeaveGuardOptions = {
  enabled: boolean;
  onBackAttempt: () => void;
};

export function useQuizLeaveGuard({ enabled, onBackAttempt }: UseQuizLeaveGuardOptions): void {
  const guardActiveRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      guardActiveRef.current = false;
      return;
    }

    const pushGuardState = () => {
      window.history.pushState({ playTriviaQuizGuard: true }, "", window.location.href);
    };

    pushGuardState();
    guardActiveRef.current = true;

    const handlePopState = () => {
      if (!guardActiveRef.current) return;
      pushGuardState();
      onBackAttempt();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      guardActiveRef.current = false;
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled, onBackAttempt]);
}

export { IN_PROGRESS_QUIZ_PHASES as ACTIVE_QUIZ_LEAVE_PHASES };
