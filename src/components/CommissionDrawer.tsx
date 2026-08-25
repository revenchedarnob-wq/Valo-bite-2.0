"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  playHapticChime,
  playHapticClick,
  playHapticSuccess,
  playHapticSwoosh,
  playHapticThud,
} from "@/lib/sound";
import { SPRING_MODAL } from "@/lib/motion-presets";
import { Bloom } from "./Bloom";

const SELLER_EVENT = "valobite:seller";

/** Open the seller-application drawer from anywhere without prop drilling. */
export function openSellerDrawer(): void {
  window.dispatchEvent(new CustomEvent(SELLER_EVENT));
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
    window.addEventListener(SELLER_EVENT, handleOpen);
    return () => window.removeEventListener(SELLER_EVENT, handleOpen);
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
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/45 backdrop-blur-xl"
            aria-hidden
          />

          {/* Centered Floating VisionOS Glass Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Open your shop"
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 24, opacity: 0 }}
            transition={SPRING_MODAL}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/85 bg-white/70 p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.95)] backdrop-blur-3xl md:p-11"
          >
            <Bloom
              size={240}
              className="pointer-events-none absolute -top-12 -right-12 opacity-[0.06] text-clay"
            />

            {/* Floating Glass Close Button */}
            <button
              onClick={closeDrawer}
              aria-label="Close seller drawer"
              className="absolute top-6 right-6 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/80 bg-white/75 text-ink shadow-md backdrop-blur-md transition-transform hover:scale-110 active:scale-90"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            {sent ? (
              /* ——— Confirmation state ——— */
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="flex min-h-72 flex-col items-center justify-center text-center"
              >
                <Bloom size={64} className="text-clay" />
                <h3 className="font-display mt-6 text-4xl italic text-ink-strong">
                  Application received.
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
                  Your shop is now in the review queue. We answer every
                  seller application within two working days.
                </p>
                <motion.button
                  onClick={closeDrawer}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  className="mt-8 cursor-pointer rounded-full bg-ink px-8 py-3.5 text-[12px] font-semibold tracking-[0.18em] text-alabaster uppercase shadow-lg"
                >
                  Back to browsing
                </motion.button>
              </motion.div>
            ) : (
              <InquiryForm onClose={closeDrawer} onSubmit={submitInquiry} />
            )}
          </motion.div>
        </div>
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
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-mute">
        <span className="h-1.5 w-1.5 rounded-full bg-clay-deep" />
        <span>Sellers — 2026</span>
      </div>
      <h3 className="font-display mt-3 text-4xl leading-tight text-ink-strong md:text-5xl">
        Open your <em className="text-clay italic font-normal">shop</em>
      </h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
        Tell us about your brand. What you make, where you ship — that's
        enough to start.
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <UnderlineField>
            <input
              required
              type="text"
              name="name"
              placeholder="Brand name"
              autoComplete="name"
              className="w-full border-b border-ink/15 bg-transparent px-0 py-3 text-sm text-ink placeholder:text-stone-mute/80 focus:outline-none"
            />
          </UnderlineField>
          <UnderlineField>
            <input
              required
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="email"
              className="w-full border-b border-ink/15 bg-transparent px-0 py-3 text-sm text-ink placeholder:text-stone-mute/80 focus:outline-none"
            />
          </UnderlineField>
        </div>
        <UnderlineField>
          <textarea
            required
            name="vision"
            rows={3}
            placeholder="What do you sell?"
            className="w-full resize-none border-b border-ink/15 bg-transparent px-0 py-3 text-sm text-ink placeholder:text-stone-mute/80 focus:outline-none"
          />
        </UnderlineField>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <span className="text-[10px] font-semibold tracking-[0.25em] text-stone-mute uppercase">
            Valobite — Worldwide
          </span>
          <motion.button
            type="submit"
            onClick={() => playHapticClick()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="btn-shine inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-[11px] font-semibold tracking-[0.18em] text-alabaster uppercase shadow-[0_16px_40px_-16px_rgba(33,30,25,0.5)]"
          >
            Apply to sell
            <span aria-hidden>→</span>
          </motion.button>
        </div>
      </form>
    </>
  );
}
