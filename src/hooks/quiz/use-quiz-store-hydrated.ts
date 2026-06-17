"use client";

import { useEffect, useState } from "react";
import {
  isValidPersistedProgress,
  sanitizePersistedProgress,
} from "@/lib/quiz/progress-storage";
import { useQuizStore } from "@/store/quiz";
import { initialQuizState } from "@/store/quiz/types";

function getPersistApi() {
  return useQuizStore.persist;
}

export function useQuizStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persist = getPersistApi();
    if (!persist) {
      queueMicrotask(() => setHydrated(true));
      return;
    }

    const finishHydration = () => {
      const state = useQuizStore.getState();

      if (state.phase !== "idle" && state.phase !== "setup" && !isValidPersistedProgress(state)) {
        useQuizStore.setState(initialQuizState);
      } else {
        const patch = sanitizePersistedProgress(state);
        if (patch) {
          useQuizStore.setState(patch);
        }
      }

      setHydrated(true);
    };

    if (persist.hasHydrated()) {
      queueMicrotask(finishHydration);
      return;
    }

    const unsubscribe = persist.onFinishHydration(finishHydration);
    void persist.rehydrate();

    return unsubscribe;
  }, []);

  return hydrated;
}
