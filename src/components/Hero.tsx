"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { HapticButton } from "./HapticButton";
import { Bloom } from "./Bloom";
import { EASE_EDITORIAL, EASE_LUXE } from "@/lib/motion-presets";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.35 },
  },
};

const wordVariants = {
  hidden: { y: "110%", opacity: 0, filter: "blur(8px)" },
  visible: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE_LUXE },
  },
};

function MaskedWords({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span variants={wordVariants} className="inline-block">
            {word}
            {"\u00A0"}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bloomY = useTransform(smooth, [0, 1], [0, 180]);
  const bloomRotate = useTransform(smooth, [0, 1], [0, 90]);
  const copyOpacity = useTransform(smooth, [0, 0.6], [1, 0]);
  const copyY = useTransform(smooth, [0, 1], [0, -80]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20"
    >
      {/* ambient bloom — zooms down from 1.15 and settles into a watermark */}
      <motion.div
        style={{ y: bloomY, rotate: bloomRotate }}
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.07 }}
        transition={{ duration: 1.8, ease: EASE_EDITORIAL, delay: 0.15 }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Bloom size={Math.min(640, typeof window !== "undefined" ? window.innerWidth * 0.7 : 480)} color="#b3a184" />
      </motion.div>

      <motion.div
        style={{ opacity: copyOpacity, y: copyY }}
        className="relative z-10 flex max-w-5xl flex-col items-center text-center"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.9em" }}
          animate={{ opacity: 1, letterSpacing: "0.45em" }}
          transition={{ duration: 1.4, ease: EASE_LUXE, delay: 0.25 }}
          className="mb-8 text-[10px] font-medium uppercase text-stone-mute md:text-[11px]"
        >
          Generative Spatial Design Studio
        </motion.p>

        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-display text-[13vw] leading-[0.98] tracking-[-0.01em] sm:text-7xl md:text-8xl lg:text-[7.5rem]"
        >
          <span className="block overflow-hidden">
            <motion.span variants={wordVariants} className="inline-block">
              Space,
            </motion.span>{" "}
            <span className="inline-block overflow-hidden align-bottom">
              <motion.em
                variants={wordVariants}
                className="inline-block text-clay"
              >
                quietly
              </motion.em>
            </span>
          </span>
          <MaskedWords text="computed." />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.9 }}
          className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-soft md:text-base"
        >
          Aether Spatial composes environments where algorithms learn the
          grammar of calm — architecture that breathes, listens, and recedes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 1.1 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <HapticButton href="#works">View Works</HapticButton>
          <HapticButton href="#contact" variant="ghost">
            Start a Commission
          </HapticButton>
        </motion.div>
      </motion.div>

      {/* editorial side rails — quiet metadata framing (desktop only) */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE_EDITORIAL, delay: 1.3 }}
        className="pointer-events-none absolute top-1/2 left-7 hidden -translate-y-1/2 lg:block"
      >
        <span className="block rotate-180 text-[9px] font-medium uppercase tracking-[0.42em] text-stone-mute/80 [writing-mode:vertical-rl]">
          Generative Spatial Index — MMXXVI
        </span>
      </motion.div>
      <motion.div
        aria-hidden
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE_EDITORIAL, delay: 1.45 }}
        className="pointer-events-none absolute top-1/2 right-7 hidden -translate-y-1/2 lg:block"
      >
        <span className="block text-[9px] font-medium uppercase tracking-[0.42em] text-stone-mute/80 [writing-mode:vertical-rl]">
          47.3769° N — 8.5417° E
        </span>
      </motion.div>

      {/* scroll cue — labelled line with a gentle infinite float */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{ opacity: copyOpacity }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.45em] text-stone-mute">
            Scroll
          </span>
          <div className="h-12 w-px overflow-hidden bg-ink/15">
            <motion.div
              animate={{ y: [-48, 48] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="h-1/2 w-full bg-ink/70"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
