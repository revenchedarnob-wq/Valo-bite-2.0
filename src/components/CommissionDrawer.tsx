"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  playHapticChime,
  playHapticClick,
  playHapticSuccess,
  playHapticSwoosh,
  playHapticThud,
  playHoverBlip,
} from "@/lib/sound";
import { SPRING_MICRO, SPRING_MODAL } from "@/lib/motion-presets";
import { Bloom } from "./Bloom";

const COMMISSION_EVENT = "aether:commission";

/** Open the drawer from anywhere on the site without prop drilling. */
export function openCommissionDrawer(): void {
  window.dispatchEvent(new CustomEvent(COMMISSION_EVENT));
}

export function CommissionDrawer() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      playHapticSwoosh();
      // A glassy chime rings over the swoosh — the drawer has "arrived".
      window.setTimeout(() => playHapticChime(), 180);
      setSent(false);
      setOpen(true);
    };
    window.addEventListener(COMMISSION_EVENT, handleOpen);
    return () => window.removeEventListener(COMMISSION_EVENT, handleOpen);
  }, []);

  // Swoosh accompanies both directions of the slide-over; the close
  // lands with a low warm thud for a sense of settlement.
  const closeDrawer = () => {
    playHapticSwoosh();
    window.setTimeout(() => playHapticThud(), 240);
    setOpen(false);
  };

  // Escape to close + body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submitInquiry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    playHapticSuccess();
    setSent(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[100] bg-ink/30 backdrop-blur-md"
            aria-hidden
          />

          {/* Centered commission modal */}
          <div
            key="modal-root"
            className="pointer-events-none fixed inset-0 z-[101] flex items-end justify-center p-3 sm:items-center sm:p-6"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Begin a commission"
              initial={{ scale: 0.92, y: 30, opacity: 0, filter: "blur(8px)" }}
              animate={{ scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.94, y: 24, opacity: 0, filter: "blur(8px)" }}
              transition={SPRING_MODAL}
              className="frost-pill pointer-events-auto relative max-h-[92svh] w-full max-w-xl overflow-y-auto overflow-x-hidden rounded-[2rem] bg-white/80 p-7 md:p-10"
            >
              <Bloom
                size={220}
                className="pointer-events-none absolute -top-14 -right-14 opacity-[0.08]"
              />

              <motion.button
                onClick={closeDrawer}
                aria-label="Close commission drawer"
                whileHover={{ scale: 1.12, rotate: 90 }}
                whileTap={{ scale: 0.88 }}
                transition={SPRING_MICRO}
                onMouseEnter={() => playHoverBlip()}
                className="absolute top-5 right-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink/40"
              >
                ✕
              </motion.button>

              {sent ? (
                /* ——— Confirmation state ——— */
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="flex min-h-72 flex-col items-center justify-center text-center"
                >
                  <Bloom size={64} />
                  <h3 className="font-display mt-6 text-4xl italic">
                    Received, quietly.
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
                    Your inquiry is now drifting through the studio queue. We
                    answer every commission within two working days.
                  </p>
                  <motion.button
                    onClick={closeDrawer}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    className="mt-8 cursor-pointer rounded-full bg-ink px-7 py-3 text-[12px] font-semibold tracking-[0.18em] text-alabaster uppercase"
                  >
                    Return to the site
                  </motion.button>
                </motion.div>
              ) : (
                <InquiryForm onClose={closeDrawer} onSubmit={submitInquiry} />
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ——— Underline field with clay expander on focus ————————————————— */
function UnderlineField({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative">
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-clay transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:scale-x-100"
      />
    </div>
  );
}

function InquiryForm({
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-stone-mute">
        Commissions — 2026
      </p>
      <h3 className="font-display mt-3 text-4xl leading-tight md:text-5xl">
        Begin a <em className="text-clay italic">commission</em>
      </h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-mute">
        Tell us about the space you imagine. Site, scale, and silence are
        enough to start.
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <UnderlineField>
            <input
              required
              type="text"
              name="name"
              placeholder="Your name"
              autoComplete="name"
              className="w-full border-b border-ink/15 bg-transparent px-0 py-3 text-sm text-ink placeholder:text-stone-mute focus:outline-none"
            />
          </UnderlineField>
          <UnderlineField>
            <input
              required
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="email"
              className="w-full border-b border-ink/15 bg-transparent px-0 py-3 text-sm text-ink placeholder:text-stone-mute focus:outline-none"
            />
          </UnderlineField>
        </div>
        <UnderlineField>
          <textarea
            required
            name="vision"
            rows={4}
            placeholder="Describe the space you imagine…"
            className="w-full resize-none border-b border-ink/15 bg-transparent px-0 py-3 text-sm text-ink placeholder:text-stone-mute focus:outline-none"
          />
        </UnderlineField>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <span className="text-[11px] tracking-[0.18em] text-stone-mute uppercase">
            Zürich · Kyoto · Mexico City
          </span>
          <motion.button
            type="submit"
            onClick={() => playHapticClick()}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="btn-shine inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-7 py-3 text-[12px] font-semibold tracking-[0.16em] text-alabaster uppercase shadow-[0_16px_40px_-16px_rgba(33,30,25,0.5)]"
          >
            Send inquiry
            <span aria-hidden>→</span>
          </motion.button>
        </div>
      </form>
    </>
  );
}
