import { HISTORY_QUESTIONS } from "@/data/quiz/categories/history";
import { legacyRoundToContent } from "../shared";

export const QUESTIONS = legacyRoundToContent({
  source: HISTORY_QUESTIONS.filter((question) => question.roundId === "picture-round"),
  category: "history",
  idPrefix: "hist-pr",
  defaultTags: ["history", "visual"],
});
