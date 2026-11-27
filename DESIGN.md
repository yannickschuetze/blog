---
name: yannicksblog
description: A sketchbook-poster blog of personal stories and side projects, in black ink on one flat pastel.
colors:
  ink: "#161616"
  pink: "#ffc4c0"
  pink-mute: "#5c3a37"
  butter: "#fbe38e"
  butter-mute: "#5a4a17"
typography:
  display-hero:
    fontFamily: "Londrina Solid, Arial Narrow, sans-serif"
    fontSize: "clamp(44px, 5.2vw + 12px, 80px)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Londrina Solid, Arial Narrow, sans-serif"
    fontSize: "clamp(36px, 3.6vw + 12px, 60px)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "0.005em"
  title:
    fontFamily: "Londrina Solid, Arial Narrow, sans-serif"
    fontSize: "clamp(24px, 1.2vw + 16px, 30px)"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "0.005em"
  section-head:
    fontFamily: "Londrina Solid, Arial Narrow, sans-serif"
    fontSize: "30px"
    fontWeight: 900
    lineHeight: 1
  pull-quote:
    fontFamily: "Londrina Solid, Arial Narrow, sans-serif"
    fontSize: "clamp(26px, 1.4vw + 18px, 34px)"
    fontWeight: 400
    lineHeight: 1.1
  label:
    fontFamily: "Londrina Solid, Arial Narrow, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.03em"
  lede:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.6
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "tnum"
  small:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: "0px"
  code-inline: "3px"
  code-block: "6px"
spacing:
  m: "8px"
  m2: "16px"
  m3: "24px"
  m4: "32px"
  edge: "40px"
  edge-phone: "24px"
  m6: "48px"
  m12: "96px"
  column: "960px"
  measure: "64ch"
components:
  wordmark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.pink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "7px 10px 4px"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "4px 0"
  post-row-title:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: "20px 0"
  post-row-meta:
    textColor: "{colors.pink-mute}"
    typography: "{typography.small}"
  number-stamp:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.pink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "2px 8px 0"
  placeholder-tag:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.pink}"
    rounded: "{rounded.none}"
    padding: "3px 7px 1px"
  drawing-slot:
    textColor: "{colors.ink}"
    padding: "24px"
  code-block:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.pink}"
    rounded: "{rounded.code-block}"
    padding: "20px"
  skip-link:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.pink}"
    padding: "8px 16px"
---

# Design System: yannicksblog

## Overview

**Creative North Star: "The Sketchbook Poster"**

Every page is one sheet of flat pastel paper with black ink on it. Condensed, slightly hand-cut capitals do the shouting (wordmark, navigation, titles, labels); a calm grotesk carries the reading. The owner's own black line drawings are the main character, and until they exist each one is held open by a hand-drawn dashed placeholder frame. Everything sits in one centred column, openers centred, running text left-aligned in a reading measure.

The system is minimal by commitment: one ground colour per page, one ink, one rule weight, no cards, no shadows, no second accent. Playfulness comes from three small things only: a few ink blocks set slightly askew (the wordmark, the post number, the placeholder tag), a gentle wobble when a drawing or title is touched, and a hand-drawn tick that marks posts already read.

The present implementation is Astro (`src/styles/global.css` holds every token; components in `src/components/`, pages in `src/pages/`). The system is stack-neutral: a PHP template set reproduces it by emitting the same custom properties on `:root`, the same `data-ground` attribute on `<html>`, and the component markup described below.

**Key Characteristics:**
- One flat pastel ground per page: pink for home, Geschichten, Über mich and 404; butter for Projekte and every Projekt post.
- Black ink for everything else: type, 2px rules, drawings, figures, stamps.
- Condensed uppercase display capitals against a calm sans for reading.
- One centred 960px column on an 8px module.
- Hand-drawn marks (dashed frame, tick, drawings) instead of icons or decoration.
- Motion is a single hover wobble, never on load.

## Colors

Two pastel grounds, each with its own darkened mute, and one near-black ink. A page only ever shows one ground.

### Primary
- **Poster Ink** (`ink`): all text, 2px rules, focus outlines, drawing strokes, figure strokes (via `currentColor`), and the fill of every ink block (wordmark, number stamp, placeholder tag, code block, skip link). Also the selection background.

### Neutral (grounds)
- **Sketchbook Pink** (`pink`): the page ground for home, Geschichten, Über mich, 404 and every Geschichte post. Default when nothing else is set. Also the knocked-out text colour inside ink blocks on pink pages, the browser `theme-color`, and the favicon tile.
- **Butter Yellow** (`butter`): the page ground for Projekte and every Projekt post (`data-ground="butter"`). Replaces pink everywhere pink would appear, including knock-outs and `theme-color`.

