import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { playHapticClick, playHoverBlip } from "@/lib/sound";
import { getStudy, STUDIES } from "@/lib/studies";
import { StudyArt } from "@/components/StudyArt";
import { SplitReveal } from "@/components/SplitReveal";

const LUXE = { type: "spring", stiffness: 350, damping: 26, mass: 0.6 } as const;

export default function StudyDetail() {
  const { slug } = useParams();
  const study = getStudy(slug);

  if (!study) return <Navigate to="/archive" replace />;

  const index = STUDIES.findIndex((s) => s.slug === study.slug);
  const next = STUDIES[(index + 1) % STUDIES.length];

  return (
    <main className="mx-auto max-w-7xl px-6 pt-44 pb-28 md:pt-52">
      {/* ——— Breadcrumb back ——— */}
      <Link
        to="/archive"
        onClick={() => playHapticClick()}
        className="inline-flex cursor-pointer items-center gap-2 text-[12px] font-semibold tracking-[0.2em] text-stone-mute uppercase transition-colors hover:text-ink"
      >
        <span aria-hidden>←</span> Archive
      </Link>

      {/* ——— Title block ——— */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-10 text-[11px] font-medium uppercase tracking-[0.45em] text-clay"
      >
        {study.no} · {study.category}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-display mt-5 max-w-4xl text-6xl leading-[1.02] md:text-8xl"
      >
        <SplitReveal key={study.slug} text={study.title} delay={0.2} stagger={0.07} />
      </motion.h1>

      {/* ——— Hero artwork panel ——— */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...LUXE, delay: 0.2 }}
        className="relative mt-14 h-72 overflow-hidden rounded-[2.5rem] border border-ink/[0.07] shadow-[0_48px_120px_-56px_rgba(33,30,25,0.4)] md:h-[28rem]"
      >
        <div className="absolute -inset-6">
          <StudyArt slug={study.slug} />
        </div>
      </motion.div>

      {/* ——— Meta strip ——— */}
      <div className="hairline mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-y py-8 md:grid-cols-4">
        {[
          ["Year", study.year],
          ["Location", study.location],
          ["Status", study.status],
          ["Area", study.area],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-[10px] font-semibold tracking-[0.3em] text-stone-mute uppercase">
              {label}
            </p>
            <p className="font-display mt-2 text-2xl">{value}</p>
          </div>
        ))}
      </div>

      {/* ——— Narrative + metrics ——— */}
      <div className="mt-16 grid gap-14 md:grid-cols-[1fr_320px]">
        <div>
          {study.narrative.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...LUXE, delay: i * 0.05 }}
              className={`leading-relaxed ${
                i === 0
                  ? "font-display text-2xl italic text-ink md:text-3xl"
                  : "mt-6 max-w-xl text-base text-ink-soft"
              }`}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        <aside className="flex flex-col gap-4">
          {study.metrics.map((metric) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={LUXE}
              className="rounded-3xl border border-ink/[0.07] bg-white/45 p-6 backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-clay/40 hover:shadow-[0_24px_56px_-28px_rgba(179,161,132,0.55)]"
            >
              <p className="font-display text-4xl leading-none">{metric.value}</p>
              <p className="mt-2 text-[11px] font-semibold tracking-[0.22em] text-stone-mute uppercase">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </aside>
      </div>

      {/* ——— Next study ——— */}
      <Link
        to={`/archive/${next.slug}`}
        onClick={() => playHapticClick()}
        onMouseEnter={() => playHoverBlip()}
        className="group hairline mt-24 flex flex-wrap items-center justify-between gap-6 border-t pt-16"
      >
        <div>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-stone-mute uppercase transition-colors duration-500 group-hover:text-clay">
            Next study
          </p>
          <h2 className="font-display mt-3 bg-gradient-to-r from-clay to-clay bg-[length:0%_2px] bg-left-bottom bg-no-repeat text-5xl italic transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 md:text-6xl">
            {next.title}
          </h2>
        </div>
        <span
          aria-hidden
          className="flex h-14 w-14 items-center justify-center rounded-full border border-ink/15 text-xl text-ink transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-45deg] group-hover:border-ink group-hover:bg-ink group-hover:text-alabaster"
        >
          →
        </span>
      </Link>
    </main>
  );
}
