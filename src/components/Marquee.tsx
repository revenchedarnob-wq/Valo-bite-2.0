"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { playHapticClick, playHoverBlip } from "@/lib/sound";
import { SPRING_MICRO } from "@/lib/motion-presets";

const WORDS = [
  "Fashion",
  "Accessories",
  "Footwear",
  "Beauty",
  "Home",
  "Electronics",
];

/**
 * Marquee — the scrolling category ticker between the hero and stats.
 * Each word is a real button: clicking it filters the Browse Products
 * grid below (the home page wires `onSelect` to the shared filter state
 * and scrolls to the section). The animation pauses on hover.
 */
export function Marquee({
  onSelect,
}: {
  onSelect?: (category: string) => void;
}) {
  const strip = [...WORDS, ...WORDS];

  // The strip skews with scroll velocity, then springs back to flat.
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, {
    stiffness: 120,
    damping: 44,
  });
  const skewX = useTransform(smoothVelocity, [-2600, 2600], [-7, 7], {
    clamp: true,
  });

  return (
    <div className="hairline overflow-hidden border-y py-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        style={{ skewX }}
        className="flex w-max animate-marquee items-center will-change-transform hover:[animation-play-state:paused]"
      >
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
            {strip.map((word, i) => (
              <motion.button
                key={`${half}-${i}`}
                type="button"
                tabIndex={half === 1 ? -1 : undefined}
                onClick={() => {
                  playHapticClick();
                  onSelect?.(word);
                }}
                onMouseEnter={() => playHoverBlip()}
                whileTap={{ scale: 0.94 }}
                transition={SPRING_MICRO}
                aria-label={`Browse ${word} products`}
                className="font-display group flex cursor-pointer items-center gap-8 pr-8 text-2xl italic whitespace-nowrap text-ink/60 transition-colors duration-300 hover:text-clay-deep md:text-3xl"
              >
                {word}
                <svg width="14" height="14" viewBox="0 0 120 120" aria-hidden>
                  <path
                    d="M 60 60 C 60 36, 74 20, 60 6 C 46 20, 60 36, 60 60 Z"
                    fill="#b3a184"
                    opacity="0.7"
                  />
                </svg>
              </motion.button>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
