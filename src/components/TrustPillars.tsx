"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { playHoverBlip } from "@/lib/sound";
import { SPRING_JELLY } from "@/lib/motion-presets";
import { getCloudMedia } from "@/lib/media";
import { LuxuryImage } from "./vault/luxury-image";
import { SplitReveal } from "./SplitReveal";

const LUXE = {
  type: "spring",
  stiffness: 350,
  damping: 26,
  mass: 0.6,
} as const;

const PORTRAIT = getCloudMedia("editorial", "redStudioPortrait");

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function ShieldIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3 19 5.8v5.4c0 4.6-3 7.6-7 8.8-4-1.2-7-4.2-7-8.8V5.8L12 3Z" />
      <path d="m9 11.5 2 2 4-4.2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg {...iconProps}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <circle cx="12" cy="15.2" r="1.1" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3.5 8 12 4l8.5 4-8.5 4L3.5 8Z" />
      <path d="M3.5 8v8L12 20l8.5-4V8" />
      <path d="M12 12v8" />
    </svg>
  );
}

const PILLARS = [
  {
    title: "Atelier Verification & Authentication",
    body: "Every item inspected and hand-verified before shipment.",
    icon: ShieldIcon,
  },
  {
    title: "Vaulted Escrow Release",
    body: "Merchant payout is locked until you receive, inspect, and approve your order.",
    icon: LockIcon,
  },
  {
    title: "White-Glove Insured Logistics",
    body: "Armored, temperature-controlled transit with direct courier tracking.",
    icon: BoxIcon,
  },
];

/**
 * TrustPillars — the merged Trust & Patron Hub.
 * One master section, two columns: the escrow-verified patron story
 * (portrait, quote, rating) on the left; The Valobite Standard headline
 * with three stacked glass trust cards on the right.
 */
/* ——— Trust pillar card with cursor-tracked specular light glare ————— */
function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof PILLARS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Magnetic jelly pull (±8px) + 3D tilt (±5deg) on cursor hover.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, SPRING_JELLY);
  const sy = useSpring(my, SPRING_JELLY);
  const magX = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const magY = useTransform(sy, [-0.5, 0.5], [-8, 8]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5]);
  const glareX = useMotionValue(-400);
  const glareY = useMotionValue(-400);
  const glare = useMotionTemplate`radial-gradient(400px circle at ${glareX}px ${glareY}px, rgba(255, 255, 255, 0.28), transparent 70%)`;
  // Warm clay glow trailing the cursor beneath the specular sheen.
  const glow = useMotionTemplate`radial-gradient(300px circle at ${glareX}px ${glareY}px, rgba(150, 119, 76, 0.22), transparent 70%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...LUXE, delay: 0.15 + index * 0.08 }}
    >
    <motion.div
      ref={ref}
      onMouseEnter={() => playHoverBlip()}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((event.clientX - rect.left) / rect.width - 0.5);
        my.set((event.clientY - rect.top) / rect.height - 0.5);
        glareX.set(event.clientX - rect.left);
        glareY.set(event.clientY - rect.top);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ x: magX, y: magY, rotateX, rotateY, transformPerspective: 900 }}
      className="glass-vision group relative flex items-start gap-5 overflow-hidden rounded-[1.8rem] p-6 will-change-transform md:p-7"
    >
      <span className="relative z-20 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-clay-deep/30 bg-white/55 text-clay-deep">
        {pillar.icon()}
      </span>
      <div className="relative z-20">
        <h3 className="font-display text-xl italic leading-snug">
          {pillar.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
          {pillar.body}
        </p>
      </div>
      {/* Clay glass glow — warm bloom trailing the cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-[5]"
        style={{ background: glow }}
      />
      {/* Dynamic Specular Light Glare */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
        style={{ background: glare }}
      />
    </motion.div>
    </motion.div>
  );
}

export function TrustPillars() {
  return (
    <section id="standard" className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] lg:gap-20">
        {/* ——— Left (45%): patron portrait + quote ——— */}
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...LUXE }}
          className="relative mx-auto w-full max-w-sm self-center lg:max-w-none"
        >
          <div className="relative">
            <LuxuryImage
              asset={PORTRAIT}
              alt="Color-graded high-fashion studio portrait of a Valobite patron"
              className="aspect-square w-full rounded-[2.2rem]"
              imageClassName="saturate-[1.08]"
              ambientShadow
            />
            {/* warm amber→terracotta grade */}
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-tr from-[#9c3b28]/25 via-transparent to-[#d6a75f]/30 mix-blend-multiply" />
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-transparent to-[#b3a184]/20" />
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[2.2rem] ring-1 ring-clay-deep/30 ring-inset" />
            <p className="frost-pill absolute bottom-4 left-4 z-10 rounded-full px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-ink">
              Patron Nº 047 — Kyoto
            </p>
          </div>

          <blockquote className="mt-14">
            <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-mute">
              Escrow Verified Patrons
            </p>
            <p className="font-display mt-6 text-3xl italic leading-[1.18] text-ink-strong md:text-4xl">
              “The only marketplace where modern craftsmanship is curated
              with the discipline of a{" "}
              <em className="text-clay-deep not-italic">gallery</em>.”
            </p>
            <footer className="mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-full border border-clay-deep/30 bg-white/50 px-5 py-2.5 backdrop-blur-sm">
              <span aria-hidden className="text-[13px] tracking-[0.18em] text-clay-deep">
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
          </blockquote>
        </motion.div>

        {/* ——— Right (55%): The Valobite Standard ——— */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-mute">
            Patron Security &amp; Escrow
          </p>
          <h2 className="font-display mt-5 text-5xl leading-[1.02] md:text-6xl">
            <SplitReveal text="The" delay={0.05} />{" "}
            <em className="text-clay italic">
              <SplitReveal text="Valobite Standard" delay={0.25} />
            </em>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-stone-mute">
            Three commitments behind every order — so you can collect with
            complete confidence.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {PILLARS.map((pillar, i) => (
              <PillarCard key={pillar.title} pillar={pillar} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}