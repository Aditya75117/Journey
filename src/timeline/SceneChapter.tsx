"use client";

import { useState, type CSSProperties } from "react";
import type { ChapterScene } from "@/types/timeline";
import { getChapterMilestones, isWorldSyncedRoadProp } from "@/data/timeline";
import { MilestoneMarker } from "@/components/milestones/MilestoneMarker";
import { AmbientParticles } from "@/components/journey/AmbientParticles";
import { PALETTE_BY_KEY } from "@/constants/colors";

type Props = {
  chapter: ChapterScene;
  width: number;
  index: number;
  active: boolean;
  near: boolean;
  onFocusMilestone: (id: string | null) => void;
  focusedMilestoneId: string | null;
  totalTravel: number;
  /** When true, bg/fg are rendered by parent parallax strips */
  simplifyParallax?: boolean;
  reducedMotion?: boolean;
};

function SceneImage({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`rounded-2xl bg-[#1C222C]/80 ring-1 ring-white/5 ${className ?? ""}`}
        style={style}
        aria-hidden
      />
    );
  }
  // Plain img avoids Next/Image re-decode flicker while the world translates
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      draggable={false}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

/** Landmarks plant just above the road; rooftop caption stacks above the art. */
const LANDMARK_BOTTOM = { bottom: "var(--landmark-bottom)" } as const;

export function SceneChapter({
  chapter,
  width,
  index,
  active,
  near,
  onFocusMilestone,
  focusedMilestoneId,
  simplifyParallax = false,
  reducedMotion = false,
}: Props) {
  const milestones = getChapterMilestones(chapter.id);
  const palette = PALETTE_BY_KEY[chapter.palette] ?? PALETTE_BY_KEY.prologue;
  const showCaption = near || active;

  return (
    <section
      className="relative h-full shrink-0"
      style={{ width }}
      data-chapter={chapter.id}
      data-index={index}
      aria-label={`${chapter.title}, ${chapter.label}`}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse 55% 35% at 50% 40%, ${palette.glow}, transparent 72%)`,
        }}
      />

      <AmbientParticles
        era={chapter.era}
        active={active}
        reducedMotion={reducedMotion}
      />

      {!simplifyParallax &&
        chapter.props
          .filter((p) => p.layer === "bg")
          .map((prop, i) => (
            <SceneImage
              key={`bg-${i}`}
              src={prop.src}
              alt=""
              className="absolute bottom-[38%] left-[8%] z-2 w-[40%] max-w-[280px] opacity-40"
            />
          ))}

      {chapter.props
        .filter((p) => p.layer === "mid")
        .map((prop, i) => (
          <SceneImage
            key={`mid-${i}`}
            src={prop.src}
            alt={prop.alt ?? ""}
            className={
              prop.className ??
              "absolute right-[4%] z-2 w-[16%] max-w-[110px] opacity-50"
            }
            style={LANDMARK_BOTTOM}
          />
        ))}

      {!simplifyParallax &&
        chapter.props
          .filter(
            (p) => p.layer === "fg" && !isWorldSyncedRoadProp(p.src),
          )
          .map((prop, i) => (
            <SceneImage
              key={`fg-${i}`}
              src={prop.src}
              alt=""
              className={
                prop.className ??
                `absolute z-2 w-[16%] max-w-[110px] opacity-50 ${
                  i % 2 === 0 ? "left-[4%]" : "right-[10%]"
                }`
              }
              style={LANDMARK_BOTTOM}
            />
          ))}

      {/* World-synced road props when not using parent strip */}
      {!simplifyParallax &&
        chapter.props
          .filter((p) => p.layer === "fg" && isWorldSyncedRoadProp(p.src))
          .map((prop, i) => (
            <SceneImage
              key={`road-${i}`}
              src={prop.src}
              alt=""
              className={
                prop.className ??
                `absolute z-2 w-[26%] max-w-[180px] opacity-100 ${
                  i % 2 === 0 ? "left-0" : "right-0"
                }`
              }
              style={{
                bottom:
                  prop.src.includes("/bush-") || prop.src.includes("/bench-")
                    ? "var(--bushes-bottom)"
                    : "var(--trees-bottom)",
              }}
            />
          ))}

      {/* Stacked unit: rooftop caption → landmark (feet on road) */}
      <div
        className="absolute left-1/2 z-28 flex w-[min(300px,86%)] -translate-x-1/2 flex-col items-center md:w-[min(340px,56%)]"
        style={LANDMARK_BOTTOM}
      >
        {showCaption && (
          <div className="relative z-20 mb-2 w-[min(300px,100%)] md:mb-2.5 md:w-[min(320px,92%)]">
            {milestones.map((m) => {
              const interactive = m.kind === "milestone";
              return (
                <MilestoneMarker
                  key={m.id}
                  milestone={m}
                  active={focusedMilestoneId === m.id}
                  interactive={interactive}
                  onSelect={() =>
                    onFocusMilestone(
                      focusedMilestoneId === m.id ? null : m.id,
                    )
                  }
                />
              );
            })}
          </div>
        )}

        {chapter.heroSrc ? (
          <div className="relative z-10 flex w-full max-w-[320px] items-end justify-center md:max-w-[360px]">
            <SceneImage
              src={chapter.heroSrc}
              alt={chapter.title}
              className="h-auto w-auto max-w-full origin-bottom object-contain object-bottom opacity-95 [backface-visibility:hidden]"
              style={{ maxHeight: "var(--landmark-max-h)" }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
