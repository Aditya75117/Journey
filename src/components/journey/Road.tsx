"use client";

type Props = {
  width: number;
};

export function Road({ width }: Props) {
  return (
    <div
      className="pointer-events-none absolute left-0 z-[25]"
      style={{
        width,
        bottom: "var(--road-gutter)",
        height: "var(--road-h)",
      }}
      aria-hidden
    >
      <div className="relative h-full w-full overflow-hidden rounded-sm bg-[#2A303A] shadow-[0_-12px_40px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 gap-10 px-6">
          {Array.from({ length: Math.ceil(width / 90) }).map((_, i) => (
            <span
              key={i}
              className="h-1 w-12 shrink-0 rounded-full bg-[#E8B86D]/70"
            />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-black/40" />
      </div>
    </div>
  );
}
