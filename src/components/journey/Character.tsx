"use client";

import { useEffect, useRef } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import walkOriginal from "../../../public/illustrations/character/walk.json";
import walkHuman from "../../../public/illustrations/character/walk-human.json";
import walkDelivery from "../../../public/illustrations/character/walk-delivery.json";

/** Flip to `"original"` or `"human"` to compare other walks. */
const WALK_VARIANT = "delivery" as const;

const WALKS = {
  original: {
    data: walkOriginal,
    speed: 1.35,
    wrapClassName:
      "pointer-events-none absolute left-[12%] z-40 w-[70px] md:left-[18%]",
    lottieClassName:
      "h-auto w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]",
  },
  human: {
    data: walkHuman,
    speed: 1,
    wrapClassName:
      "pointer-events-none absolute left-[8%] z-40 w-[200px] md:left-[12%]",
    lottieClassName:
      "h-auto w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]",
  },
  delivery: {
    data: walkDelivery,
    speed: 1,
    wrapClassName:
      "pointer-events-none absolute left-[8%] z-40 w-[160px] md:left-[14%]",
    lottieClassName:
      "h-auto w-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]",
  },
} as const;

type Props = {
  isWalking: boolean;
  reducedMotion?: boolean;
};

export function Character({ isWalking, reducedMotion = false }: Props) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const walk = WALKS[WALK_VARIANT];

  useEffect(() => {
    const anim = lottieRef.current;
    if (!anim) return;
    anim.setSpeed(walk.speed);
    if (reducedMotion) {
      anim.goToAndStop(0, true);
      return;
    }
    if (isWalking) {
      anim.play();
    } else {
      anim.pause();
    }
  }, [isWalking, reducedMotion, walk.speed]);

  return (
    <div
      className={walk.wrapClassName}
      style={{ bottom: "var(--character-bottom)" }}
      aria-hidden
    >
      <Lottie
        key={WALK_VARIANT}
        lottieRef={lottieRef}
        animationData={walk.data}
        loop
        autoplay={false}
        className={walk.lottieClassName}
      />
    </div>
  );
}
