"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import type { Milestone } from "@/types/timeline";
import {
  cardBadge,
  cardColor,
  cardMark,
  titleFontClass,
  titleFontVariant,
  type CardMark,
} from "./cardTheme";

type MarkerProps = {
  milestone: Milestone;
  active: boolean;
  onSelect: () => void;
  /** Scan-only captions omit the detail panel when false. */
  interactive?: boolean;
};

/** Prefer org; append location only when it adds signal not already in the org name. */
export function placeName(milestone: Milestone): string | null {
  const org = milestone.organization?.trim();
  const loc = milestone.location?.trim();
  if (org && loc && !org.toLowerCase().includes(loc.toLowerCase())) {
    return `${org} · ${loc}`;
  }
  if (org) return org;
  if (loc) return loc;
  return null;
}

function MarkIcon({ mark }: { mark: CardMark }) {
  if (mark === "asterisk") {
    return (
      <span className="text-[16px] font-bold leading-none text-black" aria-hidden>
        ✦
      </span>
    );
  }
  if (mark === "dots") {
    return (
      <span className="flex items-center gap-1" aria-hidden>
        <span className="size-2.5 rounded-full bg-black" />
        <span className="size-2.5 rounded-full border border-black bg-transparent" />
      </span>
    );
  }
  return (
    <span
      className="font-[family-name:var(--font-accent)] text-[14px] font-extrabold leading-none text-black"
      aria-hidden
    >
      #
    </span>
  );
}

function BrutalCardShell({
  milestone,
  active,
  children,
  className = "",
}: {
  milestone: Milestone;
  active?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const bg = cardColor(milestone.id);
  return (
    <div
      className={`relative overflow-hidden rounded-[1.25rem] border-[1.5px] border-black text-black md:rounded-[1.5rem] ${className}`}
      style={{
        backgroundColor: bg,
        boxShadow: active ? "3px 3px 0 0 #000" : "2px 2px 0 0 #000",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Rooftop neo-brutalist label — compact, not the tall reference proportions.
 * Layout: mark + badge → title → place → rule → date + plus.
 */
export function MilestoneMarker({
  milestone,
  active,
  onSelect,
  interactive = true,
}: MarkerProps) {
  const place = placeName(milestone);
  const badge = cardBadge(milestone);
  const mark = cardMark(milestone.id);
  const fontClass = titleFontClass(titleFontVariant(milestone.id));

  const plaque = (
    <BrutalCardShell milestone={milestone} active={active} className="px-3 py-2.5 md:px-3.5 md:py-3">
      <span className="mb-2 flex items-start justify-between gap-2">
        <MarkIcon mark={mark} />
        <span className="shrink-0 rounded-full border border-black bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-black md:text-[11px]">
          {badge}
        </span>
      </span>

      <span className={`block text-[16px] leading-[1.15] text-black md:text-[18px] ${fontClass}`}>
        {milestone.title}
      </span>

      {place && (
        <span className="mt-0.5 block line-clamp-2 text-[12px] font-medium leading-snug text-black/70 md:text-[13px]">
          {place}
        </span>
      )}

      <span className="mt-2 block h-px w-full bg-black" aria-hidden />

      <span className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-black md:text-[11px]">
          {milestone.dateLabel}
        </span>
        {interactive && (
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-full border border-black bg-white text-[14px] leading-none text-black transition group-hover:bg-black group-hover:text-white md:size-7"
            aria-hidden
          >
            +
          </span>
        )}
      </span>
    </BrutalCardShell>
  );

  if (!interactive) {
    return <div className="w-full text-left">{plaque}</div>;
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className="pointer-events-auto group w-full cursor-pointer text-left transition duration-200 hover:-translate-y-0.5"
      aria-expanded={active}
      aria-controls={`milestone-card-${milestone.id}`}
    >
      {plaque}
    </button>
  );
}

type CardProps = {
  milestone: Milestone | null;
  onClose: () => void;
  isMobile?: boolean;
};

export function MilestoneCard({
  milestone,
  onClose,
  isMobile,
}: CardProps) {
  const place = milestone ? placeName(milestone) : null;
  const badge = milestone ? cardBadge(milestone) : "";
  const mark = milestone ? cardMark(milestone.id) : "asterisk";
  const fontClass = milestone
    ? titleFontClass(titleFontVariant(milestone.id))
    : "";

  return (
    <AnimatePresence>
      {milestone && (
        <>
          <motion.button
            type="button"
            aria-label="Dismiss milestone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto fixed inset-0 z-40 cursor-default border-0 bg-[#0B0D10]/55"
            onClick={onClose}
          />

          <motion.aside
            id={`milestone-card-${milestone.id}`}
            role="dialog"
            aria-modal="true"
            aria-label={milestone.title}
            initial={
              isMobile ? { y: "100%", opacity: 0 } : { x: 28, opacity: 0 }
            }
            animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
            exit={
              isMobile
                ? { y: "100%", opacity: 0 }
                : { x: 16, opacity: 0 }
            }
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={
              isMobile
                ? "pointer-events-auto fixed inset-x-3 bottom-3 z-50 max-h-[72vh] overflow-auto"
                : "pointer-events-auto absolute bottom-[28%] right-[5%] z-50 w-[min(320px,32vw)]"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <BrutalCardShell
              milestone={milestone}
              active
              className={isMobile ? "px-5 pb-6 pt-4" : "px-5 py-5"}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <MarkIcon mark={mark} />
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-black bg-white px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em]">
                    {badge}
                  </span>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex size-7 shrink-0 items-center justify-center rounded-full border border-black bg-white text-black transition hover:bg-black hover:text-white"
                    aria-label="Close milestone"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M4 4l10 10M14 4L4 14"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <h2
                className={`text-[1.62rem] leading-[1.15] text-black md:text-[1.8rem] ${fontClass}`}
              >
                {milestone.title}
              </h2>
              {place && (
                <p className="mt-1 text-[16px] font-medium leading-snug text-black/70">
                  {place}
                </p>
              )}

              <div className="mt-4 h-px w-full bg-black" aria-hidden />

              <p className="mt-4 text-[17px] leading-relaxed text-black/85 md:text-[18px]">
                {milestone.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black">
                  {milestone.dateLabel}
                </span>
                {milestone.kind === "cta" ? (
                  <a
                    href="mailto:hello@adityadutta.dev"
                    className="rounded-full border border-black bg-white px-3 py-1 text-[13px] font-semibold uppercase tracking-[0.06em] text-black transition hover:bg-black hover:text-white"
                  >
                    Let’s talk →
                  </a>
                ) : (
                  <span
                    className="flex size-8 items-center justify-center rounded-full border border-black bg-white text-base text-black"
                    aria-hidden
                  >
                    +
                  </span>
                )}
              </div>
            </BrutalCardShell>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
