import type {
  QuizData,
  QuestionType,
} from "@/data/quiz/types";
import type {
  AnswerRecord,
  FeedbackState,
  GameMode,
  GamePhase,
  LeaderboardEntry,
  Player,
  RoundState,
} from "@/types/quiz";

export type QuizSessionType = "standard" | "daily";

export type QuizStoreState = {
  sessionId: string | null;
  mode: GameMode | null;
  categoryId: string | null;
  sessionType: QuizSessionType | null;
  dailyChallengeDate: string | null;
  phase: GamePhase;
  players: Player[];
  activePlayerIndex: number;
  completedPlayerIds: string[];
  rounds: RoundState[];
  quizData: QuizData | null;
  questionOrder: string[][];
  currentRoundIndex: number;
  currentQuestionIndex: number;
  currentQuestionId: string | null;
  answerHistory: AnswerRecord[];
  lastFeedback: FeedbackState | null;
  startedAt: number | null;
  completedAt: number | null;
};

export type QuizStoreActions = {
  initSolo: (categoryId: string) => void;
  initDailyChallenge: (dateKey?: string) => void;
  initMultiplayer: (playerNames: string[]) => void;
  resetQuiz: () => void;
  startNewQuiz: (categoryId: string, mode?: GameMode) => void;
  startGame: () => void;
  startRound: () => void;
  submitQuestionAnswer: (answer: string | string[]) => void;
  continueFromFeedback: () => void;
  continueFromRoundComplete: () => void;
  continueFromPlayerHandoff: () => void;
  getLeaderboardPayload: () => LeaderboardEntry[];
};

export type QuizStore = QuizStoreState & QuizStoreActions;

export const initialQuizState: QuizStoreState = {
  sessionId: null,
  mode: null,
  categoryId: null,
  sessionType: null,
  dailyChallengeDate: null,
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
