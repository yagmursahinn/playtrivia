import { GENERAL_KNOWLEDGE_QUESTIONS } from "@/data/quiz/categories/general-knowledge";
import { legacyRoundToContent } from "../shared";

export const QUESTIONS = legacyRoundToContent({
  source: GENERAL_KNOWLEDGE_QUESTIONS.filter((question) => question.roundId === "quick-picks"),
  category: "general-knowledge",
  idPrefix: "gk-qp",
  defaultTags: ["general-knowledge", "trivia"],
});
