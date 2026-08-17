"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chapters, getMilestoneById, isWorldSyncedRoadProp } from "@/data/timeline";
import {
  CHAPTER_WIDTH_DESKTOP,
  CHAPTER_WIDTH_MOBILE,
  SCROLL_DENSITY,
  WALK_VELOCITY_THRESHOLD,
} from "@/constants/parallaxSpeeds";
import { PALETTE_BY_KEY } from "@/constants/colors";
import { setupLenisScrollTrigger } from "@/animations/gsap/setupLenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { JourneyProvider, useJourney } from "@/hooks/useActiveChapter";
import { SkySystem } from "@/components/journey/SkySystem";
import { CloudLayer } from "@/components/journey/CloudLayer";
import { BirdLayer } from "@/components/journey/BirdLayer";
import { MountainBackdrop } from "@/components/journey/MountainBackdrop";
import { CityscapeBackdrop } from "@/components/journey/CityscapeBackdrop";
import { Road } from "@/components/journey/Road";
import { YearStrip } from "@/components/journey/YearStrip";
import { Character } from "@/components/journey/Character";
import { SceneChapter } from "@/timeline/SceneChapter";
import { MilestoneCard } from "@/components/milestones/MilestoneCard";
import { YearHUD } from "@/components/ui/YearHUD";
import { ReducedMotionFallback } from "@/components/ui/ReducedMotionFallback";

