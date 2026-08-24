"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Cursor — a quiet clay dot with a lagging ink ring.
 * The ring swells over any interactive element. Desktop-only
 * (pointer: fine); the native cursor is hidden via a root class.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement | null;
      setHovering(
        Boolean(target?.closest("a, button, input, textarea, [data-cursor]")),
      );
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: hovering ? 1.9 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="pointer-events-none fixed top-0 left-0 z-[9998] -ml-[18px] -mt-[18px] h-9 w-9 rounded-full border border-ink/35"
      />
      {/* Precise dot */}
      <motion.div
        aria-hidden
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
      >
        <motion.div
          animate={{ scale: hovering ? 0.5 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="-ml-1 -mt-1 h-2 w-2 rounded-full bg-clay"
        />
      </motion.div>
    </>
  );
}
