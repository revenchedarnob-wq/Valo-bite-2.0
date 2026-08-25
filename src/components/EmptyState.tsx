"use client";

import { motion } from "motion/react";
import { Bloom } from "./Bloom";

type EmptyStateProps = {
  title: string;
  note: string;
};

/**
 * EmptyState — the quiet fallback for data-driven sections.
 * Rendered automatically whenever a section's data array is empty,
 * so real content can be wired in later without touching the UI.
 */
export function EmptyState({ title, note }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 350, damping: 26 }}
      className="frost-pill relative flex flex-col items-center overflow-hidden rounded-[2rem] px-8 py-20 text-center md:py-28"
    >
      {/* oversized watermark bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]"
      >
        <Bloom size={300} />
      </div>

      <p className="relative text-sm font-semibold tracking-[0.08em] text-ink">
        {title}
      </p>
      <p className="relative mt-2 text-sm text-stone-mute">{note}</p>
    </motion.div>
  );
}
