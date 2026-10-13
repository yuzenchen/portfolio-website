---
name: yuzen.tw
description: A one-person technical services site for Taiwanese e-commerce owners, set as a dark terminal with one mint accent.
colors:
  ground: "#0d1117"
  panel: "#151b23"
  panel-alpha: "rgba(21, 27, 35, 0.85)"
  panel-soft: "rgba(21, 27, 35, 0.6)"
  image-well: "#141b24"
  hatch-stripe: "#1d2631"
  rule: "#232b36"
  rule-dashed: "#2a3542"
  rule-strong: "#3a4a5c"
  ink: "#e6edf3"
  ink-soft: "#c3ccd6"
  ink-muted: "#8b96a5"
  ink-faint: "#808a99"
  mint: "#45d6a8"
  mint-deep: "#1d5c47"
  mint-wash: "rgba(69, 214, 168, 0.12)"
  danger: "#ff8080"
  danger-line: "#d64545"
  diagram-blue: "#3d9be9"
typography:
  display:
    fontFamily: "Noto Sans TC, system-ui, sans-serif"
    fontSize: "clamp(40px, 5.2vw, 60px)"
    fontWeight: 900
    lineHeight: 1.16
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Noto Sans TC, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 900
  title:
    fontFamily: "Noto Sans TC, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 900
  body:
    fontFamily: "Noto Sans TC, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.8
  body-sm:
    fontFamily: "Noto Sans TC, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
  numeral:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "clamp(24px, 2.4vw, 34px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  section-numeral:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "60px"
    fontWeight: 600
    lineHeight: 1
rounded:
  logo: "8px"
  field: "10px"
  image: "16px"
  card: "18px"
  cta-card: "22px"
  pill: "999px"
spacing:
  grid-gap: "16px"
  gutter-sm: "22px"
  panel-pad: "28px"
  gutter: "48px"
  page-max: "1100px"
components:
  button-primary:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ground}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-dashed:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-outline-mint:
    backgroundColor: "transparent"
    textColor: "{colors.mint}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-outline-mint-hover:
    backgroundColor: "{colors.mint-wash}"
  chip:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "6px 13px"
  chip-accent:
    backgroundColor: "{colors.panel-alpha}"
    textColor: "{colors.mint}"
    rounded: "{rounded.pill}"
    padding: "6px 13px"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.card}"
    padding: "28px"
  input:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "11px 13px"
  race-station:
    backgroundColor: "transparent"
    textColor: "{colors.ink-faint}"
    rounded: "{rounded.field}"
    padding: "6px 8px"
    height: "46px"
  race-station-auto-done:
    backgroundColor: "{colors.mint-wash}"
    textColor: "{colors.mint}"
  race-station-manual-done:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-soft}"
---

# Design System: yuzen.tw

## Overview

**Creative North Star: "The Night-Shift Terminal"**

The site reads like a terminal left running after hours: near-black ground, slate panels, mono labels and timing digits, and one mint accent that lights up only where something is finished or can be acted on. It is dense the way a console is dense: thin rules, small mono captions, tabular numbers. The Chinese headlines carry the weight in Noto Sans TC Black. The playfulness is small and physical: the screenshot tilts a degree, the Q and stamp pills tilt two, section numbers are outlined, and primary pills cast a hard mint shadow.

The world is dark by commitment. The palette in `src/styles/tokens.css` is the brand, and there is no light theme. Depth comes from tone and rules, not soft shadows. Dashed rules mean waiting, unfinished, or parallel; solid rules mean settled. The signature component is the hero race track. One real reconciliation runs as two lanes, manual in greys with hatched slow steps and automated in mint with an arrival rule. The service rows reuse the same panel and dashed dividers, so the page reads as one material.

The YZ hexagon logo (`/logo.png`, 42px in the nav) is the only brand mark. Nothing on the site uses emoji. Typographic arrows such as → and ↗ are part of the voice.

