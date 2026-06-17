import { SCIENCE_QUESTIONS } from "@/data/quiz/categories/science";
import { legacyRoundToContent } from "../shared";

export const QUESTIONS = legacyRoundToContent({
  source: SCIENCE_QUESTIONS.filter((question) => question.roundId === "list-it"),
  category: "science",
  idPrefix: "sci-li",
  defaultTags: ["science", "space"],
});
