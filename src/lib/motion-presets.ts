/** Shared motion presets — the "$100k feel". */

export const EASE_LUXE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_CINEMATIC: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const SPRING_SETTLE = { type: "spring", stiffness: 350, damping: 26, mass: 0.6 } as const;
export const SPRING_MICRO = { type: "spring", stiffness: 450, damping: 18 } as const;
export const SPRING_HEAVY = { type: "spring", stiffness: 120, damping: 24, mass: 1.2 } as const;

/* ——— Editorial motion system (master spec tokens) ——— */
export const EASE_EDITORIAL: [number, number, number, number] = [0.19, 1, 0.22, 1];
export const EASE_SLOW: [number, number, number, number] = [0.25, 1, 0.5, 1];

export const SPRING_TACTILE = { type: "spring", stiffness: 350, damping: 28 } as const;
export const SPRING_BOUNCE = { type: "spring", stiffness: 420, damping: 18 } as const;
export const SPRING_MODAL = { type: "spring", damping: 30, stiffness: 300 } as const;

export const FADE_UP_BLUR = {
  initial: { opacity: 0, y: 32, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.9, ease: EASE_EDITORIAL },
} as const;
