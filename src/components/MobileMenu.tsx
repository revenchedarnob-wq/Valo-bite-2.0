"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { playHapticClick, playHapticSwoosh, playHapticThud, playHoverBlip } from "@/lib/sound";
import { scrollToSelector } from "@/lib/scroll";
import { openSellerDrawer } from "./CommissionDrawer";
import { Bloom } from "./Bloom";
import { EASE_LUXE } from "@/lib/motion-presets";

const LINKS = [
  { label: "Discover", anchor: "#top" },
  { label: "Sellers", anchor: "#sellers" },
  { label: "Trending", anchor: "#products" },
];

/**
 * MobileMenu — a full-screen frosted overlay for small viewports,
 * where the inline nav links are hidden. Big serif links stagger in;
 * Escape or a selection closes it.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Close on any route change (link taps inside the menu navigate).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape to close + body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") toggle();
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

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        playHapticSwoosh();
      } else {
        playHapticThud();
      }
      return next;
    });
  };

  return (
    <>
      {/* Hamburger — visible only where the pill links are hidden */}
      <motion.button
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 450, damping: 18 }}
        className="relative z-[110] flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full md:hidden"
      >
        <motion.span
          animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_LUXE }}
          className="block h-px w-5 bg-ink"
        />
        <motion.span
          animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_LUXE }}
          className="block h-px w-5 bg-ink"
        />
      </motion.button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-[105] flex flex-col overflow-y-auto bg-alabaster px-8 pt-28 pb-10 md:hidden"
              style={{
                backgroundImage:
                  "radial-gradient(120% 90% at 85% -10%, rgba(179,161,132,0.14), transparent 55%), radial-gradient(100% 80% at 0% 110%, rgba(179,161,132,0.1), transparent 50%)",
              }}
            >
              {/* Opaque canvas — deliberately no backdrop-filter, so the page
                  beneath can never bleed through regardless of GPU support. */}
              <div aria-hidden className="pointer-events-none absolute inset-0 grain" />
              {/* In-overlay close affordance — the overlay portals above the
                  fixed header, so it carries its own ✕. */}
              <motion.button
                onClick={toggle}
                aria-label="Close menu"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.4, ease: EASE_LUXE }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-7 right-5 flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full border border-ink/10 bg-white/60"
              >
                <span className="block h-px w-5 rotate-45 bg-ink" />
                <span className="block h-px w-5 -rotate-45 bg-ink" />
              </motion.button>
              <nav aria-label="Mobile" className="relative flex flex-col gap-2">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ ...EASE_LUXE, delay: 0.08 + i * 0.07 }}
                >
                  <Link
                    to="/"
                    onClick={(e) => {
                      e.preventDefault();
                      playHapticClick();
                      toggle();
                      navigate("/");
                      window.setTimeout(
                        () => scrollToSelector(link.anchor),
                        340,
                      );
                    }}
                    onMouseEnter={() => playHoverBlip()}
                    className="font-display flex items-baseline gap-4 border-b border-ink/[0.07] py-5 text-5xl text-ink"
                  >
                    <span className="text-[11px] font-sans font-semibold tracking-[0.3em] text-stone-mute">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ ...EASE_LUXE, delay: 0.32 }}
                className="relative mt-auto flex flex-col gap-6"
              >
                <button
                  onClick={() => {
                    playHapticClick();
                    toggle();
                    window.setTimeout(() => openSellerDrawer(), 320);
                  }}
                  onMouseEnter={() => playHoverBlip()}
                  className="btn-shine cursor-pointer rounded-full bg-ink px-8 py-4 text-[12px] font-semibold tracking-[0.18em] text-alabaster uppercase"
                >
                  Start Selling Today
                </button>
                <div className="flex items-center gap-5">
                  {[
                    { label: "Instagram", href: "https://instagram.com" },
                    { label: "X", href: "https://x.com" },
                    { label: "Facebook", href: "https://facebook.com" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => playHapticClick()}
                      onMouseEnter={() => playHoverBlip()}
                      className="text-[10px] font-semibold tracking-[0.22em] text-stone-mute uppercase transition-colors duration-300 hover:text-ink"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
                <p className="flex items-center gap-3 text-[11px] tracking-[0.24em] text-stone-mute uppercase">
                  <Bloom size={14} color="#b3a184" />
                  The multi-seller marketplace
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
