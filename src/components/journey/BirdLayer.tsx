"use client";

import type { CSSProperties } from "react";

type BirdSpec = {
  /** front = symmetric V; side = same stroke style, asymmetric / flying left */
  kind: "front" | "side";
  left: number;
  top: string;
  size: number;
  opacity: number;
  flip: boolean;
  flockY: number;
  flapDuration: number;
  flapDelay: number;
  variant: 0 | 1 | 2;
};

type Props = {
  width: number;
};

const FRONT_LANES = [
  { top: "14%", size: 44, opacity: 0.75, offset: 60 },
  { top: "24%", size: 34, opacity: 0.58, offset: 180 },
  { top: "18%", size: 52, opacity: 0.68, offset: -30 },
  { top: "28%", size: 28, opacity: 0.52, offset: 100 },
] as const;

const SIDE_LANES = [
  { top: "16%", size: 46, opacity: 0.78, offset: 160 },
  { top: "26%", size: 36, opacity: 0.6, offset: 40 },
  { top: "20%", size: 50, opacity: 0.7, offset: 240 },
  { top: "30%", size: 32, opacity: 0.55, offset: 100 },
] as const;

function buildBirds(width: number): BirdSpec[] {
  const birds: BirdSpec[] = [];

  const frontSpacing = 520;
  const frontFlocks = Math.max(5, Math.ceil(width / frontSpacing) + 1);
  for (let f = 0; f < frontFlocks; f++) {
    const lane = FRONT_LANES[f % FRONT_LANES.length];
    const flockSize = 1 + (f % 3);
    const baseLeft = f * frontSpacing + lane.offset;

    for (let b = 0; b < flockSize; b++) {
      birds.push({
        kind: "front",
        left: baseLeft + b * 28 + ((f * 13) % 18),
        top: lane.top,
        size: Math.max(22, lane.size - b * 4),
        opacity: lane.opacity - b * 0.06,
        flip: (f + b) % 4 === 0,
        flockY: b * 10 - (flockSize - 1) * 4,
        flapDuration: 0.38 + ((f + b) % 4) * 0.08,
        flapDelay: (f * 0.17 + b * 0.09) % 0.5,
        variant: ((f + b) % 3) as 0 | 1 | 2,
      });
    }
  }

  // Side-facing: same line style, angled for leftward flight — scroll-only
  const sideSpacing = 600;
  const sideFlocks = Math.max(4, Math.ceil(width / sideSpacing) + 1);
  for (let f = 0; f < sideFlocks; f++) {
    const lane = SIDE_LANES[f % SIDE_LANES.length];
    const flockSize = 1 + (f % 2);
    const baseLeft = f * sideSpacing + lane.offset + 180;

    for (let b = 0; b < flockSize; b++) {
      birds.push({
        kind: "side",
        left: baseLeft + b * 32,
        top: lane.top,
        size: Math.max(24, lane.size - b * 6),
        opacity: lane.opacity - b * 0.07,
        flip: false, // already drawn facing left
        flockY: b * 12,
        flapDuration: 0.34 + ((f + b) % 3) * 0.07,
        flapDelay: (f * 0.19 + b * 0.1) % 0.5,
        variant: ((f + b) % 3) as 0 | 1 | 2,
      });
    }
  }

  return birds;
}

