import { GEOGRAPHY_QUESTIONS } from "@/data/quiz/categories/geography";
import { legacyRoundToContent } from "../shared";

export const QUESTIONS = legacyRoundToContent({
  source: GEOGRAPHY_QUESTIONS.filter((question) => question.roundId === "list-it"),
  category: "geography",
  idPrefix: "geo-li",
  defaultTags: ["geography", "capital-cities"],
});
