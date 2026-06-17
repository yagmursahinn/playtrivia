"use client";

import { motion } from "framer-motion";
import { pageTransition, transitions, motionStyles } from "@/lib/theme/animations";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      transition={transitions.fast}
      style={motionStyles}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
