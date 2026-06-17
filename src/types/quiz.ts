export type GameMode = "solo" | "multiplayer";

export type GamePhase =
  | "idle"
  | "setup"
  | "round-intro"
  | "question"
  | "feedback"
  | "round-complete"
  | "player-handoff"
  | "game-complete";

export type RoundDefinition = {
  id: string;
  number: number;
  title: string;
  description: string;
  questionCount: number;
};

export type RoundState = RoundDefinition & {
  questionsAnswered: number;
  correctAnswers: number;
  roundScore: number;
  completed: boolean;
};

export type Player = {
  id: string;
  name: string;
  totalScore: number;
  roundScores: Record<string, number>;
  answersCorrect: number;
  answersTotal: number;
};

export type AnswerRecord = {
  id: string;
  questionId: string;
  playerId: string;
  roundId: string;
  roundNumber: number;
  questionIndex: number;
  correct: boolean;
  pointsAwarded: number;
  correctAnswerDisplay: string;
  answeredAt: number;
};

export type FeedbackState = {
  questionId: string;
  questionText: string;
  questionType: string;
  userAnswer: string;
  acceptedAnswers?: string[];
  correct: boolean;
  pointsEarned: number;
  correctAnswerDisplay: string;
  isPartial?: boolean;
  isFullyCorrect?: boolean;
  enumerationRequiredCount?: number;
  enumerationMatchedCount?: number;
  otherPossibleAnswers?: string[];
  exampleAnswers?: string[];
  enumerationSummary?: string;
};

export type LeaderboardEntry = {
  sessionId: string;
  playerId: string;
  playerName: string;
  rank: number;
  totalScore: number;
  mode: GameMode;
  categoryId: string | null;
  categoryLabel: string | null;
  roundScores: Record<string, number>;
  answersCorrect: number;
  answersTotal: number;
  completedAt: string;
};

export type QuizSessionMeta = {
  sessionId: string | null;
  mode: GameMode | null;
  categoryId: string | null;
  phase: GamePhase;
  startedAt: number | null;
  completedAt: number | null;
};
