"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { playHapticClick, playHoverBlip } from "@/lib/sound";
import { Bloom } from "./Bloom";
import { EASE_LUXE } from "@/lib/motion-presets";

/* ——— Floating frosted pill ——————————————————————————————— */
function FrostPill({
  label,
  className = "",
  delay = 0,
}: {
  label: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 350, damping: 26, delay }}
      className={`frost-pill absolute z-20 rounded-full px-4 py-2 text-[11px] font-medium tracking-[0.08em] uppercase text-ink ${className}`}
    >
      <motion.span
        animate={{ y: [0, -7, 0] }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
        className="inline-block"
      >
        {label}
      </motion.span>
    </motion.span>
  );
}

/* ——— Card shell with scroll parallax ————————————————————— */
type CardProps = {
  children: React.ReactNode;
  className?: string;
  progress: MotionValue<number>;
  range?: [number, number];
  drift?: number;
};

function ParallaxCard({
  children,
  className = "",
  progress,
  range = [0, 1],
  drift = 30,
}: CardProps) {
  const y = useTransform(progress, range, [drift, -drift]);
  return (
    <motion.article
      style={{ y }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 350, damping: 26, mass: 0.6 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-ink/[0.07] bg-white/45 p-8 shadow-[0_32px_80px_-48px_rgba(33,30,25,0.25)] backdrop-blur-sm transition-[border-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-ink/[0.16] hover:shadow-[0_44px_100px_-44px_rgba(33,30,25,0.38)] md:p-10 ${className}`}
    >
      {children}
    </motion.article>
  );
}

/* ——— Live status badge with pulsing emerald ping ————————————————— */
function LiveBadge({ className = "" }: { className?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 350, damping: 26, delay: 1.1 }}
      className={`frost-pill absolute z-20 flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-medium tracking-[0.08em] uppercase text-ink ${className}`}
    >
      <span aria-hidden className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      Realtime
    </motion.span>
  );
}

/* ——— 3D pearl sphere with cursor-driven lighting tilt ————————————— */
function PearlSphere() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), {
    stiffness: 140,
    damping: 16,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), {
    stiffness: 140,
    damping: 16,
  });
  // The specular highlight drifts across the surface as the cursor moves.
  const hx = useTransform(mx, [-0.5, 0.5], ["64%", "28%"]);
  const hy = useTransform(my, [-0.5, 0.5], ["24%", "46%"]);
  const sheen = useTransform([hx, hy], (v) => {
    const [x, y] = v as string[];
    return `radial-gradient(circle at ${x} ${y}, #fdfcfa, #d9cfba 55%, #b3a184)`;
  });

  return (
    <div
      ref={ref}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((event.clientX - rect.left) / rect.width - 0.5);
        my.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative mx-auto h-36 w-36 shrink-0 md:h-44 md:w-44"
      style={{ perspective: 700 }}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry }}
        className="h-full w-full will-change-transform"
      >
        <motion.div
          style={{ backgroundImage: sheen }}
          className="absolute inset-0 rounded-full shadow-[inset_0_2px_12px_rgba(255,255,255,0.9),0_24px_48px_-24px_rgba(33,30,25,0.4)]"
        />
      </motion.div>
    </div>
  );
}

/* ——— The sculptural bento grid ———————————————————————————— */
export function Bento() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section
      ref={ref}
      id="works"
      className="mx-auto max-w-7xl px-6 py-28 md:py-36"
    >
      {/* section heading */}
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display max-w-xl text-5xl leading-[1.02] md:text-6xl">
          Three gestures of <em className="text-clay italic">form</em>
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-stone-mute">
          Selected studies in generative spatial composition — each one grown,
          not drawn.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 01 — tall sculptural card */}
        <ParallaxCard
          progress={smooth}
          range={[0, 0.6]}
          drift={44}
          className="lg:row-span-2 lg:min-h-[34rem]"
        >
          <FrostPill label="01 — Volumetric" className="top-6 right-6" />
          <div className="relative flex h-full min-h-72 items-center justify-center">
            {/* ambient breathing loop — the canopy never sits still */}
            <motion.div
              animate={{ scale: [1, 1.03, 1], rotate: [0, 1.5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <Bloom
                size={260}
                color="#b3a184"
                className="opacity-90 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[22deg] group-hover:scale-110"
              />
            </motion.div>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] text-stone-mute uppercase">
              Study Nº 04
            </p>
            <h3 className="font-display mt-2 text-3xl italic md:text-4xl">
              Petal Field Pavilion
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              A four-fold generative canopy grown from a single blossom
              algorithm — 1,204 unique panels, no two alike.
            </p>
          </div>
        </ParallaxCard>

        {/* Card 02 — wide horizontal */}
        <ParallaxCard
          progress={smooth}
          range={[0.15, 0.85]}
          drift={26}
          className="md:col-span-2 lg:col-span-2"
        >
          <FrostPill label="Light Study" className="top-6 left-8" delay={0.6} />
          <LiveBadge className="top-6 right-8" />
          <div className="grid items-center gap-8 py-4 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] text-stone-mute uppercase">
                Study Nº 07
              </p>
              <h3 className="font-display mt-2 text-3xl italic md:text-4xl">
                Alabaster Drift
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
                Daylight choreography simulated across 86,000 hours — a lobby
                that never repeats its light twice.
              </p>
            </div>
            <PearlSphere />
          </div>
        </ParallaxCard>

        {/* Card 03 — quiet square */}
        <ParallaxCard
          progress={smooth}
          range={[0.3, 1]}
          drift={38}
          className="md:col-span-2 lg:col-span-1"
        >
          <FrostPill
            label="03 — Acoustic"
            className="right-6 bottom-6"
            delay={0.9}
          />
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] text-stone-mute uppercase">
              Study Nº 09
            </p>
            <h3 className="font-display mt-2 text-3xl italic md:text-4xl">
              Hush Chambers
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              Sound-mapped reading rooms whose curved plaster walls absorb the
              city at −42&nbsp;dB.
            </p>
          </div>
          <div className="pointer-events-none relative mt-8 h-32 overflow-hidden rounded-2xl">
            {/* acoustic ripple rings — sonar pulses revealed on approach */}
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden
                className="ring-ripple absolute top-1/2 left-12 rounded-full border border-clay/60 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ animationDelay: `${i * 1.05}s` }}
              />
            ))}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.4,
                  delay: i * 0.08,
                  ease: EASE_LUXE,
                }}
                className="h-px w-full origin-left bg-gradient-to-r from-transparent via-clay/70 to-transparent"
                style={{ marginTop: `${20 + i * 2}px` }}
              />
            ))}
          </div>
        </ParallaxCard>
      </div>

      {/* grid footer link */}
      <div className="mt-14 flex justify-center">
        <button
          onClick={() => playHapticClick()}
          onMouseEnter={() => playHoverBlip()}
          className="group inline-flex cursor-pointer items-center gap-3 text-[12px] font-semibold tracking-[0.2em] uppercase text-ink"
        >
          <span className="border-b border-ink/30 pb-1 transition-colors duration-500 group-hover:border-ink">
            Explore the full archive
          </span>
          <span
            aria-hidden
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
          >
            ↗
          </span>
        </button>
      </div>
    </section>
  );
}
