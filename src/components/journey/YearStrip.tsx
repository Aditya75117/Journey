"use client";

import { chapters } from "@/data/timeline";

type Props = {
  chapterWidth: number;
  activeIndex: number;
};

export function YearStrip({ chapterWidth, activeIndex }: Props) {
  return (
    <div
      className="pointer-events-none absolute left-0 z-30 flex"
      style={{
        width: chapterWidth * chapters.length,
        bottom: "var(--year-strip-bottom)",
      }}
      aria-hidden
    >
      {chapters.map((chapter, index) => {
        const active = index === activeIndex;
        return (
          <div
            key={chapter.id}
            className="flex items-end justify-center"
            style={{ width: chapterWidth }}
          >
            <span
              className={`select-none font-[family-name:var(--font-display)] tracking-tight transition-all duration-500 ${
                active
                  ? "translate-y-0 text-5xl text-[#F2F0EB] opacity-100 md:text-7xl"
                  : "translate-y-1 text-3xl text-[#9AA3B2] opacity-35 md:text-5xl"
              }`}
            >
              {chapter.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
