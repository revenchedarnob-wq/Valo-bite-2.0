"use client";

import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { playHapticClick, playHapticTick, playHoverBlip } from "@/lib/sound";
import { openPeekSheet } from "./PeekSheet";
import { PRODUCTS, SELLERS, type Product } from "@/lib/data";
import { SPRING_MICRO, SPRING_SETTLE, EASE_LUXE } from "@/lib/motion-presets";
import { EmptyState } from "./EmptyState";
import { SplitReveal } from "./SplitReveal";
import { Bloom } from "./Bloom";
import { LuxuryImage } from "./vault/luxury-image";

type FilterKey = "All" | string;

/* ——— Product card with cursor-hover depth tilt & LuxuryImage —————— */
function ProductCard({ product, index }: { product: Product; index: number }) {
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

  // Jeweler's Loupe — a spring-smoothed 2.5x material zoom lens that
  // tracks the cursor across the photograph (desktop hover only).
  const ZOOM = 2.5;
  const LENS = 96; // w-24 h-24
  const [lensOn, setLensOn] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const lensX = useMotionValue(0);
  const lensY = useMotionValue(0);
  const lensSX = useSpring(lensX, { stiffness: 320, damping: 30, mass: 0.4 });
  const lensSY = useSpring(lensY, { stiffness: 320, damping: 30, mass: 0.4 });
  // Counter-translate the zoomed crop so the point under the cursor
  // stays pinned at the lens centre.
  const zoomImgX = useTransform(
    lensSX,
    (v) => (v + LENS / 2) * (1 - ZOOM),
  );
  const zoomImgY = useTransform(
    lensSY,
    (v) => (v + LENS / 2) * (1 - ZOOM),
  );

  const handleLensEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setDims({ w: rect.width, h: rect.height });
    lensX.set(event.clientX - rect.left - LENS / 2);
    lensY.set(event.clientY - rect.top - LENS / 2);
    setLensOn(true);
  };
  const handleLensMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!lensOn) return;
    const rect = event.currentTarget.getBoundingClientRect();
    lensX.set(event.clientX - rect.left - LENS / 2);
    lensY.set(event.clientY - rect.top - LENS / 2);
  };

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
      exit={{
        opacity: 0,
        scale: 0.95,
        filter: "blur(6px)",
        transition: { duration: 0.25, ease: "easeIn" },
      }}
      transition={{ ...SPRING_SETTLE, delay: index * 0.07 }}
    >
    <motion.article
      layout
      ref={ref}
      tabIndex={0}
      role="button"
      aria-label={`${product.name}, $${product.price}, sold by ${product.seller}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPeekSheet({ name: product.name, image: product.image, price: product.price, sellerName: product.seller, sellerBio: SELLERS.find((s) => s.name === product.seller)?.description, rating: SELLERS.find((s) => s.name === product.seller)?.rating, categoryLabel: product.category });
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
          openPeekSheet({ name: product.name, image: product.image, price: product.price, sellerName: product.seller, sellerBio: SELLERS.find((s) => s.name === product.seller)?.description, rating: SELLERS.find((s) => s.name === product.seller)?.rating, categoryLabel: product.category });
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
      <div
        className="relative h-60 overflow-hidden rounded-[2rem] md:h-72"
        onMouseEnter={handleLensEnter}
        onMouseMove={handleLensMove}
        onMouseLeave={() => setLensOn(false)}
      >
        {product.image ? (
          <LuxuryImage
            asset={product.image}
            alt={product.name}
            className="h-full w-full"
            hoverZoom
          />
        ) : (
          <div className="relative h-full w-full flex items-center justify-center bg-stone-100">
            <Bloom size={140} className="opacity-30" />
          </div>
        )}
        {/* Jeweler's Loupe — 2.5x zoom lens following the cursor */}
        {product.image && (
          <motion.div
            aria-hidden
            initial={false}
            animate={{ opacity: lensOn ? 1 : 0, scale: lensOn ? 1 : 0.6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ x: lensSX, y: lensSY, width: LENS, height: LENS }}
            className="pointer-events-none absolute left-0 top-0 z-20 overflow-hidden rounded-full border-2 border-white/80 shadow-2xl"
          >
            {dims.w > 0 && (
              <motion.img
                src={typeof product.image === "string" ? product.image : product.image.url}
                alt=""
                draggable={false}
                className="absolute left-0 top-0 max-w-none select-none"
                style={{
                  width: dims.w * ZOOM,
                  height: dims.h * ZOOM,
                  x: zoomImgX,
                  y: zoomImgY,
                }}
              />
            )}
          </motion.div>
        )}
        <span className="frost-pill absolute top-4 left-4 z-10 rounded-full px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-ink uppercase shadow-sm">
          {product.category}
        </span>
        {/* Floating price pill */}
        <span className="font-display absolute bottom-3.5 left-3.5 z-10 rounded-full bg-ink/90 px-3.5 py-1 text-xs italic text-alabaster shadow-md backdrop-blur-md tabular-nums">
          ${product.price.toLocaleString("en-US")}
        </span>

        {/* Quick Peek — instant reveal on hover */}
        <div className="absolute bottom-3.5 right-3.5 z-10 translate-y-2 opacity-0 transition-[opacity,translate] duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:hidden">
          <motion.button
            type="button"
            aria-label={`Quick peek at ${product.name}`}
            style={{ x: peekX, y: peekY }}
            onClick={(event) => {
              event.stopPropagation();
              openPeekSheet({ name: product.name, image: product.image, price: product.price, sellerName: product.seller, sellerBio: SELLERS.find((s) => s.name === product.seller)?.description, rating: SELLERS.find((s) => s.name === product.seller)?.rating, categoryLabel: product.category });
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
          {product.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-mute">
          Sold by {product.seller}
        </p>
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

export function Products({
  filter: controlledFilter,
  onFilterChange,
}: {
  filter?: FilterKey;
  onFilterChange?: (next: FilterKey) => void;
} = {}) {
  const [internalFilter, setInternalFilter] = useState<FilterKey>("All");
  const filter = controlledFilter ?? internalFilter;

  const categories = useMemo(
    () => [...new Set(PRODUCTS.map((product) => product.category))],
    [],
  );
  const filters: FilterKey[] = ["All", ...categories];
  const visible =
    filter === "All"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === filter);

  const selectFilter = (next: FilterKey) => {
    if (next === filter) return;
    playHapticTick();
    if (onFilterChange) {
      onFilterChange(next);
    } else {
      setInternalFilter(next);
    }
  };

  return (
    <section id="products" className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-mute">
            Latest Products
          </p>
          <h2 className="font-display mt-5 max-w-2xl text-5xl leading-[1.02] text-ink md:text-6xl">
            <SplitReveal text="The Permanent" delay={0.05} />{" "}
            <em className="text-clay italic">
              <SplitReveal text="Collection" delay={0.3} />
            </em>
          </h2>
          <div className="frost-pill mt-6 inline-flex items-center gap-2.5 rounded-full px-4 py-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay-deep opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay-deep" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink tabular-nums" aria-live="polite">
              Showing {visible.length} of {PRODUCTS.length} Pieces
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

      {/* Filter bar */}
      {categories.length > 0 && (
        <div
          role="tablist"
          aria-label="Filter products"
          className="frost-pill mb-10 inline-flex items-center gap-1 rounded-full border border-ink/[0.08] bg-white/50 p-1.5 backdrop-blur-lg"
        >
          {filters.map((key) => {
            const active = key === filter;
            return (
              <motion.button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={() => selectFilter(key)}
                onMouseEnter={() => playHoverBlip()}
                whileHover={{ scale: active ? 1 : 1.07 }}
                whileTap={{ scale: 0.93 }}
                transition={SPRING_MICRO}
                className={`relative cursor-pointer rounded-full px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-300 md:px-5 ${
                  active
                    ? "text-alabaster"
                    : "text-ink-soft hover:bg-ink/[0.06] hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="productFilter"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-ink shadow-[0_10px_24px_-10px_rgba(33,30,25,0.55)] ring-1 ring-inset ring-clay/60"
                  />
                )}
                <span className="relative z-10">{key}</span>
              </motion.button>
            );
          })}
        </div>
      )}

      {PRODUCTS.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div layout transition={{ duration: 0.45, ease: EASE_LUXE }}>
          <EmptyState
            title="No products available right now."
            note="Please try again shortly."
          />
        </motion.div>
      )}
    </section>
  );
}
