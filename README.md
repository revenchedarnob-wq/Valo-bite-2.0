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

The production `dist/index.html` must be served over HTTP (`vite preview`)
and assumes the base path of the deployed site (see below).

## Deployment (GitHub Pages)

This repository deploys via `.github/workflows/deploy.yml` on every push to
`main` **using the GitHub Actions Pages source** — the Pages site must be
authorized in Settings → Pages → Build and deployment → Source →
**GitHub Actions**.

GitHub Pages serves the repo under `/Valo-bite-2.0/`, so:

- `vite.config.ts` sets `base` to `/Valo-bite-2.0/` (default),
- `src/App.tsx` seeds `<BrowserRouter basename={import.meta.env.BASE_URL}>`,
- the workflow sets `VITE_BASE=/Valo-bite-2.0/` and copies `dist/index.html`
  to `dist/404.html` so deep links (e.g. `/archive/petal-field-pavilion`)
  resolve with client-side routing.

> `npm run dev` explicitly uses `--base /` so the dev server stays at the
> root for a fast local loop; production builds keep the subpath base.

## Accessibility & comfort

`prefers-reduced-motion` disables Lenis and ambient loops; keyboard focus uses
clay `:focus-visible` rings; all decorative motion is aria-hidden.
