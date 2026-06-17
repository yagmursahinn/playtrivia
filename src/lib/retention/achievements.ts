import type { AnswerRecord } from "@/types/quiz";

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
};

export const ACHIEVEMENT_DEFINITIONS: Record<string, AchievementDefinition> = {
  "perfect-round": {
    id: "perfect-round",
    title: "Perfect Round",
    description: "Complete a round with 100% accuracy",
  },
  "speed-runner": {
    id: "speed-runner",
    title: "Speed Runner",
    description: "Finish a quiz in under 2 minutes",
  },
  "picture-master": {
    id: "picture-master",
    title: "Picture Master",
    description: "Get all Picture Round questions correct",
  },
  "history-buff": {
    id: "history-buff",
    title: "History Buff",
    description: "Score 100% in History category",
  },
  "science-genius": {
    id: "science-genius",
    title: "Science Genius",
    description: "Score 100% in Science category",
  },
  "geography-expert": {
    id: "geography-expert",
    title: "Geography Expert",
    description: "Score 100% in Geography category",
  },
  "general-knowledge-pro": {
    id: "general-knowledge-pro",
    title: "General Knowledge Pro",
    description: "Score 100% in General Knowledge category",
  },
};

type RoundSummary = {
  id: string;
  questionCount: number;
};

export type QuizCompletionContext = {
  playerId: string;
  categoryId: string | null;
  accuracy: number;
  answerHistory: AnswerRecord[];
  rounds: RoundSummary[];
  startedAt: number | null;
  completedAt: number | null;
};

const CATEGORY_ACHIEVEMENT_MAP: Record<string, string> = {
  history: "history-buff",
  science: "science-genius",
  geography: "geography-expert",
  general: "general-knowledge-pro",
};

export function evaluateSessionAchievements(context: QuizCompletionContext): string[] {
  const { playerId, categoryId, accuracy, answerHistory, rounds, startedAt, completedAt } =
    context;
  const playerAnswers = answerHistory.filter((answer) => answer.playerId === playerId);
  const unlocked: string[] = [];

  const hasPerfectRound = rounds.some((round) => {
    const roundAnswers = playerAnswers.filter((answer) => answer.roundId === round.id);
    if (roundAnswers.length < round.questionCount) return false;
    return roundAnswers.every((answer) => answer.pointsAwarded > 0);
  });

  if (hasPerfectRound) {
    unlocked.push("perfect-round");
  }

  const pictureRound = rounds.find((round) => round.id === "picture-round");
  if (pictureRound) {
    const pictureAnswers = playerAnswers.filter((answer) => answer.roundId === pictureRound.id);
    if (
      pictureAnswers.length >= pictureRound.questionCount &&
      pictureAnswers.every((answer) => answer.pointsAwarded > 0)
    ) {
      unlocked.push("picture-master");
    }
  }

  if (startedAt && completedAt && completedAt - startedAt <= 2 * 60 * 1000) {
    unlocked.push("speed-runner");
  }

  if (categoryId && accuracy === 100) {
    const categoryAchievement = CATEGORY_ACHIEVEMENT_MAP[categoryId];
    if (categoryAchievement) {
      unlocked.push(categoryAchievement);
    }
  }

  return unlocked;
}

export function getAchievementDefinition(id: string): AchievementDefinition | null {
  return ACHIEVEMENT_DEFINITIONS[id] ?? null;
}

export function getAchievementDefinitions(ids: string[]): AchievementDefinition[] {
  return ids
    .map((id) => getAchievementDefinition(id))
    .filter((achievement): achievement is AchievementDefinition => achievement !== null);
}
