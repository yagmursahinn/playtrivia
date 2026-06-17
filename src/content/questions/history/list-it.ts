import { HISTORY_QUESTIONS } from "@/data/quiz/categories/history";
import { legacyRoundToContent } from "../shared";

export const QUESTIONS = legacyRoundToContent({
  source: HISTORY_QUESTIONS.filter((question) => question.roundId === "list-it"),
  category: "history",
  idPrefix: "hist-li",
  defaultTags: ["history"],
});
