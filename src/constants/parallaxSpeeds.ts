export const PARALLAX_SPEEDS = {
  /** High clouds — drift above peaks */
  clouds: 0.144,
  /** Flying birds — between clouds and mountains */
  birds: 0.32,
  /** Distant mountains */
  mountain: 0.22,
  /** City skyline — faster than mountains, slower than road */
  cityscape: 0.55,
  fg: 1.2,
  road: 1,
  mid: 0.62,
  bg: 0.28,
} as const;

/** Desktop chapter width in px */
export const CHAPTER_WIDTH_DESKTOP = 1100;

/** Mobile chapter width in px */
export const CHAPTER_WIDTH_MOBILE = 720;

/** Vertical scroll distance multiplier per chapter */
export const SCROLL_DENSITY = 1.7;

/** Lenis velocity threshold to play walk cycle */
export const WALK_VELOCITY_THRESHOLD = 0.08;
