"use client";

import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  playHapticClick,
  playHoverBlip,
  playHapticSuccess,
} from "@/lib/sound";
import { SPRING_BOUNCE } from "@/lib/motion-presets";
import { scrollToSelector } from "@/lib/scroll";
import { openCommissionDrawer } from "./CommissionDrawer";
import { Magnetic } from "./Magnetic";
import { Bloom } from "./Bloom";

const LUXE = { type: "spring", stiffness: 350, damping: 26, mass: 0.6 } as const;

/* ——— Email → clipboard copy with toast badge + particle ripple ——— */
const STUDIO_EMAIL = "studio@aetherspatial.com";

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(STUDIO_EMAIL);
    } catch {
      // Clipboard API unavailable (http / permissions) — fallback path.
      const helper = document.createElement("textarea");
      helper.value = STUDIO_EMAIL;
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }
    playHapticSuccess();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <span className="relative inline-block">
      {/* particle ripple on copy */}
      <AnimatePresence>
        {copied &&
          [...Array(6)].map((_, i) => (
            <motion.span
              key={`${Date.now()}-${i}`}
              aria-hidden
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i / 6) * Math.PI * 2) * 38,
                y: Math.sin((i / 6) * Math.PI * 2) * 26,
                opacity: 0,
                scale: 0.2,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="pointer-events-none absolute top-1/2 left-1/4 h-1 w-1 rounded-full bg-clay"
            />
          ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={copy}
        onMouseEnter={() => playHoverBlip()}
        title="Copy email address"
        className="group inline-flex cursor-pointer items-center gap-2 text-sm text-ink-soft underline decoration-ink/25 underline-offset-8 transition-all duration-300 hover:text-ink hover:decoration-ink hover:underline-offset-4"
      >
        {STUDIO_EMAIL}
        <svg
          width="13"
          height="13"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
          className="opacity-50 transition-opacity group-hover:opacity-100"
        >
          <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" stroke="currentColor" />
          <path d="M9.5 4.5V3A1.5 1.5 0 0 0 8 1.5H3A1.5 1.5 0 0 0 1.5 3v5A1.5 1.5 0 0 0 3 9.5h1.5" stroke="currentColor" />
        </svg>
      </button>

      {/* toast badge */}
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={SPRING_BOUNCE}
            role="status"
            className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 rounded-full bg-ink px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.18em] whitespace-nowrap text-alabaster uppercase shadow-[0_12px_28px_-10px_rgba(33,30,25,0.55)]"
          >
            Copied to clipboard ✓
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

const OFFICES: Array<{ city: string; detail: string }> = [
  { city: "Zürich", detail: "Limmatstrasse 152 · 8005" },
  { city: "Kyoto", detail: "Nakagyō-ku · Sanjō" },
  { city: "Mexico City", detail: "Roma Norte · CDMX" },
];

