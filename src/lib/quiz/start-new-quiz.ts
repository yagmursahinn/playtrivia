import { buildQuizData, invalidateQuizDataCache } from "@/data/quiz";
import { clearQuizProgressStorage } from "@/lib/quiz/progress-storage";
import { useQuizStore } from "@/store/quiz";
import type { GameMode } from "@/types/quiz";

function clearPersistedStorage(): void {
  clearQuizProgressStorage();
  useQuizStore.persist?.clearStorage();
}

export function startNewQuiz(categoryId: string, mode: GameMode = "solo"): void {
  invalidateQuizDataCache(categoryId);
  buildQuizData(categoryId);
  clearPersistedStorage();
  useQuizStore.getState().startNewQuiz(categoryId, mode);
}

export function clearQuizProgress(): void {
  clearPersistedStorage();
  useQuizStore.getState().resetQuiz();
}
