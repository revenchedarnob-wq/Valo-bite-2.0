/**
 * lib/scroll — Lenis-powered inertial smooth scrolling.
 * A single instance drives the whole site; helpers let any
 * component scroll smoothly or reset instantly on route change.
 */

import Lenis from "lenis";

let lenis: Lenis | null = null;
let rafId = 0;

export function initSmoothScroll(): () => void {
  if (lenis) return () => undefined;

  // Users who prefer reduced motion get native, instant scrolling.
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return () => undefined;
  }

  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  });

  const raf = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(rafId);
    lenis?.destroy();
    lenis = null;
  };
}

/** Instant jump — used on route change so pages open at the top. */
export function scrollTopImmediate(): void {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

/** Buttery animated scroll to the very top — used by the dock.
 *  Falls back to an instant jump when reduced motion is preferred. */
export function scrollTopSmooth(): void {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    scrollTopImmediate();
    return;
  }
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.4 });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/** Smoothly scroll to any selector with breathing room under the nav. */
export function scrollToSelector(selector: string): void {
  const el = document.querySelector(selector);
  if (!el) return;
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    (el as HTMLElement).scrollIntoView();
    return;
  }
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -96, duration: 1.3 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
