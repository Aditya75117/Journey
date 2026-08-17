"use client";

const LANDSCAPE_SRC = "/illustrations/environment/mountain-repeat.jpg";

type Props = {
  width: number;
};

/**
 * Horizontal mountain backdrop — tiles along the journey with repeat-x.
 * Driven as a slow parallax layer (behind cityscape).
 */
export function MountainBackdrop({ width }: Props) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-1"
      style={{
        width,
        bottom: "var(--road-top)",
        backgroundImage: `url(${LANDSCAPE_SRC})`,
        backgroundRepeat: "repeat-x",
        backgroundPosition: "left bottom",
        backgroundSize: "auto 100%",
      }}
      aria-hidden
    />
  );
}