**Key Characteristics:**
- Near-black ground (#0d1117), slate panels, a single mint accent.
- Two families: Noto Sans TC for language, IBM Plex Mono for labels, prompts, and numbers.
- Tonal layering and 1px rules instead of ambient shadows.
- Pills for every action and tag; 18px cards; 10px fields and stations.
- Dashed versus solid rules carry meaning: pending versus done.
- Motion is time-lapse and print-in, and it always resolves to a static finished state with no JS or with reduced motion.

## Colors

The palette is a cool blue-black terminal with one saturated mint accent and a red reserved for errors.

### Primary
- **Terminal Mint** (`mint`): the only accent. It fills the primary pills, the nav contact pill, the Q marks, and the stamps. It outlines replay, status, and tech-stack chips. It colours the prompt line, the hero highlight words, the outlined section numerals, focus outlines, the text selection, and the caret. Inside the race track it marks the automated lane and every finished automated step.
- **Deep Mint** (`mint-deep`): used only as the hard offset shadow under mint primary pills.
- **Mint Wash** (`mint-wash`): the fill of a finished automated station and the hover fill of mint-outlined buttons.

### Neutral
- **Night Ground** (`ground`): the page background. It also fills inputs and chips (they sit "below" the panel), the scrollbar track, and the text on mint fills.
- **Slate Panel** (`panel`): race track, service rows, booking dialog, notifications, play badge. `panel-alpha` (85%) is used for the case, other-work, and FAQ cards. `panel-soft` (60%) is used for the contact card.
- **Image Well** (`image-well`): sits behind screenshots and thumbnails while they load.
- **Hatch Stripe** (`hatch-stripe`): the second stripe of the manual lane's -45deg hatch, alternating 8px with the panel colour.
- **Hairline** (`rule`): the default 1px border on every card, image, chip, and field, and the horizontal rules.
- **Dashed Rule** (`rule-dashed`): dashed lane and service-row dividers, pending stations, service chips, the offset frame behind the case screenshot.
- **Strong Rule** (`rule-strong`): hover border, the dashed secondary pill, manual stations once they are worked, the scrollbar thumb.
- **Ink** (`ink`): headlines and primary text. **Soft Ink** (`ink-soft`): chip text, the manual lane clock, finished manual steps. **Muted Ink** (`ink-muted`): body copy, descriptions, nav links, form labels. **Faint Ink** (`ink-faint`): section notes, captions, footer, idle stations. It was raised to #808a99 to clear 4.5:1 on the panel; do not darken it again.

### Tertiary
- **Error Rose** (`danger`) with **Error Line** (`danger-line`): field-level error text and invalid field borders, the form status box, and the error notification. They appear nowhere else.
- **Diagram Blue** (`diagram-blue`): used only inside the two FAQ explainer SVGs, as the second actor colour beside mint. It sits with the explainer palette in tokens.css (`--an-*`, including `--an-red` #e5484d and LINE green #06c755). That palette never appears in page chrome.

### Named Rules
**The Mint Means Done Rule.** Inside the race track and any future process or lane diagram, mint marks the automated or finished state and nothing else. Manual and in-progress work stays in the greys. Elsewhere mint is the one action colour. A second accent hue never appears outside the explainers.

**The Dark Commitment Rule.** No light theme and no light sections. Every surface sits on Night Ground or a Slate Panel.

## Typography

**Display Font:** Noto Sans TC (with system-ui, sans-serif), loaded at weights 400, 500, 700, and 900.
**Label/Mono Font:** IBM Plex Mono (with monospace), loaded at weights 400, 500, and 600.

**Character:** A heavy, plain-spoken CJK sans does the talking, and a quiet mono does the measuring. Mono carries no sentence-length copy except short captions.

### Hierarchy
- **Display** (900, clamp(40px, 5.2vw, 60px), 1.16; 38px with 1.28 line height on phones): the hero headline only. It is set with explicit line breaks so "80% 作業時間" never splits, and its key words are coloured mint.
- **Headline** (900, 30px): section titles beside the outlined numeral. The contact card uses 34px and the booking dialog 24px.
- **Title** (900, 22–26px): service names (22px), the case title (26px), FAQ questions (20px, 17px on phones, 1.55 line height), other-work titles (18px).
- **Body** (400, 15px, 1.8): hero and case lead copy in Muted Ink. Service descriptions are 14.5px with 1.85 line height and a 60ch maximum; secondary copy is 13.5–14px. Chinese text uses `word-break: keep-all` where a clause would strand its tail.
- **Label** (mono 400–500, 12–13px): nav, the prompt line, section notes, form labels, chips, captions, the footer.
- **Numeral** (mono 600, clamp(24px, 2.4vw, 34px), tabular figures, -0.02em; 26px when the race folds): race clocks. The clock reserves 11ch, the width of its longest mid-run reading "1 hr 59 min", so the stations never shift while it counts. The race facts use mono 600 at 15px with tabular figures.
- **Section Numeral** (mono 600, 60px; 44px on phones): transparent fill with a 1.5px mint text stroke. This is "01" to "05" ahead of each section title.

### Named Rules
**The Measured-in-Mono Rule.** Times, counts, and prompts are set in IBM Plex Mono with tabular figures. Claims and explanations are set in Noto Sans TC.

## Layout

The page is one centred column with a maximum width of 1100px and 48px side gutters (22px at 768px and below). The page has one breakpoint, 768px. The race alone folds earlier, at 960px, into name and clock over a five-segment bar, because below that width five full station names no longer fit their boxes. Station labels break only at spaces (word-break: keep-all). Sections stack vertically with about 50–60px of top padding and open with a baseline-aligned head: outlined numeral, title, mono note. Section heads sit 44px above their content.

The hero is a two-column grid: the headline column and a 260–330px side column holding the description and both actions, aligned to the bottom. The full-width race track sits under it. Each lane is a three-column grid: a 56px name, five equal stations at a 10px gap, and a 150px clock. On phones each lane folds to the name and clock over a five-segment 8px bar, with the current station named in mono underneath. Station labels stay available to screen readers.

Services are one panel holding rows, not cards. Each row is a grid with a 220px title on the left and the description over chip stations on the right, and rows are divided by dashed rules. On phones the row collapses to a single column. The case is a flex row: a screenshot at 42% width beside the body. On phones it becomes one column, reordered so the gallery opens after the points. Cards and FAQ items stack at a 16px gap. Every interactive target is at least 44px tall.

## Elevation & Depth

The system is flat and tonal. Ground, Slate Panel, and the translucent panels make the layers, and 1px Hairline borders define the edges. There are no ambient or blurred shadows. The only shadow is a hard offset under mint primary pills, a native device of this world. Overlays (lightbox, booking dialog) dim the page with a blue-black backdrop rather than lifting the surface.

### Shadow Vocabulary
- **Hard Mint Offset** (`box-shadow: 4px 4px 0 #1d5c47`): mint primary pills only (the hero "查看案例" and the contact and booking submit buttons).
- **Dialog Backdrop** (`rgba(5, 8, 12, 0.72)`; the lightbox uses 0.86): dims the page behind modals.

### Named Rules
**The One Shadow Rule.** The hard mint offset belongs only to filled mint pills. Cards, panels, images, and dialogs never cast shadows.

## Shapes

Shapes are rounded but not soft. Every button, chip, tag, status badge, and stamp is a full pill (999px). Content cards use an 18px radius, images and explainer diagrams 16px, and the contact card and booking panel 22px. Fields, race stations, thumbnails, notifications, and the lightbox image share 10px. The hexagonal logo is the one non-rectilinear mark. Borders are 1px solid by default. Dashed 1.5px borders mark the secondary pill, the contact card and booking panel (in mint), and the offset frame that sits 12px behind the case screenshot. Small tilts are part of the form language: the screenshot sits at -1.2deg, and the Q pill and stamps at -2deg.

## Components

### Buttons
- **Shape:** full pill (999px).
- **Primary:** Terminal Mint fill, Night Ground text, 700 at 15px, 14px 28px padding, Hard Mint Offset. As a `<button>` it brightens on hover (`brightness(1.08)`) and drops to 0.55 opacity when disabled.
- **Dashed Secondary:** transparent, 1.5px dashed Strong Rule border, Ink text, same padding as the primary. It pairs with the primary in the hero.
- **Mint Outline:** a 1px mint border, mint mono 13px text, 44px tall, filled with Mint Wash on hover. Used for race replay.
- **Nav Contact:** mint pill in the nav, 600 weight, ending in "↗".
- **Text Action:** mono 13–14px in mint (case toggle with a rotating chevron, case link), or Faint Ink for cancel.
- **Focus:** every interactive element gets a 2px mint outline at a 2px offset.

### Chips
- **Style:** mono 11–13px pills with 6px 13px padding. Service chips use a Ground fill with a dashed-rule border and Soft Ink text. Tech chips use a translucent panel with a Hairline border.
- **Accent variant:** a mint border and mint text mark the Taiwan-specific integrations (LINE Pay, ECPay, and similar) only.
- **Status badge:** a mint outline pill with a 6px mint dot, used for the live "已上線營運中" status.

### Cards / Containers
- **Corner Style:** 18px (22px for the contact card and booking panel).
- **Background:** Slate Panel, or the 85% translucent panel.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px Hairline; the hover border is Strong Rule.
- **Internal Padding:** 28px (22px on phones); the FAQ uses 28px 26px.

### Inputs / Fields
- **Style:** Ground fill, 1px Hairline, 10px radius, 11px 13px padding, Noto Sans TC 14px, a mint caret, labels in mono 12px Muted Ink above.
- **Focus:** the border turns mint, with a 2px mint outline at a 1px offset on keyboard focus.
- **Error:** `aria-invalid` turns the border Error Line. A field-level message in Error Rose at 12.5px sits directly under the field. A bordered status box above the actions handles send failures. Errors are never colour-only; they always come with text.

### Navigation
The YZ logo (42px) sits left. On the right are lowercase mono links (13px, Muted Ink, 26px gap, 44px targets), and the last link is the mint contact pill. On phones the gap is 16px and the text 12px. The nav has no background and no sticky bar.

### Race Track (signature)
One Slate Panel holds two lanes: manual (greys) and automated (mint). Each lane has five stations, a mono clock, and a facts footer. Idle stations are dashed with Faint Ink. A worked manual station turns solid Strong Rule with a -45deg hatch, and the active one crawls (`grind`, 0.9s linear). The slow manual steps stay hatched in the finished state. Automated stations go solid mint with a Mint Wash fill. When the automated lane lands, a 2px solid mint rule draws in under its stations (scaleX, 0.55s, `cubic-bezier(0.16, 1, 0.3, 1)`). The time-lapse plays on scroll-in at the real 6:1 ratio (50ms per reconciliation minute) and can be replayed. The server-rendered markup is the finished race, so no-JS and reduced-motion visitors see the result.

### Service Rows
These are three rows on one panel, separated by dashed rules. Each row has a heavy title, a muted description, and parallel chip stations with no connectors. They share the race track's material.

### Case Study
A translucent card holds a tilted screenshot over its dashed offset frame, next to the title, status badge, lead, and a "我做了什麼" disclosure. The disclosure opens with a grid-row 0fr→1fr reveal (0.6s, `cubic-bezier(0.22, 0.61, 0.36, 1)`), and its points and backend thumbnails print in on a shared stagger (`printLine`, 0.06s + i × 0.07s). Thumbnails open a lightbox.

### FAQ Explainers
The FAQ explainers are inline SVG diagrams authored at 1280×720 in a viewBox, framed with a Hairline border and a 16px radius. They use the scoped explainer palette. On desktop they loop. At 768px and below they stay still until tapped: a translucent scrim sits over the diagram with a 56px panel badge (1.5px mint ring, play triangle), and a tap plays the timeline once. With reduced motion the diagrams never play and no badge appears.

### Booking Dialog
A native `<dialog>` holds a Slate Panel with a 1.5px dashed mint border and a 22px radius. A 44px close icon sits top right. It contains a two-column field grid (one column on phones) and a centred row with the primary submit and a mono cancel.

### Icons
Icons are inline SVG on a 16-unit viewBox at 16–18px, `stroke="currentColor"`, stroke width 1.75, with round caps and joins. The set covers close, chevron, and play. There is no icon font and no glyph-as-icon in page chrome.

## Do's and Don'ts

### Do:
- **Do** keep every surface on Night Ground (#0d1117) or Slate Panel (#151b23), and add depth with 1px Hairline borders, not shadows.
- **Do** reserve mint for automated or finished states inside process diagrams. Elsewhere use it as the single action colour; manual and pending states stay grey.
- **Do** use dashed rules for pending or parallel items and solid rules for settled ones.
- **Do** set times, counts, and prompts in IBM Plex Mono with tabular figures, and headlines in Noto Sans TC 900.
- **Do** make every action and tag a full pill, and give filled mint pills the 4px 4px 0 Deep Mint offset.
- **Do** draw icons as inline SVG at stroke 1.75 with currentColor.
- **Do** render the finished state on the server so animations degrade to a correct still under reduced motion or without JS. On phones, explainer motion plays only on tap.
- **Do** show form errors at the field, in Error Rose text with an Error Line border, and keep targets at least 44px.
- **Do** keep the YZ hexagon logo as the only brand mark.

### Don't:
- **Don't** use emoji anywhere. The smoke test fails on them; typographic arrows (→ ↗) are fine.
- **Don't** introduce a light theme, light section, or second accent hue in page chrome. The explainer palette stays inside the explainers.
- **Don't** put shadows on cards, panels, images, or dialogs, or use a soft blurred shadow anywhere.
- **Don't** use mint for manual, waiting, or failing states. Errors are Error Rose, and progress is grey.
- **Don't** darken Faint Ink below #808a99; it is the contrast floor for captions on the panel.
- **Don't** use icon fonts, `<img>` icons, or text glyphs as icons in page chrome.
