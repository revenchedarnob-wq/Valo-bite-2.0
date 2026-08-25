"use client";

import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  playHapticClick,
  playHapticFlick,
  playHapticThud,
  playHoverBlip,
} from "@/lib/sound";
import { scrollTopSmooth, scrollToSelector } from "@/lib/scroll";
import { Bloom } from "./Bloom";

const LUXE = { type: "spring", stiffness: 350, damping: 26, mass: 0.6 } as const;

/* ——— Back to top — the dock's flick-and-settle, footer edition ———— */
function BackToTop() {
  const backToTop = () => {
    playHapticFlick();
    scrollTopSmooth();
    // A soft landing thud once the glide reaches the top.
    window.setTimeout(() => playHapticThud(), 1450);
  };

  return (
    <button
      type="button"
      onClick={backToTop}
      onMouseEnter={() => playHoverBlip()}
      className="group inline-flex cursor-pointer items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-ink uppercase"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:border-ink/40">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M7 12V2M7 2L2.5 6.5M7 2l4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      Back to Top
    </button>
  );
}

/* ——— Social glyph buttons ————————————————————————————————————— */
const SOCIALS: Array<{
  label: string;
  href: string;
  glyph: React.JSX.Element;
}> = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    glyph: (
      <>
        <rect x="1.8" y="1.8" width="12.4" height="12.4" rx="4" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="12" cy="4" r="0.9" fill="currentColor" />
      </>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    glyph: (
      <path
        d="M2.5 2.5l11 11m0-11l-11 11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    glyph: (
      <path
        d="M9.8 14V8.6h1.9l.3-2.3H9.8V4.8c0-.7.2-1.2 1.2-1.2h1.1V1.5s-.9-.1-1.8-.1c-1.9 0-3.1 1.1-3.1 3.1v1.8H5.2v2.3h2V14"
        fill="currentColor"
      />
    ),
  },
];

/* ——— Payment method marks ————————————————————————————————————— */
/* Brand-colored logo marks rendered inline so no external assets are
   needed. Each sits in a white chip for legibility on cream. */
const PAYMENT_MARKS: Array<{ label: string; mark: React.JSX.Element }> = [
  {
    label: "Visa",
    mark: (
      <span
        className="text-[15px] leading-none font-extrabold italic tracking-tight"
        style={{ color: "#1A1F71", fontFamily: "Arial, sans-serif" }}
      >
        VISA
      </span>
    ),
  },
  {
    label: "Mastercard",
    mark: (
      <svg width="34" height="21" viewBox="0 0 34 21" aria-hidden>
        <circle cx="13" cy="10.5" r="9" fill="#EB001B" />
        <circle cx="21" cy="10.5" r="9" fill="#F79E1B" fillOpacity="0.92" />
        <path
          d="M17 3.4a9 9 0 0 1 0 14.2 9 9 0 0 1 0-14.2Z"
          fill="#FF5F00"
        />
      </svg>
    ),
  },
  {
    label: "American Express",
    mark: (
      <svg width="34" height="21" viewBox="0 0 34 21" aria-hidden>
        <rect width="34" height="21" rx="3" fill="#2E77BC" />
        <text
          x="17"
          y="13.8"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Arial, sans-serif"
          fontSize="8"
          fontWeight="800"
          letterSpacing="0.5"
        >
          AMEX
        </text>
      </svg>
    ),
  },
  {
    label: "PayPal",
    mark: (
      <span
        className="text-[13px] leading-none font-extrabold italic tracking-tight"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <span style={{ color: "#003087" }}>Pay</span>
        <span style={{ color: "#009CDE" }}>Pal</span>
      </span>
    ),
  },
  {
    label: "Apple Pay",
    mark: (
      <span className="inline-flex items-center gap-1">
        <svg width="13" height="16" viewBox="0 0 20 24" aria-hidden>
          <path
            d="M12.7 2.9c.6-.8 1.1-1.9.9-3-.9.1-2 .7-2.7 1.5-.6.7-1.1 1.8-.9 2.9 1 0 2-.6 2.7-1.4ZM16.4 12.2c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.1-2.8.8-3.5.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.6-3.4Z"
            fill="#000"
          />
        </svg>
        <span className="text-[13px] leading-none font-bold text-black">
          Pay
        </span>
      </span>
    ),
  },
];

