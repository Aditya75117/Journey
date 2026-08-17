"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PARALLAX_SPEEDS } from "@/constants/parallaxSpeeds";
import type { ParallaxLayer } from "@/types/timeline";

type Props = {
  layer: ParallaxLayer;
  children: React.ReactNode;
  className?: string;
  progress: number;
  totalTravel: number;
};

export function ParallaxLayerView({
  layer,
  children,
  className = "",
  progress,
  totalTravel,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const speed =
    layer === "fg"
      ? PARALLAX_SPEEDS.fg
      : layer === "bg"
        ? PARALLAX_SPEEDS.bg
        : PARALLAX_SPEEDS.mid;

  useEffect(() => {
    if (!ref.current) return;
    const offset = -progress * totalTravel * (speed - 1);
    gsap.set(ref.current, { x: offset, force3D: true });
  }, [progress, totalTravel, speed]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 will-change-transform ${className}`}
      data-parallax={layer}
      aria-hidden
    >
      {children}
    </div>
  );
}