### Secondary text (mutes)
- **Pink Mute** (`pink-mute`): secondary text on pink only: post-row meta, captions, pager labels, placeholder notes, file hints.
- **Butter Mute** (`butter-mute`): the same role on butter.

The ground and mute are exposed as two switching variables, `--ground` and `--mute`; components never name pink or butter directly.

### Named Rules
**The One Ground Rule.** A page is drenched in exactly one pastel, chosen by section. No white surfaces, no cards on a second tint, no mixing pink and butter on one page.

**The Ink-Only Rule.** There is no accent colour. Emphasis is made with weight, size, capitals, underline or an ink block, never with hue.

**The Paired Mute Rule.** Secondary text uses the mute that belongs to the current ground, never a grey and never ink at reduced opacity.

## Typography

**Display Font:** Londrina Solid 900 and 400 (fallback Arial Narrow, sans-serif), self-hosted.
**Body Font:** Hanken Grotesk variable 400 to 700 with italic (fallback system-ui), self-hosted.
**Code Font:** the platform monospace stack (ui-monospace, SF Mono, Menlo).

**Character:** Londrina's chunky, slightly irregular capitals read like letters cut from paper or painted with a flat brush; Hanken Grotesk is quiet, open and even, so long stories stay easy. Numbers are tabular site-wide.

### Hierarchy
- **Display hero** (900, uppercase, `display-hero`): one per page, the opener title on home, section pages, Über mich and 404. Balanced wrap, max about 12 to 18ch. The home hero currently uses its own clamp (40 to 64px); see drift note.
- **Headline** (900, uppercase, `headline`): the post title, max 18ch, centred.
- **Title** (900, uppercase, `title`): post titles in the index and the pager, and the wordmark at 26px.
- **Section head** (900, uppercase, 30px): `h2` inside prose and on Über mich.
- **Pull quote** (400, uppercase, centred, `pull-quote`): blockquotes inside prose.
- **Label** (400, uppercase, 0.03em tracking, 18 to 21px): navigation, post numbers, meta rows, year heads, pager labels, footer links, figure numbers ("Abb. n").
- **Lede** (700 sans, 24px, 20px on phones): the one sentence under an opener title.
- **Body** (400 sans, 18px, 17px on phones, line-height 1.6): running text in a 64ch measure, hyphenated automatically in prose. Links in prose are bold and underlined.
- **Small** (400 sans, 15px): meta lines, captions, file hints, in the mute colour.

### Named Rules
**The Two Voices Rule.** Display capitals label and announce; the sans reads. Never set running text in Londrina, never set a title in the sans.

**The Capitals Are the Display Rule.** Londrina is always uppercase. Lowercase only appears in the sans.

## Layout

One centred column: content width 960px plus a side edge of 40px (24px at 640px and below). Long text narrows further to a 64ch measure inside that column. Everything is spaced in multiples of the 8px module (`--m`); the steps actually used are 1, 2, 2.5, 3, 4, 5, 6, 7, 8, 10, 12 and 16 modules.

- **Masthead:** a four-track grid. Wordmark left, Geschichten and Projekte centred, Über mich right; 32px from the top. At 640px and below the wordmark takes its own row and the three nav items sit beneath it, spread across the width.
- **Openers** are centred: display title, lede, then the drawing, with 96px top padding (56px on phones). The home hero uses 64px so the drawing's top lands in the first viewport.
- **Index** is a full-column list below the opener (48px gap on home, 80px elsewhere).
- **Post page:** centred header (title, then the meta row), optional drawing, then the left-aligned body at the 64ch measure, then the pager 96px below.
- **Footer:** 128px above, a 2px rule across the full column, credit left and caps links right.
- **Breakpoints:** 640px (edge, body size, masthead, opener padding, pager stacking, figure swap) and 760px (post rows collapse to two tracks).

## Elevation & Depth

Flat. There are no shadows, gradients or blur anywhere. Depth is suggested only by ink blocks sitting on the ground and by a slight rotation on three of them (wordmark -2deg, number stamp -2deg, placeholder tag -1.5deg), as if stuck onto the page.

### Named Rules
**The Flat Paper Rule.** Nothing floats. If a thing needs separation, use a 2px ink rule or an ink block, never a shadow or a lighter surface.

## Shapes

Square corners and hand-drawn lines. Ink blocks are hard rectangles. Rules are always 2px solid ink (`--rule`); hover underlines are 3px. The only rounded corners belong to code: inline code (3px) and code blocks (6px). Hand-drawn shapes are SVG paths with round caps and joins: the irregular placeholder frame (2.5px stroke, dash 14 7 4 7) and the read tick (3.5px stroke).

