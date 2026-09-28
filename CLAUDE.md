# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML5 + CSS3 portfolio site for Chris Beard, Senior UX Designer. No build system, framework, package manager, or JavaScript dependencies — open any `.html` file directly in a browser to preview.

## Development

No build or install steps. To preview locally, open the HTML files directly in a browser or use a local static server:

```powershell
# PowerShell — serve from the portfolio directory
python -m http.server 8080
# or: npx serve .
```

## File Structure

- `index.html` — home page (centered hero, three alternating case-study feature cards, "How I work" hairline grid)
- `work.html` — work listing (flat rows with metrics and CTAs)
- `resume.html` — résumé with downloadable PDF CTA
- `cs-*.html` — individual case study pages (6 total)
- `styles.css` — single stylesheet for the entire site

## CSS Architecture

All styles live in `styles.css`. Key patterns:

**Design tokens (CSS custom properties at `:root`), in two layers:**

1. **Pajamas constants** (`--gl-*`) — raw values from the GitLab Pajamas design
   system: the neutral and purple ramps, the green/orange/red tint steps,
   and the two font weights. Treat these as read-only; they mirror the design
   system's own values.
2. **Site semantics** — everything else, defined only in terms of the layer
   above. Never introduce a raw color here; add the constant first.

- Colors: `--accent` (purple.600 `#694cc0` — Pajamas' brand hue), `--ink`/`--ink-2`/`--ink-3`
  (neutral.800/600/500), `--border`/`--border-strong` (neutral.100/200)
- Status tints: `--status-{danger,warning,success}-{bg,text}` (50 / 600 steps)
- Typography: `--font-display` / `--font-body` (GitLab Sans → Inter),
  `--font-mono` (GitLab Mono → JetBrains Mono)
- Weights: **only** `--gl-weight-normal` (400) and `--gl-weight-bold` (600).
  Pajamas ships two weights; do not add 300/500/700.
- Spacing: `clamp()`-based fluid values
- Transitions: `--transition` (0.22s cubic-bezier)
- Radii: `--radius` (4px, `border-radius-md`), `--radius-lg` (8px, `border-radius-lg`)

**Layout components:**
- `.bento-grid` / `.bento-section` — 12-column card grid on the home page
- `.card` / `.case-card-med` / `.case-card-large` — portfolio cards
- `.work-row` — work listing rows
- `.metrics-strip` — KPI display strip
- `.cs-hero` / `.cs-body` — case study page layout
- `.resume-*` — résumé page structure

**Responsive breakpoints:** 900px and 640px via `@media` in `styles.css`.

## Accessibility Standards

The site targets WCAG 2.0 AA. When editing HTML:
- Preserve `.skip-nav` link at the top of every page
- Maintain `focus-visible` outline styles (3px)
- Keep `aria-label` and `aria-current` attributes on nav links
- Don't reduce color contrast below 4.5:1 for body text / 3:1 for large text

## Case Study Page Pattern

Each `cs-*.html` follows this structure:
1. Dark `.cs-hero` — company name, role, headline metrics
2. `.cs-body` sections — methodology, constraints, process, outcomes
3. Image galleries with lightbox (inline `onclick` handlers)
4. `.pull-quote`, `.outcome-box`, `.constraint-card` highlight components
