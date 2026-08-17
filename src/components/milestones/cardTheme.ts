import type { Milestone } from "@/types/timeline";
import { chapters } from "@/data/timeline";

/** Pastel neo-brutalist fills — stable per milestone id. */
const CARD_COLORS = [
  "#C4B5FD", // lavender
  "#86EFAC", // mint
  "#FDBA74", // peach
  "#F9A8D4", // pink
  "#7DD3FC", // sky
  "#FDE68A", // butter
  "#A5B4FC", // periwinkle
  "#FCA5A5", // coral
  "#6EE7B7", // emerald
  "#D8B4FE", // violet
  "#FDA4AF", // rose
] as const;

export type TitleFontVariant = "display" | "sans" | "accent";

const TITLE_FONTS: TitleFontVariant[] = ["display", "sans", "accent"];

function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function cardColor(milestoneId: string): string {
  return CARD_COLORS[hashId(milestoneId) % CARD_COLORS.length];
}

export function titleFontVariant(milestoneId: string): TitleFontVariant {
  return TITLE_FONTS[hashId(`font:${milestoneId}`) % TITLE_FONTS.length];
}

export function titleFontClass(variant: TitleFontVariant): string {
  switch (variant) {
    case "display":
      return "font-[family-name:var(--font-display)] font-semibold tracking-[-0.02em]";
    case "sans":
      return "font-[family-name:var(--font-sans)] font-bold tracking-[-0.03em]";
    case "accent":
      return "font-[family-name:var(--font-accent)] font-bold tracking-[-0.03em]";
  }
}

export function cardBadge(milestone: Milestone): string {
  if (milestone.kind === "cta") return "NEXT / OPEN";
  if (milestone.kind === "atmosphere") return "START / SCROLL";
  if (milestone.chapterId === "internship") return "INTERNSHIP";

  const era = chapters.find((c) => c.id === milestone.chapterId)?.era;
  switch (era) {
    case "education":
      return "EDUCATION";
    case "training":
      return "TRAINING";
    case "career":
      return "FULL-TIME";
    default:
      return "JOURNEY";
  }
}

export type CardMark = "asterisk" | "dots" | "hash";

export function cardMark(milestoneId: string): CardMark {
  const marks: CardMark[] = ["asterisk", "dots", "hash"];
  return marks[hashId(`mark:${milestoneId}`) % marks.length];
}