const LINK_GROUPS: Array<{
  title: string;
  links: Array<{ label: string; href?: string; to?: string; anchor?: string }>;
}> = [
  {
    title: "Studio",
    links: [
      { label: "Philosophy", to: "/studio" },
      { label: "Works", to: "/archive" },
      { label: "Telemetry", to: "/", anchor: "#telemetry" },
    ],
  },
  {
    title: "Studies",
    links: [
      { label: "Volumetric", to: "/archive/petal-field-pavilion" },
      { label: "Acoustics", to: "/archive/hush-chambers-ii" },
      { label: "Light Studies", to: "/archive/alabaster-drift" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Are.na", href: "https://are.na" },
      { label: "LinkedIn", href: "https://linkedin.com" },
    ],
  },
];

type FooterLinkProps = {
  label: string;
  href?: string;
  to?: string;
  anchor?: string;
};

function FooterLink({ label, href, to, anchor }: FooterLinkProps) {
  const navigate = useNavigate();

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={() => playHapticClick()}
        onMouseEnter={() => playHoverBlip()}
        whileHover={{ x: 4 }}
        transition={LUXE}
        className="group inline-flex cursor-pointer items-center gap-2 text-sm text-ink-soft transition-colors duration-300 hover:text-ink"
      >
        <span
          aria-hidden
          className="h-1 w-1 -translate-x-1 rounded-full bg-clay opacity-0 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100"
        />
        {label}
      </motion.a>
    );
  }

  return (
    <motion.div
      whileHover={{ x: 4 }}
      onMouseEnter={() => playHoverBlip()}
      transition={LUXE}
      className="group inline-block"
    >
      <Link
        to={to ?? "/"}
        onClick={(e) => {
          playHapticClick();
          if (anchor && to === "/") {
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
  const { scrollYProgress } = useScroll({
    target: footRef,
    offset: ["start end", "end end"],
  });
  // The giant wordmark drifts gently against scroll direction.
  const wordmarkX = useTransform(scrollYProgress, [0, 1], [70, -70]);

  return (
    <footer
      ref={footRef}
      id="contact"
      className="hairline relative overflow-hidden border-t px-6 pt-28 pb-8 md:pt-36"
    >
      {/* oversized ambient bloom */}
      <Bloom
        size={560}
        color="#b3a184"
        className="pointer-events-none absolute -right-40 -bottom-40 opacity-[0.12]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* ——— CTA block ——— */}
        <div className="flex flex-col justify-between gap-14 lg:flex-row lg:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-[11px] font-medium uppercase tracking-[0.45em] text-stone-mute"
            >
              Commissions — 2026
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 48, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ ...LUXE }}
              className="font-display mt-6 max-w-4xl text-6xl leading-[1.02] md:text-8xl"
            >
              Let us grow your{" "}
              <em className="text-clay italic">next</em> space.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...LUXE, delay: 0.15 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <Magnetic strength={0.25}>
                <motion.button
                  onClick={() => {
                    playHapticClick();
                    openCommissionDrawer();
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  transition={LUXE}
                  className="btn-shine group inline-flex cursor-pointer items-center gap-3 rounded-full bg-ink px-8 py-4 text-[13px] font-semibold tracking-[0.12em] text-alabaster uppercase shadow-[0_16px_40px_-16px_rgba(33,30,25,0.5)]"
                >
                  Begin a commission
                  <span
                    aria-hidden
                    className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </motion.button>
              </Magnetic>
              <CopyEmail />
            </motion.div>
          </div>

          {/* Offices */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...LUXE, delay: 0.25 }}
            className="grid shrink-0 grid-cols-1 gap-5 sm:grid-cols-3 lg:w-auto"
          >
            {OFFICES.map((office) => (
              <div key={office.city}>
                <p className="text-[11px] font-semibold tracking-[0.24em] text-ink uppercase">
                  {office.city}
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-stone-mute">
                  {office.detail}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ——— Navigation columns ——— */}
        <div className="hairline mt-24 grid grid-cols-2 gap-x-8 gap-y-12 border-t pt-14 md:grid-cols-5">
          <div className="col-span-2">
            <Link to="/" onClick={() => playHapticClick()} className="inline-flex cursor-pointer items-center gap-3">
              <Bloom size={22} />
              <span className="text-[12px] font-semibold uppercase tracking-[0.28em] text-ink">
                Aether Spatial
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-mute">
              A generative spatial design studio crafting quiet, computational
              environments where architecture learns to breathe.
            </p>
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
        </div>

        {/* ——— Giant editorial wordmark ——— */}
        <div aria-hidden className="mt-20 overflow-hidden select-none">
          <motion.p
            initial={{ y: "35%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ ...LUXE }}
            style={{ x: wordmarkX }}
            className="font-display text-center text-[clamp(2.6rem,10vw,9rem)] leading-[0.95] whitespace-nowrap text-ink/[0.08] will-change-transform"
          >
            Aether Spatial
          </motion.p>
        </div>

        {/* ——— Legal bar ——— */}
        <div className="hairline mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-7 pb-2 text-[12px] tracking-wide text-stone-mute">
          <span>© 2026 — All spaces reserved</span>
          <span>Zürich · Kyoto · Mexico City</span>
        </div>
      </div>
    </footer>
  );
}
