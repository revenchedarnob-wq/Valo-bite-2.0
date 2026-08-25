"use client";

import { motion } from "motion/react";

type SplitRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
};

const EASE_LUXE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function SplitReveal({
  text,
  className = "",
  delay = 0,
}: SplitRevealProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, ease: EASE_LUXE, delay }}
      className={`inline text-inherit ${className}`}
    >
      {text}
    </motion.span>
  );
}