const LINK_GROUPS: Array<{
  title: string;
  links: Array<{ label: string; anchor?: string }>;
}> = [
  {
    title: "Site Map",
    links: [
      { label: "Discover", anchor: "#top" },
      { label: "Sellers", anchor: "#sellers" },
      { label: "Trending", anchor: "#products" },
      { label: "Profile" },
      { label: "Contact Us", anchor: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy" },
      { label: "Terms of Service" },
      { label: "Refund Policy" },
      { label: "Shipping Information" },
    ],
  },
];

type FooterLinkProps = {
  label: string;
  anchor?: string;
};

function FooterLink({ label, anchor }: FooterLinkProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ x: 4 }}
      onMouseEnter={() => playHoverBlip()}
      transition={LUXE}
      className="group inline-block"
    >
      <Link
        to="/"
        onClick={(e) => {
          playHapticClick();
          if (anchor) {
            e.preventDefault();
            navigate("/");
            window.setTimeout(() => scrollToSelector(anchor), 140);
          }
        }}
        className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-soft transition-colors duration-300 hover:text-ink"
      >
        <span
          aria-hidden
          className="h-1 w-1 -translate-x-1 rounded-full bg-clay opacity-0 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100"
        />
        {label}
      </Link>
    </motion.div>
  );
}

export function Footer() {
  const footRef = useRef<HTMLElement>(null);

  return (
    <footer
      ref={footRef}
      id="contact"
      className="hairline relative overflow-hidden border-t px-6 pt-20 pb-8 md:pt-28"
    >
      {/* oversized ambient bloom */}
      <Bloom
        size={560}
        color="#b3a184"
        className="pointer-events-none absolute -right-40 -bottom-40 opacity-[0.12]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* ——— Escrow & support callout ——— */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...LUXE }}
          className="frost-pill relative flex flex-col gap-4 rounded-[2rem] p-6 shadow-[0_28px_70px_-36px_rgba(33,30,25,0.32)] sm:flex-row sm:items-center md:p-8"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-clay-deep/30 bg-white/50 text-clay-deep">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M10 2.5 16 5v5c0 4-2.7 6.6-6 7.5C6.7 16.6 4 14 4 10V5l6-2.5Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="m7.6 9.8 1.7 1.7 3.1-3.2"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="text-sm leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">
              Escrow &amp; Support
            </span>{" "}
            — For any payment issues, contact the{" "}
            <a
              href="https://aelvyra.example"
              target="_blank"
              rel="noreferrer"
              onClick={() => playHapticClick()}
              onMouseEnter={() => playHoverBlip()}
              className="text-ink underline decoration-clay/60 underline-offset-4 transition-colors duration-300 hover:decoration-clay"
            >
              Aelvyra Transaction Hub
            </a>
            . Payments are controlled securely by Aelvyra Transaction Hub.
          </p>
        </motion.div>

        {/* ——— Brand + navigation columns ——— */}
        <div className="hairline mt-16 grid grid-cols-1 gap-y-12 border-t pt-14 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-x-8">
          <div>
            <Link
              to="/"
              onClick={() => playHapticClick()}
              onMouseEnter={() => playHoverBlip()}
              className="inline-flex cursor-pointer items-center gap-3"
            >
              <Bloom size={22} />
              <span className="text-[12px] font-semibold uppercase tracking-[0.28em] text-ink">
                Valobite
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-mute">
              Your premium destination for discovering elite merchants,
              trending products, and exclusive collections. We bridge the gap
              between quality sellers and discerning buyers.
            </p>
            <div className="mt-7">
              <BackToTop />
            </div>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-[11px] font-semibold tracking-[0.24em] text-stone-mute uppercase">
                {group.title}
              </p>
              <ul className="mt-5 flex flex-col items-start gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] text-stone-mute uppercase">
              Connect
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  onClick={() => playHapticClick()}
                  onMouseEnter={() => playHoverBlip()}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  transition={LUXE}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ink/[0.12] text-ink-soft transition-colors duration-300 hover:border-ink/35 hover:text-ink"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    {social.glyph}
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* ——— Secured payments ——— */}
        <div className="hairline mt-16 flex flex-wrap items-center justify-between gap-6 border-t pt-8">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-stone-mute uppercase">
            Secured Payments
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            {PAYMENT_MARKS.map((method) => (
              <span
                key={method.label}
                role="img"
                aria-label={method.label}
                title={method.label}
                className="flex h-10 min-w-14 items-center justify-center rounded-xl border border-ink/[0.12] bg-white/60 px-3.5 shadow-[0_1px_3px_rgba(33,30,25,0.08)] backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(33,30,25,0.12)]"
              >
                {method.mark}
              </span>
            ))}
          </div>
        </div>

        {/* ——— Legal bar ——— */}
        <div className="hairline mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-7 pb-2 text-[12px] tracking-wide text-stone-mute">
          <span>© 2026 Valobite. All rights reserved.</span>
          <span>Made and owned by Aelvyra</span>
        </div>

      </div>
    </footer>
  );
}

