"use client";

type Props = {
  accent?: string;
  /** Extra starfield wash for the horizon bookend */
  showStars?: boolean;
};

/** Soft sky backdrop for the journey stage (clouds live in CloudLayer). */
export function SkySystem({ accent = "#E8A87C", showStars = false }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse 70% 45% at 75% 8%, ${accent}18, transparent 50%), linear-gradient(180deg, #4A90C8 0%, #6BA8D9 28%, #1A2838 62%, #0B0D10 100%)`,
        }}
      />
      {showStars && (
        <div
          className="absolute inset-x-0 top-0 h-[45%] opacity-70 transition-opacity duration-700"
          style={{
            backgroundImage:
              "radial-gradient(1.5px 1.5px at 12% 22%, #F5E6C8aa 50%, transparent 51%), radial-gradient(1px 1px at 28% 14%, #F5E6C888 50%, transparent 51%), radial-gradient(1.5px 1.5px at 46% 30%, #F5E6C8bb 50%, transparent 51%), radial-gradient(1px 1px at 62% 18%, #F5E6C877 50%, transparent 51%), radial-gradient(1.5px 1.5px at 78% 26%, #F5E6C8aa 50%, transparent 51%), radial-gradient(1px 1px at 88% 12%, #F5E6C866 50%, transparent 51%)",
          }}
        />
      )}
    </div>
  );
}
