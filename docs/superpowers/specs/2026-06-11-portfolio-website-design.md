# Eileen Yeoh — Portfolio Website Design

**Date:** 2026-06-11
**Status:** Approved by Eileen (brainstorming session)

## Purpose

A personal portfolio website for Eileen Yeoh, an Electrical & Electronics Engineering student. It showcases engineering projects as visual, interactive stories — the theory, hardware, and software behind each — with motion design quality comparable to sites featured on motionsites.ai, while remaining professional enough to put on a CV. First flagship project: ARIA (https://github.com/EileenYJH/ARIA).

## Success criteria

- A recruiter clicking the link from a CV immediately understands who Eileen is and what she builds.
- The ARIA page lets a visitor *play* with the system (fire-score simulator, evacuation demo) rather than just read about it.
- Site loads fast (Lighthouse ≥ 90 performance), works on mobile, and looks polished in a LinkedIn link preview.
- Eileen can publish a blog post by writing a markdown file — no coding session needed.
- Free to host and maintain.

## Decisions made

| Decision | Choice |
|---|---|
| Scope | Full portfolio + blog |
| Project depth | Interactive deep-dive pages for flagship projects |
| Hosting | Free — GitHub Pages (`eileenyjh.github.io`), custom domain possible later |
| Design direction | Clean bright/editorial base; NOT literally circuit/EEE-themed |
| Hero signature | Robotic arm/hand that tracks the mouse — 2D SVG with inverse kinematics first, swappable to 3D later |
| Framework | Astro + GSAP (ScrollTrigger + SplitText) |
| Content workflow | Flagship project pages custom-built with Claude; blog posts and minor projects as markdown files Eileen writes |
| Motion | Every section has scroll-triggered effects; headings get expressive text reveals (staggered chars/words, masked line wipes) |

## Site map

```
/                    Home — hero (robotic arm), featured work, about teaser, latest posts, contact + CV
/projects            Projects index — grid of all projects
/projects/aria       ARIA interactive deep-dive (custom page)
/blog                Blog index (generated from markdown)
/blog/<slug>         Blog post layout (title, date, tags, reading time)
/about               Story, skills, education, what she's looking for
```

Footer on every page: GitHub, LinkedIn, email, CV download button.

## Design language

- Clean, bright, editorial: warm light background, strong typography, generous whitespace.
- Engineering identity expressed through *behavior* (precise motion, the robotic arm, interactive systems) rather than literal circuit imagery.
- Typography is part of the motion design: hero and section headings animate in with character/word staggers or masked line reveals (GSAP SplitText).
- Motion principles: scroll-reveals on every section, subtle parallax, magnetic hover on buttons, a brief "system coming online" page-load sequence. Restrained enough to stay professional.
- All motion respects `prefers-reduced-motion` (static fallbacks).

## Homepage

Scroll order: Hero → Featured work → About teaser → Latest posts → Contact + CV.

**Hero:** Eileen's name, one-line identity statement (wording to be refined during implementation, e.g. "I build systems where hardware meets intelligence"), and the robotic arm tracking the cursor. CTA buttons: View projects / About me.

**Robotic arm (`RoboticArm` component):**
- Crisp vector (SVG) robotic arm with 2-joint inverse kinematics; wrist/fingers articulate to reach toward the cursor.
- Idle "breathing" micro-animation when the mouse is still.
- Touch devices and reduced-motion: static elegant pose (optionally a slow autonomous idle loop on touch).
- Self-contained component so it can be swapped for a Three.js 3D model later without touching the rest of the hero.

## ARIA project page (`/projects/aria`)

Scroll-driven story in 8 sections, each with scroll-triggered transitions and animated headings:

1. **Project hero** — title, one-liner, tags (ESP32 · ESP-NOW · sensor fusion · 6-node WSN), best hardware photo or demo video.
2. **The problem** — conventional smoke detectors false-alarm on cooking smoke/haze; multi-sensor fusion distinguishes real fires. Sets up the story.
3. **System architecture (animated)** — hub + up to 6 nodes as a clean diagram; scroll progress drives data packets flowing node → hub over ESP-NOW; hub fans out to dashboard, LED strips, Telegram.
4. **Fire-score simulator (interactive)** — sliders for smoke (MQ-2), CO ppm (MQ-7), air quality (MQ-135), flame, humidity trend; live fire score 0–10 with tier colors (Normal 0–2, Pre-warning 3–5, Emergency 6–7, Critical 8–10). Ported faithfully from the firmware scoring table in the ARIA README, including negative scoring for steam/cooking patterns and the gas-leak mode branch.
5. **Evacuation routing demo (interactive)** — mini floor map with zones A/B/C and exits A/B/C; visitor clicks a zone to set it on fire (and can toggle exit congestion); LED chase arrows re-route per the firmware's exit-routing table (green toward safe exits, red away from fire, orange for congestion).
6. **Hardware gallery** — build photos; sensor lineup explained (MQ-2, MQ-7, MQ-135, DHT, flame sensor, LDR laser beams).
7. **Dashboard tour** — screenshots of the warden/technical/demo tabs, captured by running the dashboard HTML (`html_page.h` from the repo) locally with simulated data.
8. **Outcome + links** — tech stack, GitHub repo link, lessons learned.

Interactive logic (scoring table, routing table, tier thresholds) is transcribed from the ARIA README/firmware — the page demonstrates the *real* algorithms, simplified only in presentation.

## Blog

- Astro content collection: a post = one markdown file with frontmatter (title, date, tags, optional cover image) in `src/content/blog/`.
- Auto-generated index with cards; post layout includes reading time and tag chips.
- Minor (non-flagship) projects can also be markdown entries in a `projects` collection, rendered as cards on `/projects` without a custom page.

## Architecture

- **Framework:** Astro (static output, zero-JS by default), TypeScript.
- **Motion:** GSAP + ScrollTrigger + SplitText (all free).
- **Interactive components:** vanilla TypeScript islands, each self-contained: `RoboticArm`, `FireScoreSimulator`, `EvacuationDemo`. A failure in one island must not break the page (each wraps its init in try/catch and degrades to static content).
- **Styling:** plain CSS with design tokens (custom properties); no CSS framework dependency.
- **Repo:** new git repo at `C:\Users\eilee\Documents\Projects\portfolio`, pushed to GitHub under EileenYJH.
- **Deploy:** GitHub Actions → GitHub Pages on every push to main.

## Error handling & resilience

- Interactive islands degrade gracefully: no JS / errors → static diagram or illustration with the same information.
- Reduced-motion users get content without animation, never blank sections (ScrollTrigger reveals must default to visible when disabled).
- Images: explicit dimensions to avoid layout shift; compressed (AVIF/WebP with fallback).
- 404 page in site style.

## Testing & verification

- `astro build` passes clean; Lighthouse (performance, accessibility, SEO) ≥ 90 on home and ARIA pages.
- Manual verification matrix: desktop Chrome/Edge, mobile viewport, reduced-motion enabled, JS disabled (content still readable).
- Interactive logic (fire score, routing) gets unit tests against cases derived from the README tables (e.g. flame + high CO ⇒ score ≥ 8; steam pattern ⇒ score penalized; zone B fire ⇒ A routes left/green, B red, C green right).

## Content needed from Eileen (not blocking initial build)

- Hardware photos and demo videos of ARIA.
- About-me text (or raw notes to shape together), CV PDF, LinkedIn URL, preferred display name.
- Identity statement wording preference.

## Out of scope (for now)

- Custom domain purchase.
- 3D robotic hand (slot kept swappable).
- CMS or comments on the blog.
- Analytics beyond a simple privacy-friendly counter (can add later).
