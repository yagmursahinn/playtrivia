import type { ThemeColor } from "@/lib/theme/colors";
import type { IconName } from "@/lib/constants/icons";

export type Category = {
  id: string;
  label: string;
  icon: IconName;
  description: string;
  accent: ThemeColor;
};

export type PlayerCount = 2 | 3 | 4;

export type {
  GameMode,
  GamePhase,
  RoundDefinition,
  RoundState,
  Player,
  AnswerRecord,
  FeedbackState,
  LeaderboardEntry,
  QuizSessionMeta,
} from "./quiz";
