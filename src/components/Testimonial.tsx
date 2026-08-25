"use client";

import { motion } from "motion/react";
import { getCloudMedia } from "@/lib/media";
import { LuxuryImage } from "./vault/luxury-image";

const LUXE = {
  type: "spring",
  stiffness: 350,
  damping: 26,
  mass: 0.6,
} as const;

const PORTRAIT = getCloudMedia("editorial", "redStudioPortrait");

/**
 * Testimonial — the editorial VIP patron strip ahead of Marketplace Pulse.
 * A color-graded studio portrait paired with a serif-italic architectural
 * quote and an escrow trust chip.
 */
export function Testimonial() {
  return (
    <section id="patrons" className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16">
        {/* studio portrait */}
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px", amount: 0.1 }}
          transition={{ ...LUXE }}
          className="group relative mx-auto w-full max-w-sm"
        >
          <LuxuryImage
            asset={PORTRAIT}
            alt="Color-graded high-fashion studio portrait of a Valobite patron"
            className="aspect-square w-full rounded-[2.2rem]"
            ambientShadow
            imageClassName="saturate-[1.08]"
          />
          {/* warm amber→terracotta grade over the photograph */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-tr from-[#9c3b28]/25 via-transparent to-[#d6a75f]/30 mix-blend-multiply"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-transparent to-[#b3a184]/20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[2.2rem] ring-1 ring-clay-deep/30 ring-inset"
          />
          <p className="frost-pill absolute bottom-5 left-5 z-10 rounded-full px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-ink">
            Patron Nº 047 — Kyoto
          </p>
        </motion.div>

        {/* architectural quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 44, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "0px", amount: 0.1 }}
          transition={{ ...LUXE, delay: 0.1 }}
          className="relative"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-mute">
            Escrow Verified Patrons
          </p>

          <p className="font-display mt-8 text-3xl italic leading-[1.18] text-ink-strong md:text-[2.75rem]">
            “The only marketplace where modern craftsmanship is curated with
            the discipline of a{" "}
            <em className="text-clay-deep not-italic">gallery</em>.”
          </p>

          <footer className="mt-10 inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-full border border-clay-deep/30 bg-white/50 px-5 py-2.5 backdrop-blur-sm">
            <span
              aria-hidden
              className="text-[13px] tracking-[0.18em] text-clay-deep"
            >
              ★★★★★
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink tabular-nums">
              4.98 / 5.0
            </span>
            <span aria-hidden className="h-3 w-px bg-ink/20" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Escrow Verified Patron
            </span>
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
