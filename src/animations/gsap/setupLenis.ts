"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { PARALLAX_SPEEDS } from "@/constants/parallaxSpeeds";

export type JourneyLayers = {
  world: HTMLElement;
  clouds?: HTMLElement | null;
  birds?: HTMLElement | null;
  mountain?: HTMLElement | null;
  cityscape?: HTMLElement | null;
  fg?: HTMLElement | null;
};

type SetupArgs = {
  layers: JourneyLayers;
  spacer: HTMLElement;
  totalWidth: number;
  reducedMotion: boolean;
  onProgress: (progress: number) => void;
  onVelocity: (velocity: number) => void;
  onChapterProgress: (chapterIndex: number, localProgress: number) => void;
  chapterCount: number;
};

/** Horizontal speed multipliers vs scroll progress (1 = full travel) */
const SPEEDS = {
  clouds: PARALLAX_SPEEDS.clouds,
  birds: PARALLAX_SPEEDS.birds,
  mountain: PARALLAX_SPEEDS.mountain,
  cityscape: PARALLAX_SPEEDS.cityscape,
  world: PARALLAX_SPEEDS.road,
  fg: 1.25,
} as const;

/**
 * Vertical wheel/touch → Lenis scroll on an invisible spacer.
 * Progress drives every layer horizontally. Character stays fixed outside.
 */
export function setupLenisScrollTrigger({
  layers,
  spacer,
  totalWidth,
  reducedMotion,
  onProgress,
  onVelocity,
  onChapterProgress,
  chapterCount,
}: SetupArgs): () => void {
  if (reducedMotion) {
    return () => undefined;
  }

  const getTravel = () => Math.max(totalWidth - window.innerWidth, 0);

  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: true,
    touchMultiplier: 1.2,
    wheelMultiplier: 1,
  });

  let lastChapter = -1;

  const applyScroll = (scroll: number) => {
    const maxScroll = Math.max(spacer.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(1, Math.max(0, scroll / maxScroll));
    const travel = getTravel();

    gsap.set(layers.world, {
      x: -travel * progress * SPEEDS.world,
      force3D: true,
    });

    if (layers.clouds) {
      gsap.set(layers.clouds, {
        x: -travel * progress * SPEEDS.clouds,
        force3D: true,
      });
    }

    if (layers.birds) {
      gsap.set(layers.birds, {
        x: -travel * progress * SPEEDS.birds,
        force3D: true,
      });
    }

    if (layers.mountain) {
      gsap.set(layers.mountain, {
        x: -travel * progress * SPEEDS.mountain,
        force3D: true,
      });
    }

    if (layers.cityscape) {
      gsap.set(layers.cityscape, {
        x: -travel * progress * SPEEDS.cityscape,
        force3D: true,
      });
    }

    if (layers.fg) {
      gsap.set(layers.fg, {
        x: -travel * progress * SPEEDS.fg,
        force3D: true,
      });
    }

    onProgress(progress);

    const idx = Math.min(
      chapterCount - 1,
      Math.floor(progress * chapterCount),
    );
    if (idx !== lastChapter) {
      lastChapter = idx;
      onChapterProgress(idx, progress * chapterCount - idx);
    }
  };

  let idleTimer: ReturnType<typeof setTimeout> | null = null;

  lenis.on("scroll", (e) => {
    applyScroll(e.scroll);
    onVelocity(Math.abs(e.velocity));
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => onVelocity(0), 140);
  });

  const tickerCb = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerCb);
  gsap.ticker.lagSmoothing(0);

  const onResize = () => {
    lenis.resize();
    applyScroll(lenis.scroll);
  };
  window.addEventListener("resize", onResize);

  applyScroll(0);
  requestAnimationFrame(() => {
    lenis.resize();
    applyScroll(lenis.scroll);
  });

  return () => {
    if (idleTimer) clearTimeout(idleTimer);
    window.removeEventListener("resize", onResize);
    gsap.ticker.remove(tickerCb);
    lenis.destroy();
    const nodes = [
      layers.world,
      layers.clouds,
      layers.birds,
      layers.mountain,
      layers.cityscape,
      layers.fg,
    ].filter(Boolean) as HTMLElement[];
    gsap.set(nodes, { clearProps: "transform" });
  };
}
