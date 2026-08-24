import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { playHapticClick, playHoverBlip } from "@/lib/sound";
import { STUDIES } from "@/lib/studies";
import { StudyArt } from "@/components/StudyArt";
import { SplitReveal } from "@/components/SplitReveal";

const LUXE = { type: "spring", stiffness: 350, damping: 26, mass: 0.6 } as const;

export default function Archive() {
  return (
    <main className="mx-auto max-w-7xl px-6 pt-44 pb-28 md:pt-52">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-mute"
      >
        Studies Archive — 2025 → 2027
      </motion.p>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-display mt-6 max-w-4xl text-6xl leading-[1.02] md:text-8xl"
      >
        <SplitReveal text="The complete" delay={0.15} />{" "}
        <em className="text-clay italic">
          <SplitReveal text="index" delay={0.4} />
        </em>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...LUXE, delay: 0.15 }}
        className="mt-8 max-w-xl text-base leading-relaxed text-stone-mute"
      >
        Six studies in generative spatial composition — volumetric, acoustic,
        and luminous. Every one grown, not drawn.
      </motion.p>

      {/* ——— Editorial study rows ——— */}
      <div className="hairline mt-20 border-t">
        {STUDIES.map((study, i) => (
          <motion.div
            key={study.slug}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={LUXE}
          >
            <Link
              to={`/archive/${study.slug}`}
              onClick={() => playHapticClick()}
              onMouseEnter={() => playHoverBlip()}
              className="group hairline grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-4 border-b py-8 transition-all duration-500 hover:bg-white/40 md:grid-cols-[64px_160px_1fr_auto] md:gap-x-10 md:py-10 md:hover:pl-3"
            >
              <span className="pl-2 text-[12px] font-semibold tracking-[0.2em] text-stone-mute transition-colors duration-500 group-hover:text-clay md:pl-4">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="hidden h-24 w-full max-w-40 overflow-hidden rounded-xl border border-ink/[0.06] md:block">
                <div className="h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]">
                  <StudyArt slug={study.slug} />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold tracking-[0.3em] text-clay uppercase">
                  {study.category} · {study.year}
                </p>
                <h2 className="font-display mt-1.5 text-3xl italic transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:text-4xl">
                  {study.title}
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-stone-mute">
                  {study.blurb}
                </p>
              </div>

              <span
                aria-hidden
                className="col-start-2 flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-alabaster md:col-start-auto"
              >
                →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <p className="mt-12 text-center text-[12px] tracking-[0.18em] text-stone-mute uppercase">
        {STUDIES.length} studies · Zürich · Kyoto · Mexico City
      </p>
    </main>
  );
}
