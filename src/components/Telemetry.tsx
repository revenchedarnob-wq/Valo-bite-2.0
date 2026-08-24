"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "motion/react";
import {
  isHapticsEnabled,
  playHapticClick,
  startAmbientTelemetry,
  stopAmbientTelemetry,
} from "@/lib/sound";
import { EASE_LUXE } from "@/lib/motion-presets";
import { SplitReveal } from "./SplitReveal";

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

const STATS: Array<{
  to: number;
  format: (v: number) => string;
  unit: string;
  note: string;
}> = [
  {
    to: 86_000,
    format: (v) => Math.round(v).toLocaleString("en-US"),
    unit: "Hours simulated",
    note: "Cumulative daylight & occupancy simulation across the archive.",
  },
  {
    to: 120,
    format: (v) => String(Math.round(v)),
    unit: "FPS compute ceiling",
    note: "Realtime ray-traced preview sustained on studio hardware.",
  },
  {
    to: -42,
    format: (v) => `−${Math.abs(Math.round(v))}`,
    unit: "dB acoustic calibration",
    note: "Quietest measured interior in the Hush Chambers series.",
  },
];

/* ——— Live waveform visualizer fed by a real AnalyserNode ————————— */
function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [live, setLive] = useState(false);

  const paint = (analyser: AnalyserNode | null) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const bars = 56;
    const barW = w / bars;

    if (!analyser) {
      // Idle: a barely-breathing placeholder line.
      ctx.fillStyle = "rgba(148,141,128,0.4)";
      for (let i = 0; i < bars; i++) {
        const bh = 2 + Math.abs(Math.sin(i * 0.42)) * h * 0.08;
        ctx.fillRect(i * barW + barW * 0.24, (h - bh) / 2, barW * 0.52, bh);
      }
      return;
    }

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    for (let i = 0; i < bars; i++) {
      const bin = Math.floor(Math.pow(i / bars, 1.4) * data.length * 0.72) + 1;
      const v = data[bin] / 255;
      const bh = Math.max(2, v * h * 0.86);
      const grad = ctx.createLinearGradient(0, (h - bh) / 2, 0, (h + bh) / 2);
      grad.addColorStop(0, "rgba(179,161,132,0.95)");
      grad.addColorStop(0.5, "rgba(33,30,25,0.85)");
      grad.addColorStop(1, "rgba(179,161,132,0.95)");
      ctx.fillStyle = grad;
      ctx.fillRect(i * barW + barW * 0.24, (h - bh) / 2, barW * 0.52, bh);
    }
  };

  useEffect(() => {
    let frame = 0;
    let stopped = false;
    const loop = () => {
      if (stopped) return;
      paint(analyserRef.current);
      frame = requestAnimationFrame(loop);
    };
    if (live) {
      frame = requestAnimationFrame(loop);
    } else {
      paint(null);
    }
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  useEffect(
    () => () => {
      stopAmbientTelemetry();
    },
    [],
  );

  const toggle = () => {
    playHapticClick();
    if (live) {
      analyserRef.current = null;
      stopAmbientTelemetry();
      setLive(false);
    } else {
      const analyser = startAmbientTelemetry();
      if (!analyser) return; // sound switcher is muted
      analyserRef.current = analyser;
      setLive(true);
    }
  };

  return (
    <div className="frost-pill relative overflow-hidden rounded-[2rem] p-6 md:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-stone-mute uppercase">
          Room tone · A₂ minor pad
        </p>
        <button
          onClick={toggle}
          disabled={!isHapticsEnabled()}
          className="inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-ink/15 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-ink transition-colors hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="relative flex h-2 w-2">
            {live && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-70" />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${live ? "bg-clay" : "bg-stone-mute"}`}
            />
          </span>
          {live ? "∥ Silence" : "+ Calibrate"}
        </button>
      </div>
      <canvas ref={canvasRef} className="block h-36 w-full md:h-40" aria-hidden />
      {!isHapticsEnabled() && (
        <p className="absolute inset-x-0 bottom-5 text-center text-[11px] tracking-[0.2em] text-stone-mute uppercase">
          Sound muted — enable it in the dock below
        </p>
      )}
    </div>
  );
}

/* ——— Studio telemetry section ——————————————————————————————————— */
export function Telemetry() {
  return (
    <section id="telemetry" className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-mute">
            Studio Telemetry
          </p>
          <h2 className="font-display mt-5 max-w-2xl text-5xl leading-[1.02] md:text-6xl">
            <SplitReveal text="Measured, not" delay={0.05} />{" "}
            <em className="text-clay italic">
              <SplitReveal text="decorated" delay={0.35} />
            </em>
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-stone-mute">
          Every aesthetic decision at Aether is backed by a number. These are
          the ones we brag about quietly.
        </p>
      </div>

      {/* Performance matrix */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.unit}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 26,
              delay: i * 0.1,
            }}
            className="rounded-[2rem] border border-ink/[0.07] bg-white/45 p-8 shadow-[0_32px_80px_-48px_rgba(33,30,25,0.25)] backdrop-blur-sm md:p-10"
          >
            <p className="font-display text-6xl leading-none tracking-tight tabular-nums md:text-7xl">
              <CountUp to={stat.to} format={stat.format} />
            </p>
            <p className="mt-4 text-[11px] font-semibold tracking-[0.24em] text-ink uppercase">
              {stat.unit}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-mute">
              {stat.note}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Live waveform */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 350, damping: 26, delay: 0.15 }}
        className="mt-6"
      >
        <Waveform />
      </motion.div>
    </section>
  );
}
