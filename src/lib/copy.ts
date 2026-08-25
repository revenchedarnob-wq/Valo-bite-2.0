// Luxury Editorial Copywriting & Tone-of-Voice Engine (GroundAI, Apple, Bottega, Studio Freight)

export const LUXURY_COPY = {
  spatialAI: {
    heroTitle: "Space, quietly computed.",
    heroSubtitle: "Generative architectural intelligence where physical environments learn to breathe, listen, and recede.",
    badge: "01 / SPATIAL INTELLIGENCE",
    stats: [
      { label: "Hours Simulated", value: "86,400", suffix: "hrs" },
      { label: "Acoustic Attenuation", value: "−42.8", suffix: "dB" },
      { label: "Hardware Clock", value: "120", suffix: "FPS" }
    ],
    ctaPrimary: "Commission a Study",
    ctaSecondary: "Explore Archive"
  },
  atelierLuxury: {
    heroTitle: "Crafted for the few who notice.",
    heroSubtitle: "Pure material discipline. Where bespoke craftsmanship meets generative precision.",
    badge: "EDITION Nº 04",
    stats: [
      { label: "Material Purity", value: "100%", suffix: "" },
      { label: "Bespoke Allocations", value: "24", suffix: "units" },
      { label: "Hand-Finished", value: "Florence", suffix: "IT" }
    ],
    ctaPrimary: "Acquire Allocation",
    ctaSecondary: "View Lookbook"
  },
  fintechComputing: {
    heroTitle: "Deterministic velocity.",
    heroSubtitle: "Sub-millisecond computational architecture designed for institutional algorithmic execution.",
    badge: "ENTERPRISE EDGE",
    stats: [
      { label: "Execution Latency", value: "< 0.4", suffix: "ms" },
      { label: "Daily Volume", value: "$4.2B", suffix: "+" },
      { label: "Global Nodes", value: "38", suffix: "regions" }
    ],
    ctaPrimary: "Deploy Infrastructure",
    ctaSecondary: "Inspect Telemetry"
  }
};

export function getEditorialCopy(archetype: keyof typeof LUXURY_COPY) {
  return LUXURY_COPY[archetype] || LUXURY_COPY.spatialAI;
}
