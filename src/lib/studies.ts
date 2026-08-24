/**
 * lib/studies — the shared archive dataset.
 * Consumed by the home Gallery teaser, the Archive index,
 * and each case-study detail page.
 */

export type Category = "Volumetric" | "Acoustics" | "Light Studies";

export type Study = {
  slug: string;
  no: string;
  title: string;
  category: Category;
  year: string;
  location: string;
  status: "Built" | "In development";
  area: string;
  blurb: string;
  narrative: string[];
  metrics: Array<{ value: string; label: string }>;
};

export const STUDIES: Study[] = [
  {
    slug: "petal-field-pavilion",
    no: "Study Nº 03",
    title: "Petal Field Pavilion",
    category: "Volumetric",
    year: "2025",
    location: "Kyoto, Japan",
    status: "Built",
    area: "640 m²",
    blurb:
      "A deployable shell grown from 1,400 petal instances — each folded by wind-load data gathered on site.",
    narrative: [
      "Commissioned as a temporary pavilion for a Kyoto garden festival, Petal Field began as a question: could a structure learn to move before it learned to stand?",
      "We seeded 1,400 petal instances across a parametric shell and let a year of on-site wind data fold each one individually. The result is a canopy that reads as frozen motion — every plate oriented by a gust that already happened.",
      "The pavilion was assembled in eleven days without a single drawn detail. Every joint was resolved by the same solver that shaped the petals.",
    ],
    metrics: [
      { value: "1,400", label: "Unique plates" },
      { value: "11 days", label: "Assembly" },
      { value: "0", label: "Drawn details" },
    ],
  },
  {
    slug: "hush-chambers-ii",
    no: "Study Nº 09",
    title: "Hush Chambers II",
    category: "Acoustics",
    year: "2026",
    location: "Zürich, Switzerland",
    status: "In development",
    area: "1,180 m²",
    blurb:
      "Curved plaster reading rooms tuned by ray-traced reflections until the city falls away at −42 dB.",
    narrative: [
      "The second iteration of our Hush Chambers research narrows its focus from silence to attention: rooms calibrated not merely to be quiet, but to make concentration feel physical.",
      "Each chamber's double-curved plaster geometry was iterated through two million ray-traced reflections until the reverberation curve matched a hand-drawn target — then refined again by ear, in the room itself.",
      "The result is a library where the loudest event is a page turning, and the architecture holds that sound like an object.",
    ],
    metrics: [
      { value: "−42 dB", label: "Measured floor" },
      { value: "2.1M", label: "Rays traced" },
      { value: "9", label: "Chambers" },
    ],
  },
  {
    slug: "alabaster-drift",
    no: "Study Nº 07",
    title: "Alabaster Drift",
    category: "Light Studies",
    year: "2026",
    location: "Mexico City, Mexico",
    status: "In development",
    area: "860 m²",
    blurb:
      "Daylight choreography simulated across 86,000 hours — a lobby that never repeats its light twice.",
    narrative: [
      "Alabaster Drift is a hotel lobby designed around a single material decision: a 14-metre alabaster screen that turns the sun into a slow instrument.",
      "We simulated every hour of daylight across a full decade — 86,000 hours — and tuned the screen's thickness in twelve zones so the interior brightness never exceeds a whisper of variation.",
      "Guests will never see the same room twice. The building performs its site like a score.",
    ],
    metrics: [
      { value: "86,000 h", label: "Simulated" },
      { value: "12 zones", label: "Screen tuning" },
      { value: "±3%", label: "Luminance drift" },
    ],
  },
  {
    slug: "meridian-fold",
    no: "Study Nº 11",
    title: "Meridian Fold",
    category: "Volumetric",
    year: "2026",
    location: "Lisbon, Portugal",
    status: "In development",
    area: "420 m²",
    blurb:
      "One continuous surface wrapped around a courtyard house, thickened only where the sun demands shade.",
    narrative: [
      "Meridian Fold replaces the wall with a gradient: a single continuous roof-wall-floor surface whose thickness is a direct readout of solar exposure.",
      "Where the Lisbon sun presses hardest, the surface swells into a deep loggia; where the light is gentle it thins to a membrane of glass and lime plaster.",
      "The house has no rooms in the classical sense — only intensities.",
    ],
    metrics: [
      { value: "1", label: "Continuous surface" },
      { value: "38%", label: "Cooling load cut" },
      { value: "420 m²", label: "Footprint" },
    ],
  },
  {
    slug: "tidal-resonance-hall",
    no: "Study Nº 14",
    title: "Tidal Resonance Hall",
    category: "Acoustics",
    year: "2027",
    location: "Bergen, Norway",
    status: "In development",
    area: "2,300 m²",
    blurb:
      "A concert hall whose acoustic panels drift with the harbour tide — the room retunes itself twice a day.",
    narrative: [
      "Sited at the waterline in Bergen, Tidal Resonance Hall treats the tide as a tuning fork. As the harbour rises and falls, counterweights shift 40 tonnes of absorptive paneling along curved tracks.",
      "At low tide the hall favours strings — drier, closer. At high tide it opens into a long, cathedral bloom for brass and voice.",
      "The acoustics become a calendar: locals claim they can tell the time of day with their eyes closed.",
    ],
    metrics: [
      { value: "2× daily", label: "Retuning cycle" },
      { value: "40 t", label: "Moving mass" },
      { value: "1.9 s → 2.6 s", label: "Reverb range" },
    ],
  },
  {
    slug: "caustic-garden",
    no: "Study Nº 17",
    title: "Caustic Garden",
    category: "Light Studies",
    year: "2027",
    location: "Marfa, Texas",
    status: "In development",
    area: "1.2 ha",
    blurb:
      "A desert landscape where mirrored reliefs fold the starlight into slow, walking-paced constellations.",
    narrative: [
      "Far from any city, Caustic Garden works with the one light source everyone forgets: the night sky.",
      "Nineteen mirrored reliefs, each ground to a different focal length, gather starlight and moonlight into pools of luminance along a walking path. On a clear new-moon night the path glows faintly enough to read by.",
      "It is the quietest project we have ever made — and possibly the brightest.",
    ],
    metrics: [
      { value: "19", label: "Mirrored reliefs" },
      { value: "0 W", label: "Electric light" },
      { value: "1.2 ha", label: "Landscape" },
    ],
  },
];

export function getStudy(slug: string | undefined): Study | undefined {
  return STUDIES.find((study) => study.slug === slug);
}