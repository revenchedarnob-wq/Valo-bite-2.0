"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "motion/react";
import { EASE_LUXE, SPRING_JELLY } from "@/lib/motion-presets";

/* ——— Animated count-up number ——————————————————————————————————— */
function CountUp({
  to,
  format,
  duration = 2.4,
}: {
  to: number;
  format: (value: number) => string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE_LUXE,
      onUpdate: (value) => {
        if (ref.current) ref.current.textContent = format(value);
      },
    });
    return () => controls.stop();
  }, [inView, to, duration, format]);

  return <span ref={ref}>{format(0)}</span>;
}

/* ——— Hairline stat glyphs ——————————————————————————————————————— */
const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function SellersIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="7" cy="7" r="2.6" />
      <path d="M2.5 16c.6-2.8 2.4-4.2 4.5-4.2S10.9 13.2 11.5 16" />
      <circle cx="14" cy="8" r="2.1" />
      <path d="M13.5 12.2c2 .2 3.4 1.5 4 3.8" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 6.5h12l-1 10a1.5 1.5 0 0 1-1.5 1.3h-7A1.5 1.5 0 0 1 5 16.5l-1-10Z" />
      <path d="M7 8.5v-3a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function BuyersIcon() {
  return (
    <svg {...iconProps}>
      <path d="M10 17s-6.5-3.8-6.5-8.3A3.6 3.6 0 0 1 10 6.4a3.6 3.6 0 0 1 6.5 2.3C16.5 13.2 10 17 10 17Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...iconProps}>
      <path d="M10 2.5 16 5v5c0 4-2.7 6.6-6 7.5C6.7 16.6 4 14 4 10V5l6-2.5Z" />
      <path d="m7.6 9.8 1.7 1.7 3.1-3.2" />
    </svg>
  );
}

const STATS: Array<{
  to: number;
  format: (v: number) => string;
  label: string;
  note: string;
  icon: () => React.JSX.Element;
}> = [
  {
    to: 2_400,
    format: (v) => `${Math.round(v).toLocaleString("en-US")}+`,
    label: "Active Sellers",
    note: "Verified merchants trading on Valobite right now.",
    icon: SellersIcon,
  },
  {
    to: 18_000,
    format: (v) => `${Math.round(v).toLocaleString("en-US")}+`,
    label: "Products Listed",
    note: "Curated pieces you won't find anywhere else.",
    icon: ProductsIcon,
  },
  {
    to: 85_000,
    format: (v) => `${Math.round(v).toLocaleString("en-US")}+`,
    label: "Happy Buyers",
    note: "Discerning customers who keep coming back.",
    icon: BuyersIcon,
  },
  {
    to: 1_200,
    format: (v) => `${Math.round(v).toLocaleString("en-US")}+`,
    label: "Transaction Security",
    note: "Payments protected daily by escrow custody.",
    icon: ShieldIcon,
  },
];

/**
 * Stats — the marketplace strip that sits directly under the hero.
 * Same count-up card language as the old telemetry matrix, now carrying
 * Valobite's trading numbers.
 */
export function Stats() {
  return (
    <section id="stats" className="mx-auto max-w-7xl px-6 py-20 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        whileHover={{
          y: -6,
          transition: SPRING_JELLY,
        }}
        className="glass-vision mx-auto max-w-5xl rounded-[2.2rem] p-8 will-change-transform"
      >
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="relative pl-5">
              <span
                aria-hidden
                className="absolute top-1 bottom-1 left-0 w-px bg-clay/40"
              />
              <span className="inline-flex text-clay">{stat.icon()}</span>
              <p className="font-display mt-4 text-4xl leading-none tracking-tight tabular-nums md:text-5xl">
                <CountUp to={stat.to} format={stat.format} />
              </p>
              <p className="mt-3 text-[11px] font-semibold tracking-[0.24em] text-ink uppercase">
                {stat.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-mute">
                {stat.note}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
