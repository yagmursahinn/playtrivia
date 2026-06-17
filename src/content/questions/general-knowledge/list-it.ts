import { GENERAL_KNOWLEDGE_QUESTIONS } from "@/data/quiz/categories/general-knowledge";
import { legacyRoundToContent } from "../shared";

export const QUESTIONS = legacyRoundToContent({
  source: GENERAL_KNOWLEDGE_QUESTIONS.filter((question) => question.roundId === "list-it"),
  category: "general-knowledge",
  idPrefix: "gk-li",
  defaultTags: ["general-knowledge", "lists"],
});
