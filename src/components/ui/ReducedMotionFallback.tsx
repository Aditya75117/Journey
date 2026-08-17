"use client";

import { chapters, getMilestoneById } from "@/data/timeline";

export function ReducedMotionFallback() {
  return (
    <main className="min-h-screen bg-[#0B0D10] px-5 py-16 text-[#F2F0EB] md:px-10">
      <header className="mx-auto max-w-2xl">
        <p className="font-[family-name:var(--font-display)] text-4xl">AD.</p>
        <h1 className="mt-2 text-2xl text-[#C5CED9]">Aditya Dutta</h1>
        <p className="mt-4 text-[#9AA3B2]">
          A quieter version of the journey — reduced motion is on. Scroll the
          timeline below.
        </p>
      </header>

      <ol className="mx-auto mt-12 max-w-2xl space-y-10">
        {chapters.map((chapter) => {
          const milestone = chapter.milestones
            .map((id) => getMilestoneById(id))
            .find(Boolean);
          return (
            <li
              key={chapter.id}
              className="border-t border-white/10 pt-8"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#9AA3B2]">
                {chapter.label}
                {typeof chapter.endYear === "number" &&
                chapter.endYear !== chapter.startYear
                  ? ` – ${chapter.endYear}`
                  : chapter.endYear === "present"
                    ? " – Present"
                    : ""}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl">
                {milestone?.title ?? chapter.title}
              </h2>
              {milestone && (
                <>
                  <p className="mt-3 leading-relaxed text-[#C5CED9]">
                    {milestone.description}
                  </p>
                  <p className="mt-2 text-sm text-[#9AA3B2]">
                    {[milestone.organization, milestone.location]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </>
              )}
            </li>
          );
        })}
      </ol>

      <footer className="mx-auto mt-16 max-w-2xl border-t border-white/10 pt-8">
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:hello@adityadutta.dev"
            className="text-[#E8A87C] underline-offset-4 hover:underline"
          >
            Email
          </a>
          <a
            href="/cv.pdf"
            className="text-[#C5CED9] underline-offset-4 hover:underline"
          >
            CV
          </a>
        </div>
      </footer>
    </main>
  );
}
