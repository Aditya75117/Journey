"use client";

import { useJourney } from "@/hooks/useActiveChapter";
import { PARALLAX_SPEEDS } from "@/constants/parallaxSpeeds";

type Props = {
  layer: "fg" | "mid" | "bg";
  children: React.ReactNode;
  className?: string;
  totalTravel: number;
};

/** Extra horizontal drift relative to the scrubbed world track */
export function ParallaxDrift({
  layer,
  children,
  className = "",
  totalTravel,
}: Props) {
  const { scrollProgress } = useJourney();
  const speed =
    layer === "fg"
      ? PARALLAX_SPEEDS.fg
      : layer === "bg"
        ? PARALLAX_SPEEDS.bg
        : PARALLAX_SPEEDS.mid;
  const x = -scrollProgress * totalTravel * (speed - 1) * 0.35;

  return (
    <div
      className={`will-change-transform ${className}`}
      style={{ transform: `translate3d(${x}px, 0, 0)` }}
      data-parallax={layer}
    >
      {children}
    </div>
  );
}
