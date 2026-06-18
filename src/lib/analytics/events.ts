import { track } from "@vercel/analytics";

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

type QuizMode = "solo" | "multiplayer";
type ShareMethod = "copy" | "x" | "whatsapp" | "native";

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function sendEvent(event: string, payload?: AnalyticsPayload): void {
  if (!isProduction()) return;
  track(event, payload);
}

function sendOnce(storageKey: string, event: string, payload?: AnalyticsPayload): void {
  if (typeof window !== "undefined") {
    const key = `pt-analytics:${storageKey}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  }

  sendEvent(event, payload);
}

export function trackQuizStarted({
  mode,
  category,
  isDaily,
  sessionId,
}: {
  mode: QuizMode;
  category: string;
  isDaily: boolean;
  sessionId?: string | null;
}): void {
  const payload = { mode, category, isDaily };

  if (sessionId) {
    sendOnce(`quiz_started:${sessionId}`, "quiz_started", payload);
    return;
  }

  sendEvent("quiz_started", payload);
}

export function trackQuizCompleted({
  mode,
  category,
  isDaily,
  score,
  accuracy,
  totalQuestions,
  rank,
  sessionId,
}: {
  mode: QuizMode;
  category: string;
  isDaily: boolean;
  score: number;
  accuracy: number;
  totalQuestions: number;
  rank: string;
  sessionId?: string | null;
}): void {
  const payload = { mode, category, isDaily, score, accuracy, totalQuestions, rank };

  if (sessionId) {
    sendOnce(`quiz_completed:${sessionId}`, "quiz_completed", payload);
    return;
  }

  sendEvent("quiz_completed", payload);
}

export function trackRoundCompleted({
  mode,
  category,
  round,
  score,
  accuracy,
  sessionId,
}: {
  mode: QuizMode;
  category: string;
  round: number;
  score: number;
  accuracy: number;
  sessionId?: string | null;
}): void {
  const payload = { mode, category, round, score, accuracy };

  if (sessionId) {
    sendOnce(`round_completed:${sessionId}:${round}`, "round_completed", payload);
    return;
  }

  sendEvent("round_completed", payload);
}

export function trackCategorySelected({ category }: { category: string }): void {
  sendEvent("category_selected", { category });
}

export function trackDailyChallengeStarted(): void {
  sendEvent("daily_challenge_started");
}

export function trackMultiplayerStarted({ playerCount }: { playerCount: number }): void {
  sendEvent("multiplayer_started", { playerCount });
}

export function trackShareClicked({
  method,
  category,
  score,
  rank,
}: {
  method: ShareMethod;
  category: string;
  score: number;
  rank: string;
}): void {
  sendEvent("share_clicked", { method, category, score, rank });
}

export function trackResumeQuizClicked({
  category,
  mode,
}: {
  category: string;
  mode: QuizMode;
}): void {
  sendEvent("resume_quiz_clicked", { category, mode });
}
