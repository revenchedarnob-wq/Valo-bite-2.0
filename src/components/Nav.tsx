"use client";

import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { playHapticClick, playHapticTick, playHoverBlip } from "@/lib/sound";
import { openCommissionDrawer } from "./CommissionDrawer";
import { Magnetic } from "./Magnetic";
import { MobileMenu } from "./MobileMenu";
import { Bloom } from "./Bloom";

const LUXE = { type: "spring", stiffness: 350, damping: 26, mass: 0.6 } as const;

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Studio", to: "/studio" },
  { label: "Archive", to: "/archive" },
];

export function Nav() {
  const { pathname } = useLocation();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...LUXE, delay: 0.2 }}
      className="fixed inset-x-0 top-5 z-50 flex justify-center px-4"
    >
      <nav className="frost-pill flex w-full max-w-3xl items-center justify-between rounded-full py-2 pl-3 pr-2">
        <Link
          to="/"
          onClick={() => playHapticClick()}
          onMouseEnter={() => playHoverBlip()}
          className="group flex items-center gap-2.5 rounded-full px-2 py-1"
        >
          <span className="inline-block transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[150deg]">
            <Bloom size={22} />
          </span>
          <span className="text-[13px] font-semibold tracking-[0.22em] uppercase transition-all duration-500 group-hover:tracking-[0.3em]">
            Aether&nbsp;Spatial
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const active =
              link.to === "/"
                ? pathname === "/"
                : pathname.startsWith(link.to);
            return (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => playHapticTick()}
                onMouseEnter={() => playHoverBlip()}
                className={`relative rounded-full px-4 py-2 text-[12px] font-medium transition-all duration-400 hover:bg-white/60 ${
                  active ? "text-ink tracking-[0.14em]" : "text-ink-soft hover:text-ink hover:tracking-[0.14em]"
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="navActive"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-x-4 -bottom-0.5 h-px bg-clay"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <Magnetic strength={0.3}>
          <motion.button
            onClick={() => {
              playHapticClick();
              openCommissionDrawer();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 450, damping: 18 }}
            className="btn-shine hidden cursor-pointer rounded-full bg-ink px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-alabaster sm:block"
          >
            Enquire
          </motion.button>
        </Magnetic>

        <div className="md:hidden">
          <MobileMenu />
        </div>
      </nav>
    </motion.header>
  );
}