function JourneyExperience() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const {
    activeChapterIndex,
    setActiveChapterIndex,
    isWalking,
    setIsWalking,
    focusedMilestoneId,
    setFocusedMilestoneId,
  } = useJourney();

  const worldRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const birdsRef = useRef<HTMLDivElement>(null);
  const mountainRef = useRef<HTMLDivElement>(null);
  const cityscapeRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  const chapterWidth = isMobile ? CHAPTER_WIDTH_MOBILE : CHAPTER_WIDTH_DESKTOP;
  const totalWidth = chapterWidth * chapters.length;
  const [viewport, setViewport] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    const update = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalTravel = Math.max(totalWidth - viewport.w, 0);
  const scrollHeight = Math.round(totalTravel * SCROLL_DENSITY) + viewport.h;

  const activeChapter = chapters[activeChapterIndex];
  const palette =
    PALETTE_BY_KEY[activeChapter?.palette ?? "prologue"] ??
    PALETTE_BY_KEY.prologue;

  const focusedMilestone = useMemo(() => {
    if (!focusedMilestoneId) return null;
    return getMilestoneById(focusedMilestoneId) ?? null;
  }, [focusedMilestoneId]);

  const cardMilestone =
    focusedMilestone?.kind === "milestone" ? focusedMilestone : null;

  const onChapterProgress = useCallback(
    (index: number) => {
      setActiveChapterIndex(index);
    },
    [setActiveChapterIndex],
  );

  useEffect(() => {
    if (reducedMotion) return;
    const world = worldRef.current;
    const spacer = spacerRef.current;
    if (!world || !spacer) return;

    document.documentElement.classList.add("journey-lock");
    document.body.classList.add("journey-lock");

    const cleanup = setupLenisScrollTrigger({
      layers: {
        world,
        clouds: cloudsRef.current,
        birds: birdsRef.current,
        mountain: mountainRef.current,
        cityscape: cityscapeRef.current,
        fg: fgRef.current,
      },
      spacer,
      totalWidth: chapterWidth * chapters.length,
      reducedMotion: false,
      chapterCount: chapters.length,
      // Scroll X is GSAP-driven — avoid React state every frame (causes image flicker)
      onProgress: () => undefined,
      onVelocity: (v) => setIsWalking(v > WALK_VELOCITY_THRESHOLD),
      onChapterProgress: (index) => onChapterProgress(index),
    });

    return () => {
      cleanup();
      document.documentElement.classList.remove("journey-lock");
      document.body.classList.remove("journey-lock");
    };
  }, [
    reducedMotion,
    chapterWidth,
    totalWidth,
    scrollHeight,
    setIsWalking,
    onChapterProgress,
  ]);

  useEffect(() => {
    // Close any open card when the active chapter changes via scroll
    setFocusedMilestoneId(null);
  }, [activeChapterIndex, setFocusedMilestoneId]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocusedMilestoneId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setFocusedMilestoneId]);

  if (reducedMotion) {
    return <ReducedMotionFallback />;
  }

  return (
    <>
      <div
        ref={spacerRef}
        className="pointer-events-none w-full opacity-0"
        style={{ height: scrollHeight }}
        aria-hidden
      />

      <div className="journey-stage fixed inset-0 z-10 overflow-hidden bg-[#0B0D10]">
        <YearHUD />
        <SkySystem
          accent={palette.accent}
          showStars={activeChapter?.id === "horizon"}
        />

        {/* Distant mountains — slow parallax */}
        <div
          ref={mountainRef}
          className="absolute inset-y-0 left-0 z-[0] h-full will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]"
          style={{ width: totalWidth }}
        >
          <MountainBackdrop width={totalWidth} />
        </div>

        {/* Clouds — above mountains, slowest scroll drift */}
        <div
          ref={cloudsRef}
          className="absolute inset-y-0 left-0 z-[1] h-full will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]"
          style={{ width: totalWidth }}
        >
          <CloudLayer width={totalWidth} />
        </div>

        {/* Birds — flapping wings, mid-sky parallax */}
        <div
          ref={birdsRef}
          className="absolute inset-y-0 left-0 z-[1] h-full will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]"
          style={{ width: totalWidth }}
        >
          <BirdLayer width={totalWidth} />
        </div>

        {/* City skyline — faster than mountains, slower than road */}
        <div
          ref={cityscapeRef}
          className="absolute inset-y-0 left-0 z-[1] h-full will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]"
          style={{ width: totalWidth }}
        >
          <CityscapeBackdrop width={totalWidth} />
        </div>

        {/* Mid + chapters + road (main world) */}
        <div
          ref={worldRef}
          className="absolute inset-y-0 left-0 z-[2] h-full will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]"
          style={{ width: totalWidth }}
        >
          {/* Road props (trees, bushes, lanterns, signboards) — same scroll as buildings */}
          <div
            className="pointer-events-none absolute inset-0 z-[8] flex h-full"
            aria-hidden
          >
            {chapters.map((chapter) => (
              <div
                key={`road-props-${chapter.id}`}
                className="relative h-full shrink-0"
                style={{ width: chapterWidth }}
              >
                {chapter.props
                  .filter(
                    (p) => p.layer === "fg" && isWorldSyncedRoadProp(p.src),
                  )
                  .map((prop, i) => {
                    const sitsOnRoadTop =
                      prop.src.includes("/bush-") ||
                      prop.src.includes("/bench-");
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={`${prop.src}-${i}`}
                        src={prop.src}
                        alt=""
                        className={
                          prop.className ??
                          `absolute w-[26%] max-w-[180px] opacity-100 [backface-visibility:hidden] md:w-[20%] md:max-w-[220px] ${
                            i % 2 === 0 ? "left-0" : "right-0"
                          }`
                        }
                        style={{
                          bottom:
                            prop.src.includes("/bush-") ||
                            prop.src.includes("/bench-") ||
                            prop.src.includes("/bicycle-")
                              ? "var(--bushes-bottom)"
                              : "var(--trees-bottom)",
                        }}
                        draggable={false}
                      />
                    );
                  })}
              </div>
            ))}
          </div>

          <div className="absolute inset-0 z-[26] flex h-full">
            {chapters.map((chapter, index) => (
              <SceneChapter
                key={chapter.id}
                chapter={chapter}
                width={chapterWidth}
                index={index}
                active={index === activeChapterIndex}
                near={Math.abs(index - activeChapterIndex) <= 1}
                focusedMilestoneId={focusedMilestoneId}
                onFocusMilestone={setFocusedMilestoneId}
                totalTravel={totalTravel}
                simplifyParallax
                reducedMotion={reducedMotion}
              />
            ))}
          </div>

          {/* Road */}
          <Road width={totalWidth} />
          <YearStrip
            chapterWidth={chapterWidth}
            activeIndex={activeChapterIndex}
          />
        </div>

        {/* Foreground parallax strip (non-tree props only) */}
        <div
          ref={fgRef}
          className="pointer-events-none absolute inset-y-0 left-0 z-[3] flex h-full will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]"
          style={{ width: totalWidth }}
          aria-hidden
        >
          {chapters.map((chapter) => (
            <div
              key={`fg-${chapter.id}`}
              className="relative h-full shrink-0"
              style={{ width: chapterWidth }}
            >
              {chapter.props
                .filter(
                  (p) =>
                    p.layer === "fg" &&
                    !isWorldSyncedRoadProp(p.src),
                )
                .map((prop, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={prop.src}
                    alt=""
                    className={
                      prop.className ??
                      `absolute w-[16%] max-w-[110px] opacity-50 ${
                        i % 2 === 0 ? "left-[2%]" : "right-[8%]"
                      }`
                    }
                    style={{ bottom: "var(--landmark-bottom)" }}
                    draggable={false}
                  />
                ))}
            </div>
          ))}
        </div>

        {/* Character stays fixed — environment moves past */}
        <Character isWalking={isWalking} reducedMotion={reducedMotion} />

        <MilestoneCard
          milestone={cardMilestone}
          onClose={() => setFocusedMilestoneId(null)}
          isMobile={isMobile}
        />
      </div>
    </>
  );
}

export function JourneyShell() {
  return (
    <JourneyProvider>
      <JourneyExperience />
    </JourneyProvider>
  );
}
