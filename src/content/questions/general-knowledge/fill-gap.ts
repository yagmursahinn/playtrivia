import { GENERAL_KNOWLEDGE_QUESTIONS } from "@/data/quiz/categories/general-knowledge";
import { legacyRoundToContent } from "../shared";

export const QUESTIONS = legacyRoundToContent({
  source: GENERAL_KNOWLEDGE_QUESTIONS.filter((question) => question.roundId === "fill-the-gap"),
  category: "general-knowledge",
  idPrefix: "gk-fg",
  defaultTags: ["general-knowledge", "vocabulary"],
});
