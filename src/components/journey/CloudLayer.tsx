"use client";

const CLOUD_SRCS = [
  "/illustrations/props/cloud-1.svg",
  "/illustrations/props/cloud-2.svg",
  "/illustrations/props/cloud-3.svg",
  "/illustrations/props/cloud-4.svg",
  "/illustrations/props/cloud-5.svg",
] as const;

type CloudSpec = {
  src: string;
  left: number;
  top: string;
  width: number;
  opacity: number;
  flip: boolean;
};

type Props = {
  width: number;
};

const LANES = [
  { top: "3%", width: 300, opacity: 0.72, offset: 30 },
  { top: "9%", width: 200, opacity: 0.55, offset: 110 },
  { top: "14%", width: 240, opacity: 0.64, offset: -20 },
  { top: "7%", width: 160, opacity: 0.48, offset: 70 },
] as const;

/** Scatter white SVG clouds along the journey; driven by its own parallax speed. */
function buildClouds(width: number): CloudSpec[] {
  const spacing = 380;
  const count = Math.max(8, Math.ceil(width / spacing) + 2);
  const clouds: CloudSpec[] = [];

  for (let i = 0; i < count; i++) {
    const lane = LANES[i % LANES.length];
    clouds.push({
      src: CLOUD_SRCS[i % CLOUD_SRCS.length],
      left: i * spacing + lane.offset,
      top: lane.top,
      width: lane.width + ((i * 37) % 60),
      opacity: lane.opacity,
      flip: i % 3 === 0,
    });
  }

  return clouds;
}

export function CloudLayer({ width }: Props) {
  const clouds = buildClouds(width);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-1 h-[42%] md:h-[38%]"
      style={{ width }}
      aria-hidden
    >
      {clouds.map((cloud, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={cloud.src}
          alt=""
          className="absolute backface-hidden"
          style={{
            left: cloud.left,
            top: cloud.top,
            width: cloud.width,
            opacity: cloud.opacity,
            transform: cloud.flip ? "scaleX(-1)" : undefined,
          }}
          draggable={false}
        />
      ))}
    </div>
  );
}
