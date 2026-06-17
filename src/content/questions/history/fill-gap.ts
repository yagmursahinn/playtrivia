import { HISTORY_QUESTIONS } from "@/data/quiz/categories/history";
import { legacyRoundToContent } from "../shared";

export const QUESTIONS = legacyRoundToContent({
  source: HISTORY_QUESTIONS.filter((question) => question.roundId === "fill-the-gap"),
  category: "history",
  idPrefix: "hist-fg",
  defaultTags: ["history"],
});
