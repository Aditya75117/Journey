"use client";

import { useActiveYear, useJourney } from "@/hooks/useActiveChapter";
import { chapters } from "@/data/timeline";

export function YearHUD() {
  const year = useActiveYear();
  const { activeChapterIndex } = useJourney();
  const chapter = chapters[activeChapterIndex];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-5 py-5 md:px-8 md:py-6">
      <div className="pointer-events-auto">
        <p className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[#F2F0EB] md:text-2xl">
          AD.
        </p>
        <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-[#9AA3B2]">
          Aditya Dutta
        </p>
      </div>
      <div className="text-right">
        <p className="font-[family-name:var(--font-display)] text-2xl text-[#F2F0EB] md:text-3xl">
          {year}
        </p>
        <p className="text-xs text-[#9AA3B2]">{chapter?.title}</p>
      </div>
    </header>
  );
}
