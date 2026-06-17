export const colors = {
  pink: "#fb64d0",
  blue: "#59b0f7",
  lime: "#e2ef5f",
  cream: "#fffdf1",
  dark: "#1a1a2e",
} as const;

export type ThemeColor = keyof typeof colors;

export const colorVariants = {
  pink: {
    base: colors.pink,
    light: "#feccef",
    dark: "#e040b8",
    shadow: "rgba(251, 100, 208, 0.35)",
  },
  blue: {
    base: colors.blue,
    light: "#b8dcfa",
    dark: "#3a96e8",
    shadow: "rgba(89, 176, 247, 0.35)",
  },
  lime: {
    base: colors.lime,
    light: "#f0f7b8",
    dark: "#c8d84a",
    shadow: "rgba(226, 239, 95, 0.35)",
  },
  cream: {
    base: colors.cream,
    light: "#ffffff",
    dark: "#f5f0d9",
    shadow: "rgba(26, 26, 46, 0.08)",
  },
  dark: {
    base: colors.dark,
    light: "#2d2d44",
    dark: "#0f0f1a",
    shadow: "rgba(26, 26, 46, 0.25)",
  },
} as const;
