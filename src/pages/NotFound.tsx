import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { playHapticClick, playHoverBlip } from "@/lib/sound";
import { Bloom } from "@/components/Bloom";
import { SplitReveal } from "@/components/SplitReveal";

const LUXE = { type: "spring", stiffness: 350, damping: 26, mass: 0.6 } as const;

/** NotFound — a quiet dead-end for unknown routes. */
export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 24, delay: 0.1 }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Bloom size={480} color="#b3a184" className="opacity-[0.12]" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-[11px] font-medium tracking-[0.45em] text-stone-mute uppercase"
      >
        Error — uncharted coordinates
      </motion.p>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="font-display relative z-10 mt-6 max-w-3xl text-6xl leading-[1.02] md:text-8xl"
      >
        <SplitReveal text="This space does not" delay={0.25} />{" "}
        <em className="text-clay italic">
          <SplitReveal text="exist." delay={0.7} />
        </em>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...LUXE, delay: 0.9 }}
        className="relative z-10 mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft"
      >
        The page you were seeking was never drawn — or it has since been grown
        into something else.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...LUXE, delay: 1.05 }}
        className="relative z-10 mt-10"
      >
        <Link
          to="/"
          onClick={() => playHapticClick()}
          onMouseEnter={() => playHoverBlip()}
          className="btn-shine group inline-flex cursor-pointer items-center gap-3 rounded-full bg-ink px-8 py-4 text-[13px] font-semibold tracking-[0.12em] text-alabaster uppercase shadow-[0_16px_40px_-16px_rgba(33,30,25,0.5)] transition-transform duration-500 hover:scale-[1.04]"
        >
          Return home
          <span
            aria-hidden
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
          >
            ←
          </span>
        </Link>
      </motion.div>
    </main>
  );
}
