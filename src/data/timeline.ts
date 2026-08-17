import type { ChapterScene, Milestone, SceneProp } from "@/types/timeline";

export const TREE_SRCS = [
  "/illustrations/props/tree-1.png",
  "/illustrations/props/tree-2.png",
  "/illustrations/props/tree-3.png",
] as const;

/** Stable seeded PRNG so tree mix is random but doesn't reshuffle on re-render. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFrom(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Pick a tree asset for a chapter slot (stable per chapter+slot).
 * Placement is explicit — no random positions (avoids tree/building overlap).
 */
function pickTree(chapterId: string, slot: string): (typeof TREE_SRCS)[number] {
  const rand = mulberry32(seedFrom(`tree:${chapterId}:${slot}`));
  return TREE_SRCS[Math.floor(rand() * TREE_SRCS.length)];
}

const LANTERN_SRCS = [
  "/illustrations/props/lantern-1.png",
  "/illustrations/props/lantern-2.png",
] as const;

/** Bicycle props — scattered along the journey. */
const SCENERY_SRCS = [
  "/illustrations/props/bicycle-1.png",
  "/illustrations/props/bicycle-2.png",
] as const;

/** Road props that scroll with trees/buildings (not the faster FG parallax strip). */
export function isWorldSyncedRoadProp(src: string): boolean {
  return /\/(tree-|bush-|lantern-|signpost-|bench-|bicycle-)/.test(src);
}

/**
 * Poles sit centered on the chapter seam — midpoint between this landmark
 * and the neighboring one (left edge = prev|this, right edge = this|next).
 */
function streetLight(side: "left" | "right", variant: 0 | 1 = side === "left" ? 0 : 1): SceneProp {
  return {
    layer: "fg",
    src: LANTERN_SRCS[variant],
    className:
      side === "left"
        ? "absolute left-0 z-[9] w-[16%] max-w-[118px] -translate-x-1/2 origin-bottom object-contain object-bottom opacity-95"
        : "absolute left-full z-[9] w-[16%] max-w-[118px] -translate-x-1/2 origin-bottom object-contain object-bottom opacity-95",
  };
}

/**
 * Trees only in the open roadside bands beside landmarks (~0–22% / 78–100%).
 * - edge: near the chapter seam
 * - inner: deeper in the gap, still clear of the centered building
 * Slots on the same side are spaced so overlap stays under ~30%.
 */
function tree(
  src: (typeof TREE_SRCS)[number],
  side: "left" | "right",
  slot: "edge" | "inner" = "edge",
): SceneProp {
  const pos =
    side === "left"
      ? slot === "edge"
        ? "left-[1%]"
        : "left-[14%]"
      : slot === "edge"
        ? "right-[1%]"
        : "right-[14%]";
  const size =
    slot === "edge"
      ? "w-[26%] max-w-[252px] md:w-[23%] md:max-w-[284px]"
      : "w-[21%] max-w-[210px] md:w-[20%] md:max-w-[242px]";

  return {
    layer: "fg",
    src,
    className: `absolute ${pos} z-[8] ${size} origin-bottom object-contain object-bottom opacity-100 [backface-visibility:hidden]`,
  };
}

/** Convenience: one or both safe tree slots on a side. */
function treesOn(
  chapterId: string,
  side: "left" | "right",
  slots: Array<"edge" | "inner">,
): SceneProp[] {
  return slots.map((slot) => tree(pickTree(chapterId, `${side}-${slot}`), side, slot));
}

/** Bushes near the outer gap — nudge keeps them from lining up chapter to chapter. */
function bush(
  src: string,
  side: "left" | "right",
  nudge: 0 | 1 | 2 | 3 = 0,
): SceneProp {
  const left = ["left-[2%]", "left-[5%]", "left-[8%]", "left-[11%]"][nudge];
  const right = ["right-[2%]", "right-[5%]", "right-[8%]", "right-[11%]"][nudge];
  return {
    layer: "fg",
    src,
    className:
      side === "left"
        ? `absolute ${left} z-[11] w-[9%] max-w-[68px] origin-bottom object-contain object-bottom opacity-100`
        : `absolute ${right} z-[11] w-[9%] max-w-[68px] origin-bottom object-contain object-bottom opacity-100`,
  };
}

