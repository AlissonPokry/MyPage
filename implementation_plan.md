# Implementation Plan — Landing Page Portfolio

> Source of truth: `.agents/prompt.md`. Nothing added beyond what's specified.

---

## What prompt.md requests (checklist)

- [x] Single-page landing page / portfolio for Alisson
- [x] Angular + Tailwind CSS
- [x] Dark mode MANDATORY
- [x] Colors: Jet Black #252525, Electric Blue #00F0FF, Off-White #F2F0EF (+ extras allowed)
- [x] Modern futuristic design, highly responsive (mobile, tablet, desktop)
- [x] Background w/ mouse-reactive dots (configurable size, quantity, smooth, fade w/ distance)
- [x] Glassmorphism
- [x] Smooth fluid animations
- [x] SEO optimized
- [x] Animated light flow in bg on scroll
- [x] Futuristic, technological look
- [x] Modern minimalist high-quality icons
- [x] Name displayed w/ terminal typing animation `>_`
- [x] Easy add/remove competências (data-driven)
- [x] Modular, reusable components
- [x] Professional folder/file organization, easy to understand/modify
- [x] Documentation + planning
- [x] GitHub Pages deploy ready
- [x] `.gitignore` excludes `.agents/` + `skills-lock.json`

### Who is Alisson

- **Name:** Alisson Pokrywiecki da Silva
- **Location:** Itajaí, Santa Catarina, Brasil
- **Role:** Estudante de Ciência da Computação — UNIVALI
- **Competências:** Typescript, Angular, Tailwind CSS, C++, C#, Javascript, Python
- **Languages:** Fluent English, Native Portuguese

---

## Design Direction

**Aesthetic:** Cyber-Futurist Dark Glassmorphism
**DFII Score:** 13/15 (Impact 5 + Fit 4 + Feasibility 4 + Performance 4 − Risk 4)

**Differentiation anchor:** Living particle canvas bg reacting to mouse + terminal typing name reveal + glassmorphic panels w/ Electric Blue glow on Jet Black.

> "This avoids generic portfolio UI by using a living particle background that reacts to mouse, combined with a hacker-terminal name reveal — not a static hero with stock photo."

---

## Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `--jet-black` | `#252525` | Primary BG |
| `--deep-black` | `#0D0D0D` | Deeper BG layers |
| `--electric-blue` | `#00F0FF` | Accent, glow, highlights |
| `--off-white` | `#F2F0EF` | Primary text |
| `--blue-glow` | `rgba(0,240,255,0.15)` | Glassmorphism tint |
| `--blue-dim` | `rgba(0,240,255,0.4)` | Secondary accent |

---

## Typography (3 fonts)

| Role | Font | Rationale |
|------|------|-----------|
| **Futuristic display** | **Exo 2** | Geometric, futuristic, sci-fi feel (same family as Orbitron/Oxanium but more readable at all sizes) |
| **Headings** | **Space Grotesk** | Clean geometric sans, tech-forward |
| **Body / Code** | **JetBrains Mono** | Monospace reinforces dev/terminal aesthetic, matches typing animation |

Usage: Exo 2 for hero name + section titles → Space Grotesk for subtitles/labels → JetBrains Mono for body text, competências tags, code-style elements.

---

## Architecture

```
src/
├── app/
│   ├── app.component.ts              # Root: hosts particle canvas + content
│   ├── app.component.html
│   ├── app.component.css
│   ├── app.config.ts                 # Zoneless + providers
│   ├── core/
│   │   └── data/
│   │       └── skills.data.ts        # Competências array (easy add/remove)
│   ├── shared/
│   │   ├── components/
│   │   │   ├── glass-card/           # Reusable glassmorphic card
│   │   │   └── skill-tag/            # Single competência tag chip
│   │   └── directives/
│   │       └── scroll-animate.directive.ts  # Intersection Observer entrance anim
│   └── sections/
│       ├── hero/                     # Name typing anim + subtitle + competências
│       └── particle-canvas/          # Canvas bg w/ mouse-reactive dots + light flow
├── assets/
├── styles.css                        # Tailwind v4 @theme + global styles + fonts
└── index.html                        # SEO meta, fonts import
```

