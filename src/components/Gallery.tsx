"use client";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { playHapticClick, playHapticTick, playHoverBlip } from "@/lib/sound";
import { SPRING_MICRO, SPRING_SETTLE, EASE_LUXE } from "@/lib/motion-presets";
import { STUDIES, type Category } from "@/lib/studies";
import { StudyArt } from "./StudyArt";
import { SplitReveal } from "./SplitReveal";

type FilterKey = "All" | Category;
type Study = (typeof STUDIES)[number];

const FILTERS: FilterKey[] = ["All", "Volumetric", "Acoustics", "Light Studies"];

/* ——— Case-study card with cursor-hover depth parallax ————————————— */
function StudyCard({ study, index }: { study: Study; index: number }) {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 180, damping: 22, mass: 0.5 });

  // Three depth planes: card tilt ← art drift ← pill counter-drift.
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const artX = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const artY = useTransform(sy, [-0.5, 0.5], [-12, 12]);
  const pillX = useTransform(sx, [-0.5, 0.5], [24, -24]);

  const handleMove = (event: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.article
      layout
      ref={ref}
      initial={{ opacity: 0, y: 44, scale: 0.95, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{
        opacity: 0,
        scale: 0.95,
        filter: "blur(6px)",
        transition: { duration: 0.25, ease: "easeIn" },
      }}
      transition={{ ...SPRING_SETTLE, delay: index * 0.07 }}
      onMouseMove={handleMove}
      onMouseEnter={() => playHoverBlip()}
      onMouseLeave={handleLeave}
      onClick={() => {
        playHapticClick();
        navigate(`/archive/${study.slug}`);
      }}
      whileHover={{ scale: 1.02 }}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-ink/[0.07] bg-white/45 shadow-[0_32px_80px_-48px_rgba(33,30,25,0.28)] backdrop-blur-sm transition-[border-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-ink/[0.16] hover:shadow-[0_48px_110px_-44px_rgba(33,30,25,0.42)]"
    >
      <div className="relative h-56 overflow-hidden md:h-64">
        <motion.div
          style={{ x: artX, y: artY }}
          className="absolute -inset-8 transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
        >
          <StudyArt slug={study.slug} />
        </motion.div>
        <motion.span
          style={{ x: pillX }}
          className="frost-pill absolute top-5 left-5 z-10 rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.18em] text-ink uppercase"
        >
          {study.category}
        </motion.span>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-6 p-7 md:p-9">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.3em] text-stone-mute uppercase">
            {study.no} · {study.year}
          </p>
          <h3 className="font-display mt-2 text-3xl italic transition-colors duration-500 group-hover:text-clay md:text-4xl">
            {study.title}
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
            {study.blurb}
          </p>
        </div>
        <span
          aria-hidden
          className="text-[11px] font-semibold tracking-[0.24em] text-ink uppercase opacity-60 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:opacity-100 md:opacity-0"
        >
          View study →
        </span>
      </div>
    </motion.article>
  );
}

/* ——— Flip counter: the digit rolls vertically when the count changes —— */
function FlipNumber({ value }: { value: number }) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE_LUXE }}
          className="inline-block tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ——— The Interactive Studies Gallery ————————————————————————————— */
export function Gallery() {
  const [filter, setFilter] = useState<FilterKey>("All");
  const visible =
    filter === "All"
      ? STUDIES
      : STUDIES.filter((study) => study.category === filter);

  const selectFilter = (next: FilterKey) => {
    if (next === filter) return;
    playHapticTick();
    setFilter(next);
  };

  return (
    <section id="studies" className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-mute">
            Studies Archive
          </p>
          <h2 className="font-display mt-5 max-w-2xl text-5xl leading-[1.02] md:text-6xl">
            <SplitReveal text="Filtered by" delay={0.05} />{" "}
            <em className="text-clay italic">
              <SplitReveal text="sense" delay={0.3} />
            </em>
          </h2>
        </div>

        {/* Filter bar with sliding active pill */}
        <div
          role="tablist"
          aria-label="Filter studies"
          className="frost-pill inline-flex items-center gap-1 rounded-full p-1.5"
        >
          {FILTERS.map((key) => {
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
                  active ? "text-alabaster" : "text-ink-soft hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeFilter"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-ink shadow-[0_10px_24px_-10px_rgba(33,30,25,0.55)]"
                  />
                )}
                <span className="relative z-10">{key}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((study, index) => (
            <StudyCard key={study.slug} study={study} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="mt-12 text-center text-[12px] tracking-[0.18em] text-stone-mute uppercase">
        <FlipNumber value={visible.length} /> of {STUDIES.length} studies shown
      </p>
    </section>
  );
}
