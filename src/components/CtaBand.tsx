"use client";

import { motion } from "motion/react";
import { playHapticClick, playHoverBlip } from "@/lib/sound";
import { openSellerDrawer } from "./CommissionDrawer";
import { Magnetic } from "./Magnetic";
import { Bloom } from "./Bloom";

const LUXE = { type: "spring", stiffness: 350, damping: 26, mass: 0.6 } as const;

/**
 * CtaBand — the merchant recruitment band ahead of the footer.
 * Reuses the frosted card + shine-button language from the old
 * commission block, now pointed at seller onboarding.
 */
export function CtaBand() {
  return (
    <section id="sell" className="mx-auto max-w-7xl px-6 pb-28 md:pb-36">
      <motion.div
        initial={{ opacity: 0, y: 48, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ ...LUXE }}
        className="frost-pill relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center md:px-16 md:py-24"
      >
        {/* oversized ambient bloom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07]"
        >
          <Bloom size={520} />
        </div>

        <div className="relative">
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-mute">
            Sellers · Free to list
          </p>
          <h2 className="font-display mx-auto mt-6 max-w-3xl text-5xl leading-[1.02] md:text-7xl">
            Ready to open <em className="text-clay italic">your shop?</em>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft md:text-base">
            Join thousands of merchants already growing their business
            globally.
          </p>

          <div className="mt-12 flex justify-center">
            <Magnetic strength={0.25}>
              <motion.button
                onClick={() => {
                  playHapticClick();
                  openSellerDrawer();
                }}
                onMouseEnter={() => playHoverBlip()}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={LUXE}
                className="btn-shine group inline-flex cursor-pointer items-center gap-3 rounded-full bg-ink px-8 py-4 text-[13px] font-semibold tracking-[0.12em] text-alabaster uppercase shadow-[0_16px_40px_-16px_rgba(33,30,25,0.5)]"
              >
                Start Selling Today
                <span
                  aria-hidden
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                >
                  →
                </span>
              </motion.button>
            </Magnetic>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
