export const ICONS = {
  "solo-mode": "/icons/solo-mode.png",
  multiplayer: "/icons/multiplayer.png",
  "general-knowledge": "/icons/general-knowledge.png",
  science: "/icons/science.png",
  geography: "/icons/geography.png",
  history: "/icons/history.png",
  mixed: "/icons/mixed.png",
  "fast-rounds": "/icons/fast-rounds.png",
  "score-big": "/icons/score-big.png",
  "party-ready": "/icons/party-ready.png",
} as const;

export type IconName = keyof typeof ICONS;

/** Design spec: 3D pastel rounded-square tiles on cream, pink/blue/lime accents. */
export const ICON_OBJECTS: Record<IconName, string> = {
  "general-knowledge": "Brain",
  science: "Microscope",
  geography: "Globe",
  history: "Ancient Scroll",
  mixed: "Dice Cube",
  "fast-rounds": "Lightning Bolt",
  "party-ready": "Target",
  "score-big": "Star Badge",
  "solo-mode": "Single Player Silhouette",
  multiplayer: "Group Of Players",
};

export const CATEGORY_ICON_MAP: Record<string, IconName> = {
  general: "general-knowledge",
  science: "science",
  geography: "geography",
  history: "history",
  mixed: "mixed",
};

export const FEATURE_ICONS = [
  { icon: "fast-rounds" as const, label: "Fast rounds" },
  { icon: "score-big" as const, label: "Score big" },
  { icon: "party-ready" as const, label: "Party ready" },
];

export function getIconPath(name: IconName): string {
  return ICONS[name];
}
