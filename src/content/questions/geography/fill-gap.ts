import { GEOGRAPHY_QUESTIONS } from "@/data/quiz/categories/geography";
import { legacyRoundToContent } from "../shared";

export const QUESTIONS = legacyRoundToContent({
  source: GEOGRAPHY_QUESTIONS.filter((question) => question.roundId === "fill-the-gap"),
  category: "geography",
  idPrefix: "geo-fg",
  defaultTags: ["geography"],
});
