import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  getPersistedQuizState,
  QUIZ_PROGRESS_STORAGE_KEY,
} from "@/lib/quiz/progress-storage";
import { createQuizStoreActions } from "./actions";
import type { QuizStore } from "./types";
import { initialQuizState } from "./types";

function createQuizState(
  set: Parameters<typeof createQuizStoreActions>[0],
  get: Parameters<typeof createQuizStoreActions>[1],
) {
  return {
    ...initialQuizState,
    ...createQuizStoreActions(set, get),
  };
}

export const useQuizStore = create<QuizStore>()(
  persist(
    process.env.NODE_ENV === "development"
      ? devtools(createQuizState, { name: "PlayTriviaStore" })
      : createQuizState,
    {
      name: QUIZ_PROGRESS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => getPersistedQuizState(state),
      skipHydration: true,
    },
  ),
);