/** Front-facing symmetric V. */
function FrontBird({
  size,
  variant,
  flapDuration,
  flapDelay,
}: {
  size: number;
  variant: 0 | 1 | 2;
  flapDuration: number;
  flapDelay: number;
}) {
  const shapes = [
    { vb: "0 0 80 40", body: [40, 22], left: "M40 22 Q25 6 8 26", right: "M40 22 Q55 6 72 26" },
    { vb: "0 0 64 36", body: [32, 20], left: "M32 20 Q20 4 6 28", right: "M32 20 Q44 4 58 28" },
    { vb: "0 0 72 32", body: [36, 18], left: "M36 18 Q22 6 6 22", right: "M36 18 Q50 6 66 22" },
  ] as const;
  const shape = shapes[variant];
  const [bx, by] = shape.body;

  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox={shape.vb}
      fill="none"
      className="overflow-visible"
      aria-hidden
    >
      <g
        className="bird-wing bird-wing-left"
        style={
          {
            transformOrigin: `${bx}px ${by}px`,
            animationDuration: `${flapDuration}s`,
            animationDelay: `${flapDelay}s`,
          } as CSSProperties
        }
      >
        <path
          d={shape.left}
          stroke="#1A1F28"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <g
        className="bird-wing bird-wing-right"
        style={
          {
            transformOrigin: `${bx}px ${by}px`,
            animationDuration: `${flapDuration}s`,
            animationDelay: `${flapDelay}s`,
          } as CSSProperties
        }
      >
        <path
          d={shape.right}
          stroke="#1A1F28"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <circle cx={bx} cy={by} r="1.6" fill="#1A1F28" />
    </svg>
  );
}

/**
 * Side-facing bird — same stroke V language as front birds,
 * but skewed: longer leading wing left, shorter trailing wing right,
 * so it reads as flying left in profile.
 */
function SideBird({
  size,
  variant,
  flapDuration,
  flapDelay,
}: {
  size: number;
  variant: 0 | 1 | 2;
  flapDuration: number;
  flapDelay: number;
}) {
  // Joint shifted right of center; left wing longer (leading), right foreshortened (trailing)
  const shapes = [
    {
      vb: "0 0 80 40",
      body: [46, 24],
      lead: "M46 24 Q28 4 4 22",
      trail: "M46 24 Q58 10 72 28",
    },
    {
      vb: "0 0 70 36",
      body: [40, 22],
      lead: "M40 22 Q24 3 2 20",
      trail: "M40 22 Q52 9 64 26",
    },
    {
      vb: "0 0 76 38",
      body: [44, 23],
      lead: "M44 23 Q26 5 3 21",
      trail: "M44 23 Q56 11 70 27",
    },
  ] as const;
  const shape = shapes[variant];
  const [bx, by] = shape.body;

  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox={shape.vb}
      fill="none"
      className="overflow-visible"
      aria-hidden
    >
      <g
        className="bird-wing bird-wing-left"
        style={
          {
            transformOrigin: `${bx}px ${by}px`,
            animationDuration: `${flapDuration}s`,
            animationDelay: `${flapDelay}s`,
          } as CSSProperties
        }
      >
        <path
          d={shape.lead}
          stroke="#1A1F28"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <g
        className="bird-wing bird-wing-right"
        style={
          {
            transformOrigin: `${bx}px ${by}px`,
            animationDuration: `${flapDuration}s`,
            animationDelay: `${flapDelay}s`,
          } as CSSProperties
        }
      >
        <path
          d={shape.trail}
          stroke="#1A1F28"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <circle cx={bx} cy={by} r="1.6" fill="#1A1F28" />
    </svg>
  );
}

/** Scatter birds along the journey — motion comes only from scroll parallax. */
export function BirdLayer({ width }: Props) {
  const birds = buildBirds(width);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-1 h-[45%] md:h-[40%]"
      style={{ width }}
      aria-hidden
    >
      {birds.map((bird, i) => (
        <div
          key={i}
          className="absolute backface-hidden"
          style={{
            left: bird.left,
            top: bird.top,
            opacity: bird.opacity,
            marginTop: bird.flockY,
          }}
        >
          <div
            className="bird-flyer"
            style={{
              transform: bird.flip ? "scaleX(-1)" : undefined,
              animationDelay: `${bird.flapDelay}s`,
            }}
          >
            {bird.kind === "side" ? (
              <SideBird
                size={bird.size}
                variant={bird.variant}
                flapDuration={bird.flapDuration}
                flapDelay={bird.flapDelay}
              />
            ) : (
              <FrontBird
                size={bird.size}
                variant={bird.variant}
                flapDuration={bird.flapDuration}
                flapDelay={bird.flapDelay}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