function signboard(
  src: string,
  side: "left" | "right",
  nudge: 0 | 1 | 2 = 0,
): SceneProp {
  const left = ["left-[11%]", "left-[14%]", "left-[9%]"][nudge];
  const right = ["right-[11%]", "right-[14%]", "right-[9%]"][nudge];
  return {
    layer: "fg",
    src,
    className:
      side === "left"
        ? `absolute ${left} z-[9] w-[11%] max-w-[82px] origin-bottom object-contain object-bottom opacity-95`
        : `absolute ${right} z-[9] w-[11%] max-w-[82px] origin-bottom object-contain object-bottom opacity-95`,
  };
}

/** Bench in the open gap — sits past the outer tree band. */
function bench(
  src: string,
  side: "left" | "right" = "left",
  nudge: 0 | 1 | 2 = 0,
): SceneProp {
  const left = ["left-[20%]", "left-[22%]", "left-[18%]"][nudge];
  const right = ["right-[20%]", "right-[22%]", "right-[18%]"][nudge];
  return {
    layer: "fg",
    src,
    className:
      side === "left"
        ? `absolute ${left} z-[9] w-[12%] max-w-[96px] origin-bottom object-contain object-bottom opacity-100`
        : `absolute ${right} z-[9] w-[12%] max-w-[96px] origin-bottom object-contain object-bottom opacity-100`,
  };
}

/**
 * Bicycle scenery in the open gap beside landmarks.
 * Kept near the outer edge, in front of trees.
 */
function sceneryProp(
  src: (typeof SCENERY_SRCS)[number],
  side: "left" | "right",
  nudge: 0 | 1 | 2 = 0,
): SceneProp {
  const left = ["left-[4%]", "left-[7%]", "left-[2%]"][nudge];
  const right = ["right-[4%]", "right-[7%]", "right-[2%]"][nudge];
  return {
    layer: "fg",
    src,
    className:
      side === "left"
        ? `absolute ${left} z-[10] w-[11%] max-w-[88px] origin-bottom object-contain object-bottom opacity-95`
        : `absolute ${right} z-[10] w-[11%] max-w-[88px] origin-bottom object-contain object-bottom opacity-95`,
  };
}

export const milestones: Milestone[] = [
  {
    id: "m-prologue",
    chapterId: "prologue",
    title: "Aditya Dutta",
    description:
      "Scroll to walk with me — from a small-town classroom in Nadaun to building product UI today.",
    organization: "AD.",
    dateLabel: "Start",
    illustration: "/illustrations/scenes/prologue/path-start.png",
    kind: "atmosphere",
    highlight: "#E8A87C",
  },
  {
    id: "m-schooling",
    chapterId: "schooling",
    title: "Schooling",
    description:
      "10th and 12th at a government senior secondary school — foundations, friends, and the first long road ahead.",
    location: "Nadaun",
    organization: "Govt. Senior Secondary School, Nadaun",
    dateLabel: "2008 – 2012",
    illustration: "/illustrations/scenes/schooling/card.svg",
    kind: "milestone",
    highlight: "#5B9BD5",
  },
  {
    id: "m-bachelors",
    chapterId: "bachelors",
    title: "Bachelors — BCA",
    description:
      "Bachelor of Computer Applications — first deep dive into computing, logic, and building things on a screen.",
    location: "Hamirpur",
    organization: "Govt. Degree College, Hamirpur",
    dateLabel: "2012 – 2015",
    illustration: "/illustrations/scenes/bachelors/card.svg",
    kind: "milestone",
    highlight: "#3D9B8F",
  },
  {
    id: "m-niit",
    chapterId: "niit",
    title: "NIIT — Java",
    description:
      "A focused year learning Java — structure, discipline, and the craft of writing real software.",
    organization: "NIIT",
    dateLabel: "2015 – 2016",
    illustration: "/illustrations/scenes/niit/card.svg",
    kind: "milestone",
    highlight: "#D4A017",
  },
  {
    id: "m-masters",
    chapterId: "masters",
    title: "Masters — MCA",
    description:
      "Master of Computer Applications at Chandigarh University — bigger campus, deeper systems, late-night builds.",
    location: "Chandigarh",
    organization: "Chandigarh University",
    dateLabel: "2016 – 2018",
    illustration: "/illustrations/scenes/masters/card.svg",
    kind: "milestone",
    highlight: "#6B8CAE",
  },
  {
    id: "m-internship",
    chapterId: "internship",
    title: "Internship",
    description:
      "Six months at Codnostic Solutions — first professional desk, first real shipping pressure.",
    organization: "Codnostic Solutions",
    dateLabel: "Feb 2018 – Oct 2018",
    illustration: "/illustrations/scenes/internship/card.svg",
    kind: "milestone",
    highlight: "#E07A5F",
  },
  {
    id: "m-kabera",
    chapterId: "kabera",
    title: "Junior UI Developer",
    description:
      "First UI role — turning designs into interfaces and learning the rhythm of product work.",
    organization: "Kabera Global",
    dateLabel: "Nov 2018 – May 2019",
    illustration: "/illustrations/scenes/kabera/card.svg",
    kind: "milestone",
    highlight: "#7A9E7E",
  },
  {
    id: "m-virtual-kpo",
    chapterId: "virtual-kpo",
    title: "Junior UI Developer",
    description:
      "Growing as a junior UI developer — longer tenure, sharper craft, more ownership of the interface.",
    organization: "Virtual KPO",
    dateLabel: "Jun 2019 – Oct 2021",
    illustration: "/illustrations/scenes/virtual-kpo/card.svg",
    kind: "milestone",
    highlight: "#C4785A",
  },
  {
    id: "m-illuminz",
    chapterId: "illuminz",
    title: "Senior UI Developer",
    description:
      "Stepped up to senior — leading UI craft, refining systems, and shipping with more intention.",
    organization: "Illuminz",
    dateLabel: "Nov 2021 – Feb 2023",
    illustration: "/illustrations/scenes/illuminz/card.svg",
    kind: "milestone",
    highlight: "#2A9D8F",
  },
  {
    id: "m-shyftlabs",
    chapterId: "shyftlabs",
    title: "Senior UI Developer",
    description:
      "Building polished product experiences at ShyftLabs — where the road is today.",
    organization: "ShyftLabs",
    dateLabel: "Feb 2023 – Present",
    illustration: "/illustrations/scenes/shyftlabs/card.svg",
    kind: "milestone",
    highlight: "#C9A227",
  },
  {
    id: "m-horizon",
    chapterId: "horizon",
    title: "What’s next",
    description:
      "Still walking. Let’s build something thoughtful together — interfaces that feel calm, clear, and alive.",
    dateLabel: "Future",
    kind: "cta",
    highlight: "#D4B896",
  },
];

