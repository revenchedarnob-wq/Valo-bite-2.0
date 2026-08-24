"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** ScrollProgress — a hairline clay bar tracking page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[85] h-[2.5px] origin-left bg-gradient-to-r from-clay via-ink to-clay"
    />
  );
}
