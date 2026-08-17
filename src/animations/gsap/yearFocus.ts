import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Optional per-chapter focus tweens (labels / glow) hooked to the master scrub */
export function createChapterFocusTriggers(
  scroller: HTMLElement,
  chapterEls: HTMLElement[],
  onEnter: (index: number) => void,
) {
  const triggers = chapterEls.map((el, index) =>
    ScrollTrigger.create({
      scroller,
      trigger: el,
      start: "left center",
      end: "right center",
      onEnter: () => onEnter(index),
      onEnterBack: () => onEnter(index),
    }),
  );

  return () => triggers.forEach((t) => t.kill());
}
