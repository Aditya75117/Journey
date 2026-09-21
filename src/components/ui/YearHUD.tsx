"use client";

import { LANDING_URL } from "@/constants/links";
import { useActiveYear, useJourney } from "@/hooks/useActiveChapter";
import { chapters } from "@/data/timeline";

export function YearHUD() {
  const year = useActiveYear();
  const { activeChapterIndex } = useJourney();
  const chapter = chapters[activeChapterIndex];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-5 py-5 md:px-8 md:py-6">
      <a
        href={LANDING_URL}
        className="pointer-events-auto inline-block"
        aria-label="Aditya Dutta — portfolio home"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/ad-mark.png"
          alt=""
          width={500}
          height={330}
          className="h-8 w-auto md:h-10"
          draggable={false}
        />
      </a>
      <div className="text-right">
        <p className="font-[family-name:var(--font-display)] text-2xl text-[#F2F0EB] md:text-3xl">
          {year}
        </p>
        <p className="text-xs text-[#9AA3B2]">{chapter?.title}</p>
      </div>
    </header>
  );
}
