# AETHER SPATIAL — Generative Spatial Design Studio

An Awwwards-tier "Quiet Luxury" multi-page marketing site for a fictional
generative spatial design studio, built with:

- **React 19 + Vite 7 + TypeScript**
- **Tailwind CSS v4**
- **motion (Framer Motion)** — spring physics, scroll choreography, masked text reveals
- **Lenis** — inertial smooth scrolling
- **Web Audio API** — 9 synthesized haptic interface voices + live `AnalyserNode` telemetry waveform

## Pages

| Route | Description |
| --- | --- |
| `/` | Hero bloom, manifesto marquee, bento showcase, filterable studies gallery, telemetry + room-tone synthesizer |
| `/studio` | Philosophy, numbered principles, three movements of practice |
| `/archive` | Case-study index |
| `/archive/:slug` | Case-study detail (bad slugs → branded 404) |

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle to dist/
npm run preview  # serve the production build
```

> The built site must be served over HTTP (`vite preview`) — opening
> `dist/index.html` from disk won't work because of ES module restrictions.

## Deployment

Every push to `main` builds the site and deploys it to **GitHub Pages** via
`.github/workflows/deploy.yml`. Pages serves from a sub-path, so CI sets
`VITE_BASE=/Valo-bite-2.0/`; a generated `404.html` keeps client-side routing
working on deep links.

## Accessibility & comfort

`prefers-reduced-motion` disables Lenis and ambient loops; keyboard focus uses
clay `:focus-visible` rings; all decorative motion is aria-hidden.
