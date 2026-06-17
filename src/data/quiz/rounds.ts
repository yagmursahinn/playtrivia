import type { QuizRoundData } from "./types";

export const ROUND_META: Omit<QuizRoundData, "questions">[] = [
  {
    id: "quick-picks",
    number: 1,
    title: "Quick Picks",
    description: "Fast multiple choice to get you warmed up",
    questionType: "multiple-choice",
  },
  {
    id: "fill-the-gap",
    number: 2,
    title: "Fill The Gap",
    description: "Type the missing word or phrase",
    questionType: "fill-blank",
  },
  {
    id: "list-it",
    number: 3,
    title: "List It",
    description: "Name as many correct items as you can",
    questionType: "enumeration",
  },
  {
    id: "picture-round",
    number: 4,
    title: "Picture Round",
    description: "Identify the answer from the image",
    questionType: "picture-choice",
  },
];
