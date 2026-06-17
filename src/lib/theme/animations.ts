import type { Transition, Variants } from "framer-motion";

export const transitions = {
  micro: { duration: 0.18, ease: "easeOut" } satisfies Transition,
  fast: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } satisfies Transition,
  snappy: { duration: 0.2, ease: "easeOut" } satisfies Transition,
  spring: { type: "spring", stiffness: 500, damping: 32 } satisfies Transition,
} as const;

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

export const buttonHover = {
  scale: 1.02,
  transition: transitions.micro,
};

export const buttonTap = {
  scale: 0.98,
  transition: transitions.micro,
};

export const cardHover = {
  y: -3,
  scale: 1.01,
  transition: transitions.micro,
};

export const cardStackTransition = {
  duration: 0.38,
  ease: [0.25, 0.1, 0.25, 1],
} satisfies Transition;

export const cardStackTransitionFast = {
  duration: 0.28,
  ease: [0.25, 0.1, 0.25, 1],
} satisfies Transition;

export const cardStackEnter = {
  opacity: 0,
  y: 56,
  scale: 0.97,
};

export const cardStackActive = {
  opacity: 1,
  y: 0,
  scale: 1,
};

export const cardStackExitUp = {
  opacity: 0.35,
  y: -72,
  scale: 0.94,
};

export const cardStackOverlayEnter = {
  opacity: 0,
  y: 48,
  scale: 0.98,
};

export const shakeAnimation = {
  x: [0, -8, 8, -5, 5, 0],
  transition: { duration: 0.42, ease: "easeInOut" as const },
};

export const motionStyles = {
  willChange: "transform, opacity",
} as const;
