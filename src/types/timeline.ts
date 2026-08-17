export type MilestoneKind = "milestone" | "atmosphere" | "cta";

export type ParallaxLayer = "fg" | "mid" | "bg";

export type EraKind = "education" | "training" | "career" | "horizon" | "prologue";

export type SceneProp = {
  layer: ParallaxLayer;
  src: string;
  alt?: string;
  className?: string;
};

export type Milestone = {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  location?: string;
  organization?: string;
  dateLabel: string;
  illustration?: string;
  kind: MilestoneKind;
  /** Unique highlight color for the waypoint card */
  highlight: string;
};

export type ChapterScene = {
  id: string;
  startYear: number;
  endYear: number | "present";
  era: EraKind;
  label: string;
  title: string;
  palette: string;
  /** Landmark art; omit for card-only bookends (e.g. horizon). */
  heroSrc?: string;
  props: SceneProp[];
  milestones: string[];
};
