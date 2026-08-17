export const DARK_TOKENS = {
  bg: "#0B0D10",
  surface: "#14181F",
  surfaceElevated: "#1C222C",
  road: "#2A303A",
  roadLine: "#E8B86D",
  text: "#F2F0EB",
  textMuted: "#9AA3B2",
  accent: "#E8A87C",
  accentEducation: "#7EB6D9",
  accentCareer: "#6BB3A8",
  star: "#F5E6C8",
} as const;

export const PALETTE_BY_KEY: Record<
  string,
  { accent: string; glow: string; sky: string }
> = {
  prologue: {
    accent: "#E8A87C",
    glow: "rgba(232, 168, 124, 0.15)",
    sky: "#0B0D10",
  },
  education: {
    accent: "#7EB6D9",
    glow: "rgba(126, 182, 217, 0.18)",
    sky: "#0C1018",
  },
  training: {
    accent: "#A78BFA",
    glow: "rgba(167, 139, 250, 0.16)",
    sky: "#0D0B14",
  },
  career: {
    accent: "#6BB3A8",
    glow: "rgba(107, 179, 168, 0.16)",
    sky: "#0A1012",
  },
  horizon: {
    accent: "#F5E6C8",
    glow: "rgba(245, 230, 200, 0.12)",
    sky: "#07090E",
  },
};