## Components

### Wordmark
A black block with knocked-out capitals, rotated -2deg: "yannicksblog" in Londrina 900 at 26px, padding 7px 10px 4px, ground-coloured text. Links home. Wobbles on hover and focus.

### Navigation
Three uppercase Londrina 400 links at 21px (20px on phones), no underline at rest. Hover and current page get a 3px underline at 0.2em offset; the current page is marked with `aria-current="page"`. Post pages mark their section as current.

### Post Index (signature)
A numbered list between 2px rules: a top rule on the list and a rule under every row.
- **Row:** three tracks (9ch, flexible, auto) on baseline: "Nr. 14" label at 20px, the title in display `title` size, and the meta at the right in small mute text (section label when the list mixes sections, date, and "Platzhalter" for placeholder posts). Row padding 20px vertical.
- **Hover:** the title wobbles and takes a 3px underline at 0.12em offset.
- **Read state:** a hand-drawn ink tick follows the title of any post the reader has opened before, plus a hidden "(gelesen)" for screen readers. Read state is stored only in the reader's browser (`localStorage` key `yb-read`) and is never shown on the post currently open.
- **Year groups:** a caps year head (24px) appears when posts span more than one year or the list exceeds 12 posts.
- **Empty:** one centred caps line (26px) between two rules.
- **At 760px and below:** two tracks (6ch, flexible); meta drops under the title, left-aligned.

### Drawing Slot (signature)
A centred frame at one of three widths: hero (760px), medium (560px), small (320px), with a set aspect ratio. When the drawing file exists it shows as a plain image (hero capped at 40vh) that wobbles on hover. Until then it shows the hand-drawn dashed ink frame with a caps head "Hier kommt eine Zeichnung", a sentence describing what belongs there, and the expected file path in small mute text; the whole slot is announced as a placeholder image.

### Number Stamp
On the post page the meta row (caps, 20px, centred, 24px gaps) holds "Nr. 14" as a small ink block rotated -2deg, followed by the section link, the long date and the reading time. It sits below the title.

### Placeholder Tag
Marks placeholder content honestly: a small ink block "Platzhalter" in Londrina 400 at 17px, rotated -1.5deg, leading a mute-coloured note.

### Prose
Paragraphs 24px apart; `h2` in section-head style 56px above; bold underlined links; lists indented 24px; blockquotes as centred uppercase pull quotes with 48px around; a 2px ink rule for `hr`; inline code on a 10% ink tint; code blocks as ink blocks with ground-coloured text at 15px.

### Figure Plate
Illustrations and charts are inline SVG drawn in `currentColor`, so they print in ink on either ground. Each figure is numbered in order: the caption starts with "Abb. n" in Londrina caps, followed by the caption in small mute text. A figure may ship a narrow variant (`-schmal`) that replaces the wide one at 640px and below so labels stay legible.

### Pager
Two columns under a 2px rule, 96px below the article: older post left, newer right-aligned. Each side is a mute caps label ("Vorheriger · Nr. 13") over the title in display `title` size, max 22ch. Hover wobbles and underlines the title. At the ends, the missing side is a mute caps sentence. Stacks into one left-aligned column on phones.

### Focus and Skip Link
Every focusable element gets a 3px ink outline at 4px offset. The skip link is an ink block that drops in at the top-left on focus.

### Motion
One gesture: a 420ms ease-in-out wobble (rotate to -1.6deg, then 1.1deg, then back) on drawings, the wordmark, index titles and pager titles when hovered or focused through their link. It runs only under `prefers-reduced-motion: no-preference` and never on load.

## Do's and Don'ts

### Do:
- **Do** set the page ground by section with one attribute on the root element (`data-ground="butter"` for Projekte), and read colours only through `--ground`, `--mute` and `--ink`.
- **Do** separate things with 2px ink rules and space on the 8px module.
- **Do** give every post its number ("Nr. 14") in the index, on the post page and in the pager.
- **Do** draw figures and diagrams in `currentColor` so they follow the ink.
- **Do** keep a drawing placeholder visible, and say what belongs there, until the owner supplies the drawing.
- **Do** keep the wobble small, on hover and focus only, and switched off for reduced motion.

### Don't:
- **Don't** introduce white or tinted cards, a second accent colour, gradients or shadows.
- **Don't** use icon fonts or glyph icons; marks are hand-drawn SVG in ink.
- **Don't** set running text in the display face or titles in the sans.
- **Don't** round corners outside code.
- **Don't** animate anything on page load.
