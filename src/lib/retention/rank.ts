export type KnowledgeRank = {
  title: string;
  message: string;
  tier: "legend" | "master" | "thinker" | "explorer" | "beginner";
};

const RANK_STYLES: Record<KnowledgeRank["tier"], string> = {
  legend: "border-lime/50 bg-lime/15 text-dark",
  master: "border-blue/40 bg-blue/10 text-dark",
  thinker: "border-pink/35 bg-pink/10 text-dark",
  explorer: "border-dark/15 bg-white/80 text-dark",
  beginner: "border-dark/10 bg-cream/80 text-dark",
};

export function getKnowledgeRank(accuracy: number): KnowledgeRank {
  if (accuracy >= 90) {
    return {
      title: "Trivia Legend",
      message: "Incredible performance. You know your stuff.",
      tier: "legend",
    };
  }

  if (accuracy >= 75) {
    return {
      title: "Quiz Master",
      message: "Excellent work. You are on fire.",
      tier: "master",
    };
  }

  if (accuracy >= 60) {
    return {
      title: "Smart Thinker",
      message: "Great work. You are getting there.",
      tier: "thinker",
    };
  }

  if (accuracy >= 40) {
    return {
      title: "Knowledge Explorer",
      message: "Solid effort. Keep exploring.",
      tier: "explorer",
    };
  }

  return {
    title: "Curious Beginner",
    message: "Every quiz makes you stronger.",
    tier: "beginner",
  };
}

export function getKnowledgeRankStyle(tier: KnowledgeRank["tier"]): string {
  return RANK_STYLES[tier];
}
