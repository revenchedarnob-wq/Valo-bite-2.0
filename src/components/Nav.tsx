"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { playHapticClick, playHoverBlip } from "@/lib/sound";
import { scrollToSelector } from "@/lib/scroll";
import { Magnetic } from "./Magnetic";
import { MobileMenu } from "./MobileMenu";
import { Bloom } from "./Bloom";

const LUXE = { type: "spring", stiffness: 350, damping: 26, mass: 0.6 } as const;

const LINKS = [
  { label: "Discover", anchor: "#top" },
  { label: "Sellers", anchor: "#sellers" },
  { label: "Trending", anchor: "#products" },
];

export function Nav() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const goTo = (anchor: string) => {
    playHapticClick();
    navigate("/");
    window.setTimeout(() => scrollToSelector(anchor), 140);
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    playHapticClick();
    scrollToSelector("#sellers");
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...LUXE, delay: 0.2 }}
      className="fixed inset-x-0 top-5 z-50 flex justify-center px-4"
    >
      <nav className="frost-pill flex w-full max-w-4xl items-center justify-between gap-2 rounded-full py-2 pl-3 pr-2">
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
            Valobite
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to="/"
              onClick={(e) => {
                e.preventDefault();
                goTo(link.anchor);
              }}
              onMouseEnter={() => playHoverBlip()}
              className="relative rounded-full px-4 py-2 text-[12px] font-medium tracking-[0.14em] text-ink-soft transition-all duration-400 hover:bg-white/60 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Seller search */}
        <form
          onSubmit={submitSearch}
          role="search"
          className="frost-pill hidden items-center gap-2 rounded-full bg-white/40 py-1.5 pr-1.5 pl-4 sm:flex"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
            <circle cx="6" cy="6" r="4.2" stroke="currentColor" />
            <path d="m9.4 9.4 3 3" stroke="currentColor" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a seller..."
            aria-label="Find a seller"
            className="w-28 bg-transparent text-[12px] text-ink outline-none transition-all duration-500 placeholder:text-stone-mute focus:w-40"
          />
        </form>

        {/* Profile */}
        <Magnetic strength={0.3}>
          <motion.button
            onClick={() => playHapticClick()}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 450, damping: 18 }}
            aria-label="Your profile"
            className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ink/10 text-ink transition-colors duration-300 hover:border-ink/30 sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="8" cy="5.2" r="2.6" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M2.8 13.6c.8-2.9 2.8-4.3 5.2-4.3s4.4 1.4 5.2 4.3"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
        </Magnetic>

        <div className="md:hidden">
          <MobileMenu />
        </div>
      </nav>
    </motion.header>
  );
}
