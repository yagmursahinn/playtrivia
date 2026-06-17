import type {
  AnalyticsEventPayload,
  AnalyticsProvider,
  CategorySelectedPayload,
  DailyChallengeStartedPayload,
  QuizCompletedPayload,
  QuizStartedPayload,
} from "./events";

const noopProvider: AnalyticsProvider = {
  track: () => {},
};

let provider: AnalyticsProvider = noopProvider;

function emit(event: string, payload?: AnalyticsEventPayload): void {
  provider.track(event, payload);
}

export function setAnalyticsProvider(nextProvider: AnalyticsProvider): void {
  provider = nextProvider;
}

export function trackEvent(event: string, payload?: AnalyticsEventPayload): void {
  emit(event, payload);
}

export function trackQuizStarted(payload: QuizStartedPayload): void {
  emit("quiz_started", payload);
}

export function trackQuizCompleted(payload: QuizCompletedPayload): void {
  emit("quiz_completed", payload);
}

export function trackCategorySelected(payload: CategorySelectedPayload): void {
  emit("category_selected", payload);
}

export function trackDailyChallengeStarted(payload: DailyChallengeStartedPayload): void {
  emit("daily_challenge_started", payload);
}

export type {
  AnalyticsEventPayload,
  AnalyticsProvider,
  CategorySelectedPayload,
  DailyChallengeStartedPayload,
  QuizCompletedPayload,
  QuizStartedPayload,
};
