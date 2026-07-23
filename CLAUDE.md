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

- `index.html` — home page (hero, metrics strip, bento card grid)
- `work.html` — work listing (flat rows with metrics and CTAs)
- `resume.html` — résumé with downloadable PDF CTA
- `cs-*.html` — individual case study pages (6 total)
- `styles.css` — single stylesheet for the entire site

## CSS Architecture

All styles live in `styles.css`. Key patterns:

**Design tokens (CSS custom properties at `:root`):**
- Colors: `--accent` (#1B4F8A blue), grays, off-white backgrounds
- Typography: `--font-display` (Inter), `--font-body` (Krub), `--font-mono`
- Spacing: `clamp()`-based fluid values
- Transitions: `--transition` (0.22s cubic-bezier)
- Radii: `--radius` (4px), `--radius-lg` (8px)

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
