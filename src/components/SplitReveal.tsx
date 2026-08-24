"use client";

import { motion } from "motion/react";

type SplitRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  /** Seconds between each word. */
  stagger?: number;
};

/**
 * SplitReveal — word-by-word masked rise for headings.
 * Each word slides up out of an overflow-hidden clip.
 */
export function SplitReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.055,
}: SplitRevealProps) {
  const words = text.split(" ");
  return (
    <span className={`inline ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "112%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 26,
              delay: delay + i * stagger,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