> [!IMPORTANT]
> **Competências** live in `skills.data.ts` as a simple array:
> ```typescript
> export const SKILLS = ['Typescript', 'Angular', 'Tailwind CSS', 'C++', 'C#', 'Javascript', 'Python'];
> ```
> Add/remove → no component changes needed.

---

## Component Breakdown

### 1. Particle Canvas (`particle-canvas`)
- Full-viewport HTML5 Canvas, fixed behind content
- Mouse-reactive dots:
  - Configurable: dot count, base size, max size, reaction radius, fade distance
  - Dots grow near cursor, shrink/fade beyond threshold
  - Smooth spring interpolation
- Light flow effect: subtle gradient sweep moves w/ scroll position
- `prefers-reduced-motion` → static dots, no animation
- `will-change: transform` for GPU acceleration

### 2. Hero Section (`hero`)
- Full viewport height
- Terminal typing animation: `>_ Alisson Pokrywiecki da Silva`
  - Blinking cursor, character-by-character reveal
  - Exo 2 font for name
- Subtitle: "Estudante de Ciência da Computação — UNIVALI"
- Location: "Itajaí, SC — Brasil"
- Competências: horizontal scrollable tag row (skill-tag components)
  - Data-driven from `skills.data.ts`
  - Glassmorphic chip style w/ Electric Blue border
- Scroll-down indicator (animated chevron)

### 3. Glass Card (`glass-card`)
- Reusable component
- `backdrop-filter: blur(12px)`, semi-transparent bg
- Electric Blue glow border on hover
- Content projection via `<ng-content>`

### 4. Skill Tag (`skill-tag`)
- Small glassmorphic chip
- Input: skill name string
- Electric Blue border, monospace font

### 5. Scroll Animate Directive
- Intersection Observer-based
- Triggers CSS entrance animations when element enters viewport
- Staggered timing for lists
- Respects `prefers-reduced-motion`

---

## Technical Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Change Detection | Zoneless + OnPush | Best perf, no zone.js |
| State | Signals | Modern Angular, lightweight |
| Inputs/Outputs | `input()` / `output()` | Signal-based |
| DI | `inject()` fn | No constructor injection |
| Control flow | `@if` / `@for` | New syntax, smaller bundle |
| Tailwind config | CSS-first `@theme` | v4 pattern |
| Dark mode | Always dark | Mandatory per prompt |
| Deploy target | GitHub Pages | `ng build --base-href` |
| Standalone | All components | No NgModules |

---

## SEO

- `<title>`: "Alisson Pokrywiecki da Silva — Ciência da Computação | Portfolio"
- `<meta name="description">`: targeted description
- Single `<h1>` in hero (name)
- Semantic HTML: `<main>`, `<section>`, `<header>` where appropriate
- `<meta name="viewport" content="width=device-width, initial-scale=1">`
- OG tags for social sharing
- Lang attribute: `pt-BR`

---

## Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| Base (0px) | Mobile-first |
| `sm:` 640px | Large phone |
| `md:` 768px | Tablet |
| `lg:` 1024px | Laptop |
| `xl:` 1280px | Desktop |

---

## Phase Plan

### Phase 1 — Foundation
1. Scaffold Angular app
2. Install + configure Tailwind CSS v4
3. Configure `@theme` tokens, global styles, 3 fonts (Exo 2, Space Grotesk, JetBrains Mono)
4. Create `.gitignore` (exclude `.agents/`, `skills-lock.json`, node_modules, dist, etc.)

### Phase 2 — Core
5. Particle canvas component (mouse-reactive dots + light flow)
6. Hero section w/ typing animation
7. `skills.data.ts` + skill-tag components
8. Glass-card shared component

### Phase 3 — Polish
9. Scroll-animate directive
10. Glassmorphism refinements
11. Light flow scroll animation
12. SEO meta tags + index.html
13. Responsive QA across breakpoints
14. GitHub Pages build configuration

---

> [!NOTE]
> Prompt.md does NOT specify: navbar, portfolio gallery, about section, team members, contact form, social media buttons, or store link.
> These are NOT included in this plan. Only what prompt.md requests is built.
> If Alisson wants to add these later, the modular architecture supports it.
