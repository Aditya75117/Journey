"use client";

const CITYSCAPE_SRC = "/illustrations/environment/cityscape-repeat.png";

type Props = {
  width: number;
};

/**
 * Looping city skyline band (buildings only) — tiles with repeat-x.
 * Mid-depth parallax: faster than mountains, slower than the road / landmarks.
 */
export function CityscapeBackdrop({ width }: Props) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-[3] opacity-70"
      style={{
        width,
        bottom: "var(--road-top)",
        height: "var(--cityscape-h)",
        backgroundImage: `url(${CITYSCAPE_SRC})`,
        backgroundRepeat: "repeat-x",
        backgroundPosition: "left bottom",
        backgroundSize: "auto 100%",
      }}
      aria-hidden
    />
  );
}
