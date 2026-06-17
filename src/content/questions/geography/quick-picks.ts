import { GEOGRAPHY_QUESTIONS } from "@/data/quiz/categories/geography";
import { legacyRoundToContent } from "../shared";

export const QUESTIONS = legacyRoundToContent({
  source: GEOGRAPHY_QUESTIONS.filter((question) => question.roundId === "quick-picks"),
  category: "geography",
  idPrefix: "geo-qp",
  defaultTags: ["geography", "capital-cities"],
});
