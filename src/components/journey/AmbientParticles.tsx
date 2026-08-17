"use client";

import { useMemo } from "react";
import type { EraKind } from "@/types/timeline";

type ParticleKind = "dust" | "firefly" | "star";

type Particle = {
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
  kind: ParticleKind;
};

type Props = {
  era: EraKind;
  /** Soften when chapter is not active */
  active: boolean;
  reducedMotion?: boolean;
};

function seedFrom(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function particlesForEra(era: EraKind): Particle[] {
  const rand = mulberry32(seedFrom(`ambient:${era}`));
  const out: Particle[] = [];

  const push = (count: number, kind: ParticleKind, band: [number, number]) => {
    for (let i = 0; i < count; i++) {
      out.push({
        kind,
        left: `${8 + rand() * 84}%`,
        top: `${band[0] + rand() * (band[1] - band[0])}%`,
        size: kind === "star" ? 1.5 + rand() * 1.5 : 2 + rand() * 3,
        delay: rand() * 4,
        duration: kind === "firefly" ? 2.2 + rand() * 2 : 5 + rand() * 6,
      });
    }
  };

  switch (era) {
    case "prologue":
      push(10, "dust", [45, 78]);
      push(4, "star", [8, 28]);
      break;
    case "education":
      push(14, "dust", [40, 75]);
      break;
    case "training":
      push(8, "dust", [42, 72]);
      break;
    case "career":
      push(12, "firefly", [35, 70]);
      push(4, "dust", [50, 78]);
      break;
    case "horizon":
      push(18, "star", [6, 42]);
      push(4, "dust", [55, 80]);
      break;
  }

  return out;
}

/**
 * Quiet era-aware atmosphere — dust, lamp sparks, stars.
 * Hidden entirely when prefers-reduced-motion.
 */
export function AmbientParticles({
  era,
  active,
  reducedMotion = false,
}: Props) {
  const particles = useMemo(() => particlesForEra(era), [era]);

  if (reducedMotion || particles.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[12] overflow-hidden transition-opacity duration-700"
      style={{ opacity: active ? 0.9 : 0.35 }}
      aria-hidden
    >
      {particles.map((p, i) => (
        <span
          key={`${p.kind}-${i}`}
          className={
            p.kind === "firefly"
              ? "ambient-firefly absolute rounded-full"
              : p.kind === "star"
                ? "ambient-star absolute rounded-full"
                : "ambient-dust absolute rounded-full"
          }
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
