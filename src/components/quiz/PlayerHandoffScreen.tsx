"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { fadeInUp, transitions } from "@/lib/theme/animations";

type PlayerHandoffScreenProps = {
  playerName: string;
  onContinue: () => void;
};

export function PlayerHandoffScreen({ playerName, onContinue }: PlayerHandoffScreenProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={transitions.fast}
      className="mx-auto flex max-w-md flex-col items-center text-center"
    >
      <Icon name="multiplayer" size="2xl" />
      <h2 className="mt-6 font-display text-3xl font-extrabold text-dark sm:text-4xl">
        Pass the device
      </h2>
      <p className="mt-4 font-body text-lg font-semibold text-dark/60">
        Hand the screen to
      </p>
      <p className="mt-2 font-display text-2xl font-extrabold text-blue">{playerName}</p>
      <p className="mt-4 font-body text-sm font-semibold text-dark/50">
        They will play the full quiz from Round 1
      </p>
      <div className="mt-8 w-full sm:w-auto">
        <Button variant="secondary" size="xl" fullWidth onClick={onContinue}>
          Ready — Start Quiz
        </Button>
      </div>
    </motion.div>
  );
}
