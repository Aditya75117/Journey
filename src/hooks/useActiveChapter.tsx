"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { chapters } from "@/data/timeline";

type JourneyContextValue = {
  activeChapterIndex: number;
  activeChapterId: string;
  setActiveChapterIndex: (index: number) => void;
  isWalking: boolean;
  setIsWalking: (walking: boolean) => void;
  focusedMilestoneId: string | null;
  setFocusedMilestoneId: (id: string | null) => void;
  scrollProgress: number;
  setScrollProgress: (p: number) => void;
};

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [focusedMilestoneId, setFocusedMilestoneId] = useState<string | null>(
    null,
  );
  const [scrollProgress, setScrollProgress] = useState(0);

  const setIndex = useCallback((index: number) => {
    setActiveChapterIndex((prev) => {
      const next = Math.max(0, Math.min(chapters.length - 1, index));
      return next === prev ? prev : next;
    });
  }, []);

  const setWalkingStable = useCallback((walking: boolean) => {
    setIsWalking((prev) => (prev === walking ? prev : walking));
  }, []);

  const setProgressStable = useCallback((p: number) => {
    // Throttle React updates — scroll motion is driven by GSAP, not this state
    setScrollProgress((prev) =>
      Math.abs(prev - p) < 0.002 ? prev : p,
    );
  }, []);

  const value = useMemo(
    () => ({
      activeChapterIndex,
      activeChapterId: chapters[activeChapterIndex]?.id ?? "prologue",
      setActiveChapterIndex: setIndex,
      isWalking,
      setIsWalking: setWalkingStable,
      focusedMilestoneId,
      setFocusedMilestoneId,
      scrollProgress,
      setScrollProgress: setProgressStable,
    }),
    [
      activeChapterIndex,
      setIndex,
      isWalking,
      setWalkingStable,
      focusedMilestoneId,
      scrollProgress,
      setProgressStable,
    ],
  );

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  );
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) {
    throw new Error("useJourney must be used within JourneyProvider");
  }
  return ctx;
}

export function useActiveYear(): string {
  const { activeChapterIndex } = useJourney();
  const chapter = chapters[activeChapterIndex];
  if (!chapter) return "";
  if (chapter.id === "prologue") return "AD.";
  if (chapter.id === "horizon") return "Now";
  if (chapter.endYear === "present") return `${chapter.startYear}–`;
  if (chapter.startYear === chapter.endYear) return String(chapter.startYear);
  return `${chapter.startYear}`;
}
