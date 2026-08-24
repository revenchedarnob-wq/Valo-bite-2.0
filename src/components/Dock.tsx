"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  isHapticsEnabled,
  playHapticClick,
  playHapticFlick,
  playHapticThud,
  playHoverBlip,
  setHapticsEnabled,
  subscribeHaptics,
} from "@/lib/sound";
import { scrollTopSmooth } from "@/lib/scroll";
import { openCommissionDrawer } from "./CommissionDrawer";
import { Magnetic } from "./Magnetic";
import { Bloom } from "./Bloom";

const DOCK_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 26,
} as const;

function EqualizerBars({ on }: { on: boolean }) {
  return (
    <span className="flex h-3.5 w-4 items-end justify-center gap-[2px]" aria-hidden>
      {[0.45, 1, 0.7].map((peak, i) => (
        <motion.span
          key={i}
          className={`w-[2.5px] rounded-full ${on ? "bg-clay" : "bg-stone-mute"}`}
          animate={
            on
              ? { height: [`${peak * 30}%`, `${peak * 100}%`, `${peak * 45}%`] }
              : { height: "28%" }
          }
          transition={
            on
              ? { duration: 0.9 + i * 0.22, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 }
          }
        />
      ))}
    </span>
  );
}

/**
 * Floating Action Dock — global sound switcher, commission shortcut,
 * and a spring-physics back-to-top control.
 */
export function Dock() {
  const [soundOn, setSoundOn] = useState(isHapticsEnabled());

  useEffect(
    () => subscribeHaptics((on) => setSoundOn(on)),
    [],
  );

  const toggleSound = () => {
    const next = !isHapticsEnabled();
    setHapticsEnabled(next);
    if (next) playHapticClick(); // confirm un-muting audibly
  };

  const backToTop = () => {
    playHapticFlick();
    scrollTopSmooth();
    // A soft landing thud once the glide reaches the top.
    window.setTimeout(() => playHapticThud(), 1450);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex justify-center">
      <motion.nav
        aria-label="Site dock"
        initial={{ y: 90, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ ...DOCK_SPRING, delay: 0.5 }}
        className="frost-pill pointer-events-auto flex items-center gap-1 rounded-full bg-white/70 p-1.5 shadow-[0_24px_60px_-20px_rgba(33,30,25,0.35)]"
      >
        {/* Commission shortcut */}
        <Magnetic strength={0.4}>
          <motion.button
            onClick={openCommissionDrawer}
            onMouseEnter={() => playHoverBlip()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            transition={DOCK_SPRING}
            className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-[11px] font-semibold tracking-[0.16em] text-ink uppercase hover:bg-white/70"
          >
            <Bloom size={15} />
            Inquire
          </motion.button>
        </Magnetic>

        <span className="h-6 w-px bg-ink/10" aria-hidden />

        {/* Haptics sound switcher */}
        <Magnetic strength={0.4}>
          <motion.button
            onClick={toggleSound}
            onMouseEnter={() => playHoverBlip()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            transition={DOCK_SPRING}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Mute interface sounds" : "Unmute interface sounds"}
            title={soundOn ? "Sound on" : "Sound off"}
            className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-[11px] font-semibold tracking-[0.16em] text-ink uppercase hover:bg-white/70"
          >
            <EqualizerBars on={soundOn} />
            {soundOn ? "Sound" : "Muted"}
          </motion.button>
        </Magnetic>

        <span className="h-6 w-px bg-ink/10" aria-hidden />

        {/* Back to top */}
        <Magnetic strength={0.45}>
          <motion.button
            onClick={backToTop}
            onMouseEnter={() => playHoverBlip()}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.9, y: 1 }}
            transition={DOCK_SPRING}
            aria-label="Back to top"
            title="Back to top"
            className="btn-shine flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-ink text-alabaster shadow-[0_12px_28px_-10px_rgba(33,30,25,0.55)]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M7 12V2M7 2L2.5 6.5M7 2l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </Magnetic>
      </motion.nav>
    </div>
  );
}
