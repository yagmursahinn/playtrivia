export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is PlayTrivia?",
    answer:
      "PlayTrivia is a free browser-based trivia game with four unique quiz rounds, solo play, multiplayer mode and a daily challenge.",
  },
  {
    question: "Is PlayTrivia free?",
    answer: "Yes. PlayTrivia is completely free to play with no payment required.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No account is required. Your quiz progress, streak and achievements are saved locally in your browser.",
  },
  {
    question: "Can I play with friends?",
    answer:
      "Yes. Use multiplayer mode to add player names and compete through the same quiz on one device.",
  },
  {
    question: "How does Daily Challenge work?",
    answer:
      "Daily Challenge is a mixed-category quiz with ten questions that is the same for everyone each day. Complete it once per day and come back tomorrow for a new challenge.",
  },
];
