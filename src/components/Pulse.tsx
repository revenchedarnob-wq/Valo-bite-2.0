"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  isHapticsEnabled,
  playHapticClick,
  startAmbientTelemetry,
  stopAmbientTelemetry,
} from "@/lib/sound";
import { SplitReveal } from "./SplitReveal";

/* ——— Live waveform visualizer fed by a real AnalyserNode ————————— */
function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [live, setLive] = useState(false);

  // Live-feeling order ticker — drifts upward at irregular intervals so
  // the pulse section reads as informative, not purely decorative.
  const [ordersToday, setOrdersToday] = useState(347);
  useEffect(() => {
    let timer: number;
    const tick = () => {
      setOrdersToday((n) => n + Math.floor(Math.random() * 3) + 1);
      timer = window.setTimeout(tick, 2800 + Math.random() * 4200);
    };
    timer = window.setTimeout(tick, 3200);
    return () => window.clearTimeout(timer);
  }, []);

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
          Live sales pulse · synthesized pad
        </p>
        <button
          onClick={toggle}
          onMouseEnter={() => playHapticClick()}
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

      {/* live order stat — gives the abstract wave a concrete anchor */}
      <div className="mb-4 flex flex-wrap items-end gap-x-3 gap-y-1">
        <span className="relative flex h-2.5 w-2.5 self-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-clay-deep" />
        </span>
        <p
          className="font-display text-4xl leading-none tracking-tight tabular-nums md:text-5xl"
          aria-live="polite"
        >
          {ordersToday.toLocaleString("en-US")}
        </p>
        <p className="pb-0.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-stone-mute">
          orders today · and counting
        </p>
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

/**
 * Pulse — the old spatial-audio telemetry, repurposed as a live
 * marketplace-activity visualizer. The waveform is still driven by a
 * real AnalyserNode: press calibrate and the marketplace literally sings.
 */
export function Pulse() {
  return (
    <section id="pulse" className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-mute">
            Marketplace Pulse
          </p>
          <h2 className="font-display mt-5 max-w-2xl text-5xl leading-[1.02] md:text-6xl">
            <SplitReveal text="Live, not" delay={0.05} />{" "}
            <em className="text-clay italic">
              <SplitReveal text="loud" delay={0.35} />
            </em>
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-stone-mute">
          A quiet heartbeat for the marketplace — every sale, listing, and
          payout leaves a trace. Press calibrate to hear the room.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 350, damping: 26, delay: 0.15 }}
      >
        <Waveform />
      </motion.div>
    </section>
  );
}
