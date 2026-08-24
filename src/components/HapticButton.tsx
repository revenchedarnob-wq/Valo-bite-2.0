"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { playHapticClick } from "@/lib/sound";

const MICRO_HAPTIC = { type: "spring", stiffness: 450, damping: 18 } as const;

type HapticButtonProps = {
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  href?: string;
  onClick?: () => void;
};

/**
 * The single button primitive for the entire site.
 * Every press fires `playHapticClick()` + a snappy spring compression.
 */
export function HapticButton({
  children,
  variant = "solid",
  className = "",
  href,
  onClick,
}: HapticButtonProps) {
  const base =
    "group relative inline-flex items-center gap-2 rounded-full px-7 py-3 text-[13px] font-medium tracking-[0.08em] uppercase cursor-pointer select-none";
  const skin =
    variant === "solid"
      ? "bg-ink text-alabaster shadow-[0_16px_40px_-16px_rgba(33,30,25,0.5)]"
      : "frost-pill text-ink";

  const handle = () => {
    playHapticClick();
    onClick?.();
  };

  return (
    <motion.a
      href={href}
      onClick={(e) => {
        if (!href) e.preventDefault();
        handle();
      }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={MICRO_HAPTIC}
      className={`${base} ${skin} ${className}`}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        <span
          aria-hidden
          className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </motion.a>
  );
}
