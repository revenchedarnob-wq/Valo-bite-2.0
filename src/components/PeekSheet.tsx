"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  playHapticChime,
  playHapticClick,
  playHapticSwoosh,
  playHapticThud,
} from "@/lib/sound";
import type { CloudAsset } from "@/lib/media";
import { LuxuryImage } from "./vault/luxury-image";
import { openSellerDrawer } from "./CommissionDrawer";

const PEEK_EVENT = "valobite:peek";

export type PeekItem = {
  name: string;
  image?: CloudAsset;
  price?: number;
  sellerName: string;
  sellerBio?: string;
  rating?: number;
  categoryLabel: string;
};

/** Open the quick-peek sheet from anywhere without prop drilling. */
export function openPeekSheet(item: PeekItem): void {
  window.dispatchEvent(new CustomEvent(PEEK_EVENT, { detail: item }));
}

/**
 * PeekSheet — the interactive quick-peek floating modal.
 * Opens as a centered visionOS glass card from any Quick Peek action:
 * high-res photo, price pill, seller story, and a direct line to the
 * atelier. Sound choreography: swoosh in, chime arrival, thud on settle.
 */
export function PeekSheet() {
  const [item, setItem] = useState<PeekItem | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = (event: Event) => {
      playHapticSwoosh();
      window.setTimeout(() => playHapticChime(), 180);
      setItem((event as CustomEvent<PeekItem>).detail);
      setOpen(true);
    };
    window.addEventListener(PEEK_EVENT, handleOpen);
    return () => window.removeEventListener(PEEK_EVENT, handleOpen);
  }, []);

  const closeSheet = () => {
    playHapticSwoosh();
    window.setTimeout(() => playHapticThud(), 240);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSheet();
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

  const inquire = () => {
    playHapticClick();
    openSellerDrawer();
    closeSheet();
  };

  return (
    <AnimatePresence>
      {open && item && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Dark Blurred Backdrop */}
          <motion.div
            key="peek-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeSheet}
            className="fixed inset-0 bg-black/45 backdrop-blur-xl"
            aria-hidden
          />

          {/* Centered Floating VisionOS Glass Card */}
          <motion.div
            key="peek-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={`Quick peek — ${item.name}`}
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-white/85 bg-white/70 p-4 pb-6 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.9)] backdrop-blur-3xl md:max-w-md md:p-5 md:pb-7"
          >
            {/* Floating Glass Close Button */}
            <button
              type="button"
              onClick={closeSheet}
              aria-label="Close quick peek"
              className="absolute top-6 right-6 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/80 bg-white/75 text-ink shadow-md backdrop-blur-md transition-transform hover:scale-110 active:scale-90"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            {/* Photo with Dark Price Pill */}
            {item.image && (
              <div className="relative overflow-hidden rounded-[2rem]">
                <LuxuryImage
                  asset={item.image}
                  alt={item.name}
                  className="aspect-[4/3] w-full"
                  hoverZoom={false}
                />
                {item.price !== undefined && (
                  <span className="font-display absolute bottom-3.5 left-3.5 z-10 rounded-full bg-ink/90 px-4 py-1.5 text-sm italic text-alabaster shadow-md backdrop-blur-md tabular-nums">
                    ${item.price.toLocaleString("en-US")}
                  </span>
                )}
              </div>
            )}

            {/* Typography & Story */}
            <div className="px-3 pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-mute">
                {item.categoryLabel}
              </p>
              <h3 className="font-display mt-1 text-3xl italic leading-tight text-ink-strong">
                {item.name}
              </h3>
              {item.sellerBio && (
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                  {item.sellerBio}
                </p>
              )}
              {(item.sellerName || item.rating !== undefined) && (
                <p className="mt-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-mute tabular-nums">
                  {item.sellerName}
                  {item.rating !== undefined && ` · ${item.rating.toFixed(1)} ★`}
                </p>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={inquire}
                className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-alabaster shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Inquire with Atelier →
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}