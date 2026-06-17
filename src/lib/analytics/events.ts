export type AnalyticsEventPayload = Record<string, string | number | boolean | null | undefined>;

export type AnalyticsProvider = {
  track: (event: string, payload?: AnalyticsEventPayload) => void;
};

export type QuizStartedPayload = {
  categoryId: string;
  mode: "solo" | "multiplayer";
  sessionType?: "standard" | "daily";
};

export type QuizCompletedPayload = {
  categoryId: string | null;
  mode: "solo" | "multiplayer";
  score: number;
  accuracy: number;
  sessionType?: "standard" | "daily";
};

export type CategorySelectedPayload = {
  categoryId: string;
};

export type DailyChallengeStartedPayload = {
  dateKey: string;
};
