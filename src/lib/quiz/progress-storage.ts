import type { GameMode, GamePhase } from "@/types/quiz";
import type { QuizStoreState } from "@/store/quiz/types";
import type { QuizSessionType } from "@/store/quiz/types";
import { getCategoryLabel } from "@/lib/quiz/routes";

export const QUIZ_PROGRESS_STORAGE_KEY = "quizverse-progress";

/** Phases where the player is actively in a quiz (not idle, setup, or final results). */
export const IN_PROGRESS_QUIZ_PHASES: GamePhase[] = [
  "round-intro",
  "question",
  "feedback",
  "round-complete",
  "player-handoff",
];

export type PersistedQuizProgress = Pick<
  QuizStoreState,
  | "sessionType"
  | "dailyChallengeDate"
  | "sessionId"
  | "mode"
  | "categoryId"
  | "phase"
  | "players"
  | "activePlayerIndex"
  | "completedPlayerIds"
  | "rounds"
  | "quizData"
  | "questionOrder"
  | "currentRoundIndex"
  | "currentQuestionIndex"
  | "currentQuestionId"
  | "answerHistory"
  | "lastFeedback"
  | "startedAt"
  | "completedAt"
>;

const EMPTY_PROGRESS: PersistedQuizProgress = {
  sessionType: null,
  dailyChallengeDate: null,
  sessionId: null,
  mode: null,
  categoryId: null,
  phase: "idle",
  players: [],
  activePlayerIndex: 0,
  completedPlayerIds: [],
  rounds: [],
  quizData: null,
  questionOrder: [],
  currentRoundIndex: 0,
  currentQuestionIndex: 0,
  currentQuestionId: null,
  answerHistory: [],
  lastFeedback: null,
  startedAt: null,
  completedAt: null,
};

const ACTIVE_PHASES: GamePhase[] = [
  "round-intro",
  "question",
  "feedback",
  "round-complete",
  "player-handoff",
  "game-complete",
];

export function getPersistedQuizState(state: QuizStoreState): PersistedQuizProgress {
  if (state.phase === "idle" || state.phase === "setup" || !state.categoryId || !state.mode) {
    return EMPTY_PROGRESS;
  }

  return {
    sessionType: state.sessionType,
    dailyChallengeDate: state.dailyChallengeDate,
    sessionId: state.sessionId,
    mode: state.mode,
    categoryId: state.categoryId,
    phase: state.phase,
    players: state.players,
    activePlayerIndex: state.activePlayerIndex,
    completedPlayerIds: state.completedPlayerIds,
    rounds: state.rounds,
    quizData: state.quizData,
    questionOrder: state.questionOrder,
    currentRoundIndex: state.currentRoundIndex,
    currentQuestionIndex: state.currentQuestionIndex,
    currentQuestionId: state.currentQuestionId,
    answerHistory: state.answerHistory,
    lastFeedback: state.lastFeedback,
    startedAt: state.startedAt,
    completedAt: state.completedAt,
  };
}

export function isValidPersistedProgress(state: Partial<QuizStoreState>): boolean {
  if (!state.categoryId || !state.mode || !state.phase) return false;
  if (!ACTIVE_PHASES.includes(state.phase)) return false;
  if (!state.rounds?.length) return false;
  if (!state.players?.length) return false;

  const roundIndex = state.currentRoundIndex ?? 0;
  if (roundIndex < 0 || roundIndex >= state.rounds.length) return false;

  const round = state.rounds[roundIndex];
  if (!round) return false;

  const questionIndex = state.currentQuestionIndex ?? 0;
  if (questionIndex < 0) return false;

  if (state.currentQuestionId !== undefined && state.currentQuestionId !== null) {
    const byIdExists = state.quizData?.rounds?.some((r) =>
      r.questions.some((q) => q.id === state.currentQuestionId),
    );
    if (!byIdExists) return false;
  }

  if (state.phase === "question" && questionIndex >= round.questionCount) {
    return false;
  }

  if (state.phase === "feedback" && !state.lastFeedback) {
    return false;
  }

  return true;
}

export function sanitizePersistedProgress(
  state: Partial<QuizStoreState>,
): Partial<QuizStoreState> | null {
  if (!isValidPersistedProgress(state)) return null;

  if (state.phase === "feedback" && !state.lastFeedback) {
    return { phase: "question" };
  }

  return null;
}

export function hasRestorableProgress(
  state: QuizStoreState,
  categoryId: string,
  mode: GameMode,
  options?: {
    sessionType?: "standard" | "daily";
    dailyChallengeDate?: string | null;
  },
): boolean {
  const sessionMatches =
    !options?.sessionType || state.sessionType === options.sessionType;
  const dailyDateMatches =
    options?.sessionType !== "daily" ||
    !options.dailyChallengeDate ||
    state.dailyChallengeDate === options.dailyChallengeDate;

  return (
    isValidPersistedProgress(state) &&
    state.categoryId === categoryId &&
    state.mode === mode &&
    sessionMatches &&
    dailyDateMatches
  );
}

export function clearQuizProgressStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(QUIZ_PROGRESS_STORAGE_KEY);
}

export function getSavedProgressSummary(): SavedProgressSummary | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(QUIZ_PROGRESS_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { state?: Partial<QuizStoreState> };
    const state = parsed.state;
    if (!state || !isValidPersistedProgress(state)) return null;

    const activePlayer = state.players?.[state.activePlayerIndex ?? 0];

    return {
      categoryId: state.categoryId!,
      mode: state.mode!,
      phase: state.phase!,
      sessionType: state.sessionType ?? null,
      dailyChallengeDate: state.dailyChallengeDate ?? null,
      currentRound: (state.currentRoundIndex ?? 0) + 1,
      currentQuestion: (state.currentQuestionIndex ?? 0) + 1,
      score: activePlayer?.totalScore ?? 0,
    };
  } catch {
    return null;
  }
}

export type SavedProgressSummary = {
  categoryId: string;
  mode: GameMode;
  phase: GamePhase;
  sessionType: QuizSessionType | null;
  dailyChallengeDate: string | null;
  currentRound: number;
  currentQuestion: number;
  score: number;
};

export type QuizProgressTarget = {
  categoryId: string;
  mode: GameMode;
  sessionType?: QuizSessionType | null;
  dailyChallengeDate?: string | null;
};

export function isInProgressSavedPhase(phase: GamePhase): boolean {
  return IN_PROGRESS_QUIZ_PHASES.includes(phase);
}

export function progressTargetMatchesSaved(
  target: QuizProgressTarget,
  saved: SavedProgressSummary,
): boolean {
  if (target.sessionType === "daily") {
    return (
      saved.sessionType === "daily" &&
      saved.categoryId === target.categoryId &&
      saved.mode === target.mode &&
      saved.dailyChallengeDate === target.dailyChallengeDate
    );
  }

  return (
    saved.sessionType !== "daily" &&
    saved.categoryId === target.categoryId &&
    saved.mode === target.mode
  );
}

export function getSavedProgressConflict(
  target: QuizProgressTarget,
): SavedProgressSummary | null {
  const saved = getSavedProgressSummary();
  if (!saved) return null;
  if (progressTargetMatchesSaved(target, saved)) return null;
  return saved;
}

export function formatSavedProgressLabel(saved: SavedProgressSummary): string {
  const category = getCategoryLabel(saved.categoryId, saved.sessionType);
  const modeLabel = saved.mode === "multiplayer" ? "Multiplayer" : "Solo";
  return `${category} (${modeLabel}) — Round ${saved.currentRound}, Question ${saved.currentQuestion}`;
}
