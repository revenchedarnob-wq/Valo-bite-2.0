"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { playHapticClick, playHoverBlip } from "@/lib/sound";
import { scrollToSelector } from "@/lib/scroll";
import { Bloom } from "./Bloom";
import { EASE_EDITORIAL, EASE_LUXE, SPRING_JELLY } from "@/lib/motion-presets";

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
  const [query, setQuery] = useState("");

  // Micro-magnetic attraction (±6px) — the Explore button leans toward
  // the cursor as it travels across the search capsule.
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const msx = useSpring(magnetX, SPRING_JELLY);
  const msy = useSpring(magnetY, SPRING_JELLY);
  const handleCapsuleMove = (event: React.MouseEvent<HTMLFormElement>) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    magnetX.set(((event.clientX - rect.left) / rect.width - 0.5) * 12);
    magnetY.set(((event.clientY - rect.top) / rect.height - 0.5) * 12);
  };
  const handleCapsuleLeave = () => {
    magnetX.set(0);
    magnetY.set(0);
  };

  const handleExplore = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    playHapticClick();
    scrollToSelector("#sellers");
  };
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
        style={{ y: copyY }}
        className="relative z-10 flex max-w-5xl flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_LUXE, delay: 0.25 }}
          className="frost-pill mb-8 inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[10px] font-semibold tracking-[0.28em] uppercase text-ink md:text-[11px]"
        >
          <Bloom size={13} />
          The multi-seller marketplace for the modern era
        </motion.div>

        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-display text-[13vw] leading-[0.98] tracking-[-0.01em] sm:text-7xl md:text-8xl lg:text-[7.5rem]"
        >
          <MaskedWords text="Discover Premium" />
          <span className="block overflow-hidden">
            <motion.em
              variants={wordVariants}
              className="inline-block text-clay"
            >
              Fashion
            </motion.em>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.9 }}
          className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-soft md:text-base"
        >
          Valobite connects you with hand-picked sellers offering curated
          products you won't find anywhere else.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 1.1 }}
          className="mt-10 flex w-full flex-col items-center gap-4"
        >
          <form
            onSubmit={handleExplore}
            role="search"
            onMouseMove={handleCapsuleMove}
            onMouseLeave={handleCapsuleLeave}
            className="frost-pill flex w-full max-w-lg items-center gap-2 rounded-full p-2 pr-2 pl-6"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="shrink-0 text-stone-mute"
            >
              <circle cx="6" cy="6" r="4.2" stroke="currentColor" />
              <path d="m9.4 9.4 3 3" stroke="currentColor" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sellers..."
              aria-label="Search sellers"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-stone-mute"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 450, damping: 18 }}
              style={{ x: msx, y: msy }}
              onMouseEnter={() => playHoverBlip()}
              className="btn-shine group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-clay px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink shadow-[0_16px_40px_-14px_rgba(150,119,76,0.65)] transition-colors duration-300 will-change-transform hover:bg-clay-deep hover:text-alabaster"
            >
              Explore
              <span
                aria-hidden
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </motion.button>
          </form>
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
          2,400+ active sellers — escrow protected
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
          Buyer protection on every order
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

