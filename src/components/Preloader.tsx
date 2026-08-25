"use client";

import { motion } from "motion/react";
import { useEffect } from "react";
import { EASE_EDITORIAL, SPRING_TACTILE } from "@/lib/motion-presets";

const LUXE = { type: "spring", stiffness: 350, damping: 26, mass: 0.6 } as const;

const PETALS = [0, 90, 180, 270];

/**
 * Preloader — the 4-petal geometric cross blooms from a blurred seed
 * (scale 0.2 / blur 14px), overshoots to 1.12, settles at 1.0 while the
 * wordmark's tracking expands beneath it. It then cross-fades away,
 * scaling past the viewer with a soft blur wipe.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const done = setTimeout(onDone, 2500);
    return () => clearTimeout(done);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-alabaster"
      exit={{ opacity: 0, scale: 1.25, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
    >
      {/* bottom tracking wordmark */}
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.2em", y: 14 }}
        animate={{
          opacity: [0, 1, 1, 0],
          letterSpacing: "0.4em",
          y: [14, 0, 0, -10],
        }}
        transition={{
          opacity: { duration: 2.3, times: [0, 0.3, 0.72, 1], ease: "easeOut" },
          y: { duration: 2.3, times: [0, 0.3, 0.72, 1], ease: "easeOut" },
          letterSpacing: { duration: 1.6, delay: 0.25, ease: EASE_EDITORIAL },
        }}
        className="absolute bottom-16 text-[11px] uppercase text-stone-mute"
      >
        Valobite
      </motion.p>

      {/* the bloom — blurred seed → overshoot → settle */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0, filter: "blur(14px)" }}
        animate={{ scale: [0.2, 1.12, 1], opacity: 1, filter: "blur(0px)" }}
        transition={SPRING_TACTILE}
      >
        <svg width={170} height={170} viewBox="0 0 120 120" aria-hidden>
          {PETALS.map((deg, i) => (
            <motion.path
              key={deg}
              d="M 60 60 C 60 36, 74 20, 60 6 C 46 20, 60 36, 60 60 Z"
              fill="#b3a184"
              opacity={0.85}
              initial={{ scale: 0, rotate: deg - 45, opacity: 0 }}
              animate={{ scale: 1, rotate: deg, opacity: 0.85 }}
              transition={{ ...LUXE, delay: 0.15 + i * 0.13 }}
              style={{
                transformOrigin: "50% 50%",
                transformBox: "view-box",
              }}
            />
          ))}
          {/* quiet heart once assembled */}
          <motion.circle
            cx="60"
            cy="60"
            r="4"
            fill="#f4f3ef"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...LUXE, delay: 0.85 }}
            style={{ transformOrigin: "50% 50%", transformBox: "view-box" }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