export const chapters: ChapterScene[] = [
  {
    id: "prologue",
    startYear: 2008,
    endYear: 2008,
    era: "prologue",
    label: "AD.",
    title: "Aditya Dutta",
    palette: "prologue",
    heroSrc: "/illustrations/scenes/prologue/path-start.png",
    props: [
      streetLight("left", 0),
      bush("/illustrations/props/bush-1.png", "right", 1),
      ...treesOn("prologue", "right", ["edge", "inner"]),
    ],
    milestones: ["m-prologue"],
  },
  {
    id: "schooling",
    startYear: 2008,
    endYear: 2012,
    era: "education",
    label: "2008",
    title: "Schooling",
    palette: "education",
    heroSrc: "/illustrations/scenes/schooling/building.png",
    props: [
      bush("/illustrations/props/bush-2.png", "left", 0),
      ...treesOn("schooling", "left", ["edge", "inner"]),
      signboard("/illustrations/props/signpost-1.png", "right", 1),
      streetLight("right", 1),
      ...treesOn("schooling", "right", ["edge"]),
    ],
    milestones: ["m-schooling"],
  },
  {
    id: "bachelors",
    startYear: 2012,
    endYear: 2015,
    era: "education",
    label: "2012",
    title: "Bachelors",
    palette: "education",
    heroSrc: "/illustrations/scenes/bachelors/college.png",
    props: [
      bench("/illustrations/props/bench-1.png", "left", 1),
      ...treesOn("bachelors", "left", ["edge"]),
      bush("/illustrations/props/bush-1.png", "right", 2),
      ...treesOn("bachelors", "right", ["edge", "inner"]),
    ],
    milestones: ["m-bachelors"],
  },
  {
    id: "niit",
    startYear: 2015,
    endYear: 2016,
    era: "training",
    label: "2015",
    title: "NIIT",
    palette: "training",
    heroSrc: "/illustrations/scenes/niit/classroom.png",
    props: [
      bush("/illustrations/props/bush-2.png", "left", 2),
      ...treesOn("niit", "left", ["edge", "inner"]),
      signboard("/illustrations/props/signpost-3.png", "right", 0),
      ...treesOn("niit", "right", ["edge", "inner"]),
    ],
    milestones: ["m-niit"],
  },
  {
    id: "masters",
    startYear: 2016,
    endYear: 2018,
    era: "education",
    label: "2016",
    title: "Masters",
    palette: "education",
    heroSrc: "/illustrations/scenes/masters/university.png",
    props: [
      sceneryProp(SCENERY_SRCS[0], "left", 1),
      ...treesOn("masters", "left", ["inner"]),
      bush("/illustrations/props/bush-1.png", "right", 0),
      ...treesOn("masters", "right", ["edge", "inner"]),
      streetLight("left", 0),
    ],
    milestones: ["m-masters"],
  },
  {
    id: "internship",
    startYear: 2018,
    endYear: 2018,
    era: "career",
    label: "2018",
    title: "Internship",
    palette: "career",
    heroSrc: "/illustrations/scenes/internship/office.png",
    props: [
      bench("/illustrations/props/bench-2.png", "left", 0),
      ...treesOn("internship", "left", ["edge", "inner"]),
      signboard("/illustrations/props/signpost-2.png", "right", 2),
      streetLight("right", 1),
      ...treesOn("internship", "right", ["edge"]),
    ],
    milestones: ["m-internship"],
  },
  {
    id: "kabera",
    startYear: 2018,
    endYear: 2019,
    era: "career",
    label: "2018",
    title: "Kabera",
    palette: "career",
    heroSrc: "/illustrations/scenes/kabera/office.png",
    props: [
      bush("/illustrations/props/bush-2.png", "left", 3),
      ...treesOn("kabera", "left", ["edge", "inner"]),
      sceneryProp(SCENERY_SRCS[1], "right", 0),
      ...treesOn("kabera", "right", ["inner"]),
    ],
    milestones: ["m-kabera"],
  },
  {
    id: "virtual-kpo",
    startYear: 2019,
    endYear: 2021,
    era: "career",
    label: "2019",
    title: "Virtual KPO",
    palette: "career",
    heroSrc: "/illustrations/scenes/virtual-kpo/office.png",
    props: [
      bench("/illustrations/props/bench-1.png", "left", 2),
      ...treesOn("virtual-kpo", "left", ["edge"]),
      bush("/illustrations/props/bush-1.png", "right", 1),
      ...treesOn("virtual-kpo", "right", ["edge", "inner"]),
    ],
    milestones: ["m-virtual-kpo"],
  },
  {
    id: "illuminz",
    startYear: 2021,
    endYear: 2023,
    era: "career",
    label: "2021",
    title: "Illuminz",
    palette: "career",
    heroSrc: "/illustrations/scenes/illuminz/office.png",
    props: [
      bush("/illustrations/props/bush-2.png", "left", 0),
      ...treesOn("illuminz", "left", ["edge", "inner"]),
      streetLight("left", 1),
      sceneryProp(SCENERY_SRCS[0], "right", 2),
      ...treesOn("illuminz", "right", ["inner"]),
    ],
    milestones: ["m-illuminz"],
  },
  {
    id: "shyftlabs",
    startYear: 2023,
    endYear: "present",
    era: "career",
    label: "2023",
    title: "ShyftLabs",
    palette: "career",
    heroSrc: "/illustrations/scenes/shyftlabs/office.png",
    props: [
      bench("/illustrations/props/bench-2.png", "left", 1),
      ...treesOn("shyftlabs", "left", ["edge", "inner"]),
      signboard("/illustrations/props/signpost-2.png", "right", 1),
      streetLight("right", 0),
      ...treesOn("shyftlabs", "right", ["edge"]),
    ],
    milestones: ["m-shyftlabs"],
  },
  {
    id: "horizon",
    startYear: 2026,
    endYear: "present",
    era: "horizon",
    label: "Now",
    title: "Horizon",
    palette: "horizon",
    props: [
      bush("/illustrations/props/bush-1.png", "left", 2),
      ...treesOn("horizon", "left", ["edge", "inner"]),
      sceneryProp(SCENERY_SRCS[1], "right", 1),
      ...treesOn("horizon", "right", ["edge", "inner"]),
    ],
    milestones: ["m-horizon"],
  },
];

export function getMilestoneById(id: string): Milestone | undefined {
  return milestones.find((m) => m.id === id);
}

export function getChapterMilestones(chapterId: string): Milestone[] {
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) return [];
  return chapter.milestones
    .map((id) => getMilestoneById(id))
    .filter((m): m is Milestone => Boolean(m));
}
