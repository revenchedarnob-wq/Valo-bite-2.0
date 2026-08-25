"use client";

import { useRef, useState } from "react";
import { motion, type PanInfo } from "motion/react";
import { playHapticClick, playHapticFlick, playHoverBlip } from "@/lib/sound";
import { getCloudMedia } from "@/lib/media";
import { LuxuryImage } from "./vault/luxury-image";

/* Layer offsets — Instagram deck physics: front, behind, deep, deeper. */
/* Layer offsets — a visibly fanned hand of cards: card 1 leans out the
   top-left corner, card 2 out the top-right, card 3 rests as the base. */
const LAYER_STYLES = [
  { scale: 1, x: 0, y: 0, rotate: 0, opacity: 1, zIndex: 40 },
  { scale: 0.94, x: -38, y: 8, rotate: -8, opacity: 0.9, zIndex: 30 },
  { scale: 0.88, x: 38, y: 16, rotate: 8, opacity: 0.75, zIndex: 20 },
  { scale: 0.82, x: 0, y: 28, rotate: -2, opacity: 0.5, zIndex: 10 },
] as const;

const SPRING = { type: "spring", stiffness: 300, damping: 25 } as const;

type Capsule = {
  title: string;
  note: string;
  meta: string;
  image: ReturnType<typeof getCloudMedia>;
};

const CAPSULES: Capsule[] = [
  {
    title: "The Kyoto Ceramics Guild",
    note: "Artisanal stoneware from 14 working kilns.",
    meta: "42 Pieces · From $76",
    image: getCloudMedia("home", "ceramicVase"),
  },
  {
    title: "The Milanese Leather Archive",
    note: "Vintage Italian calfskin, condition-graded.",
    meta: "64 Pieces · From $240",
    image: getCloudMedia("accessories", "leatherTote"),
  },
  {
    title: "Bespoke Silk & Tailoring",
    note: "Atelier womenswear cut and sewn to order.",
    meta: "128 Pieces · From $189",
    image: getCloudMedia("fashion", "silkMidiDress"),
  },
  {
    title: "Bauhaus Horology Vault",
    note: "Brushed steel & minimal mechanical watches.",
    meta: "18 Pieces · From $320",
    image: getCloudMedia("accessories", "minimalWatch"),
  },
];

/**
 * CapsuleEdit — "Seasonal Curated Capsules" as an Instagram-style
 * stacked photo deck (4 layered cards). Click, tap, or swipe the front
 * card and it flings away with spring physics while the next capsule
 * springs to the front.
 */
export function CapsuleEdit() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [exiting, setExiting] = useState(false);
  const dirRef = useRef(1);
  const count = CAPSULES.length;

  const cycle = (dir = 1) => {
    if (exiting) return;
    dirRef.current = dir;
    playHapticFlick();
    setExiting(true);
    // Let the flick read before the stack re-orders underneath.
    window.setTimeout(() => {
      setActiveIdx((i) => (i + 1) % count);
      setExiting(false);
    }, 190);
  };

  return (
    <section id="capsules" className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <div className="mb-4 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-mute">
          Curator's Edit · Autumn 2026
        </p>
        <h2 className="font-display mt-5 text-5xl leading-[1.02] md:text-6xl">
          Seasonal{" "}
          <em className="text-clay italic">Curated Capsules</em>
        </h2>
      </div>

      {/* ——— The deck ——— */}
      <div className="relative mx-auto mt-14 h-[480px] max-w-md md:h-[520px]">
        {CAPSULES.map((capsule, i) => {
          const layer = (i - activeIdx + count) % count;
          const style = LAYER_STYLES[layer];
          const isFront = layer === 0;
          return (
            <motion.button
              key={capsule.title}
              type="button"
              initial={false}
              animate={
                isFront && exiting
                  ? {
                      x: dirRef.current * 480,
                      y: 40,
                      rotate: dirRef.current * 16,
                      scale: 0.95,
                      opacity: 0,
                    }
                  : { ...style }
              }
              transition={SPRING}
              style={{ zIndex: style.zIndex, transformOrigin: "bottom center" }}
              onClick={() => isFront && cycle(1)}
              onKeyDown={(event) => {
                if (isFront && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  cycle(1);
                }
              }}
              onMouseEnter={() => isFront && playHoverBlip()}
              drag={isFront ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.55}
              onDragEnd={(_event, info: PanInfo) => {
                if (!isFront) return;
                if (
                  Math.abs(info.offset.x) > 70 ||
                  Math.abs(info.velocity.x) > 420
                ) {
                  cycle(info.offset.x >= 0 ? 1 : -1);
                }
              }}
              whileTap={isFront ? { scale: 0.985 } : undefined}
              aria-label={`${
                isFront ? "Swap to next capsule" : "Capsule in stack"
              }: ${capsule.title}`}
              className="absolute inset-0 cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/20 bg-stone-900 text-left shadow-2xl"
            >
              <LuxuryImage
                asset={capsule.image}
                alt={capsule.title}
                className="absolute inset-0 h-full w-full"
                hoverZoom={false}
              />
              {/* 100%-contrast bottom scrim */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 z-20 rounded-b-[2.5rem] bg-gradient-to-t from-black/95 via-black/60 to-transparent p-7 pt-28"
              >
                <h3 className="font-display text-2xl font-bold italic leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] md:text-3xl">
                  {capsule.title}
                </h3>
                <p className="mt-1.5 text-xs text-white/80 md:text-sm">{capsule.note}</p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-clay-light tabular-nums">
                  {capsule.meta}
                </p>
              </div>
              {/* top-right chip */}
              <span className="frost-pill absolute top-6 right-6 z-10 rounded-full bg-black/40 px-4 py-1.5 text-[9px] uppercase tracking-widest text-white backdrop-blur-md">
                ✦ Curated Nº 0{i + 1}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ——— Stack indicator ——— */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {CAPSULES.map((capsule, i) => (
            <button
              key={capsule.title}
              type="button"
              aria-label={`Show ${capsule.title}`}
              onClick={() => {
                playHapticClick();
                setActiveIdx(i);
              }}
              onMouseEnter={() => playHoverBlip()}
              className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? "w-8 bg-clay-deep"
                  : "w-1.5 bg-ink/25 hover:bg-ink/45"
              }`}
            />
          ))}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-mute tabular-nums">
          Card {activeIdx + 1} of {count} · Tap card to swap →
        </p>
      </div>
    </section>
  );
}