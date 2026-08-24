import { motion } from "motion/react";
import { playHapticFlick } from "@/lib/sound";
import { openCommissionDrawer } from "@/components/CommissionDrawer";
import { Magnetic } from "@/components/Magnetic";
import { SplitReveal } from "@/components/SplitReveal";
import { Bloom } from "@/components/Bloom";

const LUXE = { type: "spring", stiffness: 350, damping: 26, mass: 0.6 } as const;

const PRINCIPLES = [
  {
    no: "01",
    title: "Grow, don't draw",
    body: "Every form begins as a set of constraints and a seed of data. The drawing is the last thing to exist — and the first thing to feel inevitable.",
  },
  {
    no: "02",
    title: "Silence is material",
    body: "We treat acoustics with the same rigor as structure. A room's quiet is measured, tuned, and signed like any load-bearing element.",
  },
  {
    no: "03",
    title: "Light is a program",
    body: "Daylight schedules are simulated hour by hour before a single wall is placed. The sun is our most demanding client.",
  },
  {
    no: "04",
    title: "Quiet luxury, loud numbers",
    body: "Restraint is not the absence of decisions — it is thousands of them, resolved invisibly. We publish the numbers behind every calm surface.",
  },
];

const PROCESS = [
  {
    phase: "Listen",
    detail:
      "Site, climate, noise maps, light data. Weeks of measurement before a single gesture.",
  },
  {
    phase: "Grow",
    detail:
      "Generative studies iterate against the data until a family of forms survives every constraint.",
  },
  {
    phase: "Tune",
    detail:
      "The surviving form is refined by simulation — acoustic, luminous, thermal — then by ear and eye in place.",
  },
];

export default function Studio() {
  return (
    <main className="mx-auto max-w-7xl px-6 pt-44 pb-28 md:pt-52">
      {/* ——— Page hero ——— */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-mute"
      >
        The Studio
      </motion.p>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-display mt-6 max-w-4xl text-6xl leading-[1.02] md:text-8xl"
      >
        <SplitReveal text="A quiet studio for" delay={0.15} />{" "}
        <em className="text-clay italic">
          <SplitReveal text="computational space." delay={0.45} />
        </em>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...LUXE, delay: 0.15 }}
        className="mt-8 max-w-xl text-base leading-relaxed text-ink-soft"
      >
        Aether Spatial is twelve architects, engineers, and composers of code
        working between Zürich, Kyoto, and Mexico City. We design buildings
        that are grown from data rather than drawn from habit — spaces where
        acoustics, daylight, and structure are solved together, quietly.
      </motion.p>

      {/* ——— Principles ——— */}
      <div className="mt-28 grid grid-cols-1 gap-6 md:grid-cols-2">
        {PRINCIPLES.map((principle, i) => (
          <motion.article
            key={principle.no}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ...LUXE, delay: i * 0.08 }}
            whileHover={{ scale: 1.015 }}
            className="rounded-[2rem] border border-ink/[0.07] bg-white/45 p-8 shadow-[0_32px_80px_-48px_rgba(33,30,25,0.25)] backdrop-blur-sm md:p-10"
          >
            <p className="text-[11px] font-semibold tracking-[0.3em] text-clay">
              {principle.no}
            </p>
            <h2 className="font-display mt-3 text-3xl italic md:text-4xl">
              {principle.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              {principle.body}
            </p>
          </motion.article>
        ))}
      </div>

      {/* ——— Process ——— */}
      <div className="hairline mt-28 border-t pt-20">
        <h2 className="font-display text-5xl leading-tight md:text-6xl">
          Three movements of <em className="text-clay italic">practice</em>
        </h2>
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
          {PROCESS.map((step, i) => (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ...LUXE, delay: i * 0.12 }}
            >
              <Bloom size={34} />
              <p className="mt-5 text-[11px] font-semibold tracking-[0.3em] text-stone-mute uppercase">
                Movement {i + 1} · {step.phase}
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
                {step.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ——— CTA ——— */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={LUXE}
        className="mt-28 flex flex-wrap items-center justify-between gap-6 rounded-[2rem] border border-ink/[0.07] bg-white/45 p-10 backdrop-blur-sm md:p-14"
      >
        <h3 className="font-display max-w-md text-4xl leading-tight md:text-5xl">
          Work with a studio that <em className="text-clay italic">listens</em>.
        </h3>
        <Magnetic strength={0.25}>
          <button
            onClick={() => {
              playHapticFlick();
              openCommissionDrawer();
            }}
            className="btn-shine group inline-flex cursor-pointer items-center gap-3 rounded-full bg-ink px-8 py-4 text-[13px] font-semibold tracking-[0.12em] text-alabaster uppercase shadow-[0_16px_40px_-16px_rgba(33,30,25,0.5)] transition-transform duration-500 hover:scale-[1.04]"
          >
            Begin a commission
            <span
              aria-hidden
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        </Magnetic>
      </motion.div>
    </main>
  );
}
