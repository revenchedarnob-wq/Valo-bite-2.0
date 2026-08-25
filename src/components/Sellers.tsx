"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { playHapticClick, playHoverBlip } from "@/lib/sound";
import { openPeekSheet } from "./PeekSheet";
import { SELLERS, type Seller } from "@/lib/data";
import { SPRING_MICRO, SPRING_SETTLE } from "@/lib/motion-presets";
import { EmptyState } from "./EmptyState";
import { SplitReveal } from "./SplitReveal";
import { Bloom } from "./Bloom";
import { LuxuryImage } from "./vault/luxury-image";

/* ——— Seller card with cursor-hover depth tilt ————————————————————— */
function SellerCard({ seller, index }: { seller: Seller; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 240, damping: 16, mass: 0.45 });
  const sy = useSpring(my, { stiffness: 240, damping: 16, mass: 0.45 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  // Magnetic jelly pull — the card gravitates toward the cursor (±14px).
  const magX = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const magY = useTransform(sy, [-0.5, 0.5], [-14, 14]);
  // Quick Peek pill drifts gently against the cursor for parallax life.
  const peekX = useTransform(sx, [-0.5, 0.5], [10, -10]);
  const peekY = useTransform(sy, [-0.5, 0.5], [6, -6]);

  // Dynamic Specular Light Glare — cursor-tracked optical sheen.
  const glareX = useMotionValue(-400);
  const glareY = useMotionValue(-400);
  const glare = useMotionTemplate`radial-gradient(400px circle at ${glareX}px ${glareY}px, rgba(255, 255, 255, 0.28), transparent 70%)`;

  const handleMove = (event: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
    glareX.set(event.clientX - rect.left);
    glareY.set(event.clientY - rect.top);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 44, scale: 0.95, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ ...SPRING_SETTLE, delay: index * 0.07 }}
    >
    <motion.article
      layout
      ref={ref}
      tabIndex={0}
      role="button"
      aria-label={`Visit ${seller.name}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPeekSheet({ name: seller.name, image: seller.image, sellerName: seller.name, sellerBio: seller.description, rating: seller.rating, categoryLabel: seller.tag });
          playHapticClick();
        }
      }}
      onMouseMove={handleMove}
      onMouseEnter={() => playHoverBlip()}
      onMouseLeave={handleLeave}
      onFocus={handleLeave}
      onClick={() => {
        // Touch devices have no hover state — a tap anywhere opens the peek.
        if (window.matchMedia("(hover: none)").matches) {
          openPeekSheet({ name: seller.name, image: seller.image, sellerName: seller.name, sellerBio: seller.description, rating: seller.rating, categoryLabel: seller.tag });
          return;
        }
        playHapticClick();
      }}
      whileHover={{ scale: 1.035 }}
      style={{ x: magX, y: magY, rotateX, rotateY, transformPerspective: 1100 }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[2.5rem] border border-white/85 bg-white/45 p-3.5 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.95),0_20px_50px_-15px_rgba(33,30,25,0.14)] backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-500 hover:bg-white/65 hover:border-white hover:shadow-[inset_0_2px_3px_rgba(255,255,255,1),0_35px_80px_-20px_rgba(33,30,25,0.24)] will-change-transform"
    >
      {/* Ambient Colored Backlight Orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-gradient-to-br from-clay/35 to-amber-200/25 blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100 -z-10"
      />
      {/* art area */}
      <div className="relative h-48 overflow-hidden rounded-[2rem] md:h-56">
        {seller.image ? (
          <LuxuryImage
            asset={seller.image}
            alt={seller.name}
            className="h-full w-full"
            hoverZoom
          />
        ) : (
          <div className="relative h-full w-full flex items-center justify-center bg-stone-100">
            <Bloom size={120} className="opacity-30" />
          </div>
        )}
        <span className="frost-pill absolute top-4 left-4 z-10 rounded-full px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-ink uppercase shadow-sm">
          {seller.tag}
        </span>
        {/* Floating rating pill */}
        <span className="font-display absolute bottom-3.5 left-3.5 z-10 rounded-full bg-ink/90 px-3.5 py-1 text-xs italic text-alabaster shadow-md backdrop-blur-md tabular-nums">
          ★ {seller.rating.toFixed(1)}
        </span>

        {/* Quick Peek — instant reveal on hover */}
        <div className="absolute bottom-3.5 right-3.5 z-10 translate-y-2 opacity-0 transition-[opacity,translate] duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:hidden">
          <motion.button
            type="button"
            aria-label={`Quick peek at ${seller.name}`}
            style={{ x: peekX, y: peekY }}
            onClick={(event) => {
              event.stopPropagation();
              openPeekSheet({ name: seller.name, image: seller.image, sellerName: seller.name, sellerBio: seller.description, rating: seller.rating, categoryLabel: seller.tag });
            }}
            onMouseEnter={() => playHoverBlip()}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 450, damping: 18 }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/60 bg-white/55 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink backdrop-blur-md transition-colors duration-300 hover:text-clay-deep shadow-md"
          >
            Quick Peek <span aria-hidden>↗</span>
          </motion.button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3 pt-4 pb-2">
        <h3 className="font-display text-3xl italic leading-tight text-ink">
          {seller.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
          {seller.description}
        </p>

        <div className="hairline mt-5 flex items-center justify-between border-t pt-3.5 text-[11px] font-semibold tracking-[0.18em] uppercase">
          <span className="flex items-center gap-1.5 text-ink tabular-nums">
            <span aria-hidden className="text-clay-deep">★</span>
            {seller.rating.toFixed(1)}
          </span>
          {typeof seller.products === "number" && (
            <span className="text-stone-mute tabular-nums">
              {seller.products} products
            </span>
          )}
        </div>
      </div>
      {/* Dynamic Specular Light Glare */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
        style={{ background: glare }}
      />
    </motion.article>
    </motion.div>
  );
}

export function Sellers() {
  return (
    <section id="sellers" className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-mute">
            Featured Sellers
          </p>
          <h2 className="font-display mt-5 max-w-2xl text-5xl leading-[1.02] text-ink md:text-6xl">
            <SplitReveal text="Curated Boutiques" delay={0.05} />{" "}
            <em className="text-clay italic">
              <SplitReveal text="& Ateliers" delay={0.3} />
            </em>
          </h2>
          <div className="frost-pill mt-6 inline-flex items-center gap-2.5 rounded-full px-4 py-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay-deep opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay-deep" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink tabular-nums">
              2,400 Verified Stores
            </span>
          </div>
        </div>

        <motion.button
          onClick={() => playHapticClick()}
          onMouseEnter={() => playHoverBlip()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={SPRING_MICRO}
          className="group inline-flex cursor-pointer items-center gap-3 text-[12px] font-semibold tracking-[0.2em] uppercase text-ink"
        >
          <span className="border-b-2 border-clay pb-1 transition-colors duration-500 group-hover:border-clay-deep">
            View all
          </span>
          <span
            aria-hidden
            className="text-clay-deep transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
          >
            →
          </span>
        </motion.button>
      </div>

      {SELLERS.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {SELLERS.map((seller, index) => (
            <SellerCard key={seller.id} seller={seller} index={index} />
          ))}
        </motion.div>
      ) : (
        <EmptyState
          title="No sellers available at the moment."
          note="Please try again shortly."
        />
      )}
    </section>
  );
}

