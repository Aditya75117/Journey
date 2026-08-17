import { chapters } from "./timeline";

export const ERA_ORDER = [
  "prologue",
  "education",
  "training",
  "career",
  "horizon",
] as const;

export function getChaptersByEra(era: string) {
  return chapters.filter((c) => c.era === era);
}

export const TOTAL_CHAPTERS = chapters.length;
