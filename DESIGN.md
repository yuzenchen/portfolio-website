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
    fontSize: "clamp(26px, 8.5vw, 52px)"
    fontWeight: 900
    lineHeight: 1.25
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
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  result-numeral:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "56px"
    fontWeight: 600
    lineHeight: 1
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
  text-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    height: "44px"
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
  race-segment:
    backgroundColor: "{colors.rule}"
    rounded: "{rounded.pill}"
    height: "10px"
  race-segment-auto-done:
    backgroundColor: "{colors.mint}"
  race-segment-manual-done:
    backgroundColor: "{colors.rule-strong}"
  result-card:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.card}"
    padding: "28px"
  process-marker:
    backgroundColor: "{colors.mint}"
    rounded: "{rounded.pill}"
    size: "14px"
---

# Design System: yuzen.tw

## Overview

**Creative North Star: "The Night-Shift Terminal"**

The site reads like a terminal left running after hours: near-black ground, slate panels, mono labels and timing digits, and one mint accent that lights up only where something is finished or can be acted on. It is dense the way a console is dense: thin rules, small mono captions, tabular numbers. The Chinese headlines carry the weight in Noto Sans TC Black. The playfulness is small and physical: the Q and stamp pills tilt two degrees, section numbers are outlined, and primary pills cast a hard mint shadow.

The world is dark by commitment. The palette in `src/styles/tokens.css` is the brand, and there is no light theme. Depth comes from tone and rules, not soft shadows. Dashed rules mean waiting, unfinished, or parallel; solid rules mean settled. The signature component is the compact race panel in the hero's right column. One real reconciliation runs as two lanes, manual in greys with hatched slow segments and automated in mint with an arrival rule. The results row, case bento, service rows and process track reuse the same panel, hairlines and dashed tracks, so the page reads as one material. The earlier version's 80% headline, terminal prompt, typing animation and tech-stack section are gone; the stack now folds away in the footer.

The YZ hexagon logo (`/logo.png`, 42px in the nav) is the only brand mark. The share image `public/og.png` (1200×630) is rendered from `scripts/og/og.html` with `npm run og` and must be regenerated when the hero copy changes. Nothing on the site uses emoji. Typographic arrows such as → and ↗ are part of the voice.

**Key Characteristics:**
- Near-black ground (#0d1117), slate panels, a single mint accent.
- Two families: Noto Sans TC for language, IBM Plex Mono for labels, taglines, and numbers.
- Tonal layering and 1px rules instead of ambient shadows.
- Pills for every action, tag, and race segment; 18px cards; 10px fields.
- Dashed versus solid rules carry meaning: pending versus done.
- Motion is time-lapse and count-down, and it always resolves to a static finished state with no JS or with reduced motion.

## Colors

The palette is a cool blue-black terminal with one saturated mint accent and a red reserved for errors.

### Primary
- **Terminal Mint** (`mint`): the only accent. It fills the primary pills, the nav contact pill, the Q marks, the stamps, and the process markers. It outlines replay, status, and accent chips. It colours the nav tagline, the hero's second headline line, the result numerals, the bento icons, the 現在 labels, the outlined section numerals, focus outlines, the text selection, and the caret. Inside the race panel it marks the automated lane and every finished automated segment.
- **Deep Mint** (`mint-deep`): used only as the hard offset shadow under mint primary pills.
- **Mint Wash** (`mint-wash`): the hover fill of mint-outlined buttons.

### Neutral
- **Night Ground** (`ground`): the page background. It also fills inputs and chips (they sit "below" the panel), the scrollbar track, and the text on mint fills.
- **Slate Panel** (`panel`): race panel, result cards, bento cards, service rows, process panel, booking dialog, notifications, play badge. `panel-alpha` (85%) is used for the other-work and FAQ cards. `panel-soft` (60%) is used for the contact card.
- **Image Well** (`image-well`): sits behind screenshots and thumbnails while they load.
- **Hatch Stripe** (`hatch-stripe`): the second stripe of the manual lane's -45deg hatch on its slow segments, alternating 8px with the panel colour.
- **Hairline** (`rule`): the default 1px border on every card, image, chip, and field, the rule between race lanes, the marquee and footer rules, and idle race segments.
- **Dashed Rule** (`rule-dashed`): dashed service-row dividers and service chips.
- **Strong Rule** (`rule-strong`): hover border, the hero text link's underline, worked manual segments, the dashed process track, the scrollbar thumb.
- **Ink** (`ink`): headlines and primary text. **Soft Ink** (`ink-soft`): hero and case lead copy, nav links, chip text, the manual lane clock, finished steps, 原本 text. **Muted Ink** (`ink-muted`): descriptions, race captions, result labels, form labels, the footer summary. **Faint Ink** (`ink-faint`): section notes, captions, the footer copyright. It was raised to #808a99 to clear 4.5:1 on the panel; do not darken it again.

### Tertiary
- **Error Rose** (`danger`) with **Error Line** (`danger-line`): field-level error text and invalid field borders, the form status box, and the error notification. They appear nowhere else.
- **Diagram Blue** (`diagram-blue`): used only inside the two FAQ explainer SVGs, as the second actor colour beside mint. It sits with the explainer palette in tokens.css (`--an-*`, including `--an-red` #e5484d and LINE green #06c755). That palette never appears in page chrome.

### Named Rules
**The Mint Means Done Rule.** Inside the race panel, the process track, and any future lane diagram, mint marks the automated or finished state and nothing else. Manual and in-progress work stays in the greys. Elsewhere mint is the one action colour. A second accent hue never appears outside the explainers.

**The Dark Commitment Rule.** No light theme and no light sections. Every surface sits on Night Ground or a Slate Panel.

## Typography

**Display Font:** Noto Sans TC (with system-ui, sans-serif), loaded at weights 400, 500, 700, and 900.
**Label/Mono Font:** IBM Plex Mono (with monospace), loaded at weights 400, 500, and 600.

**Character:** A heavy, plain-spoken CJK sans does the talking, and a quiet mono does the measuring. Mono carries no sentence-length copy except short captions.

### Hierarchy
- **Display** (900, 1.25 line height): the hero headline only, two ten-glyph lines (員工每天重複做的事， / 交給系統自動完成。), each a block that never wraps inside itself; the second line is mint. Below 1024px it tracks the viewport (clamp(26px, 8.5vw, 52px)); from 1024px it sizes from the copy column (clamp(40px, …, 52px)).
- **Headline** (900, 30px): section titles beside the outlined numeral. The contact card uses 34px and the booking dialog 24px.
- **Title** (700–900, 18–26px): service names (22px), the case title (26px), bento card titles (700, 22px), process step titles (700, 18px), FAQ questions (20px, 17px on phones, 1.55 line height), other-work titles (18px).
- **Body** (400, 15–17px, 1.8): the hero description and case lead at 17px in Soft Ink; bento and 原本/現在 text at 15px. Service descriptions are 14.5px with 1.85 line height and a 60ch maximum; secondary copy is 13.5–14px. Chinese text uses `word-break: keep-all` where a clause would strand its tail.
- **Label** (mono 400–500, 12–13px): the nav tagline, race captions, section notes, 原本/現在 labels, process step numbers, form labels, chips, captions, the footer.
- **Numeral** (mono 600, 30px, tabular figures, -0.02em): the race clocks. They are static and read 2 小時 and 20 分鐘; the unit is set in Noto Sans TC 500 at 20px beside the mono number, so there is no monospace gap.
- **Result Numeral** (mono 600, 56px, tabular figures, mint): the result-card figures, with the unit in mono 22px Ink and the old value (120 →) in Muted Ink.
- **Section Numeral** (mono 600, 60px; 44px on phones): transparent fill with a 1.5px mint text stroke. This is "01" to "06" ahead of each section title (case, services, process, about, FAQ, and the contact stamp).

### Named Rules
**The Measured-in-Mono Rule.** Times, counts, and step numbers are set in IBM Plex Mono with tabular figures. Claims and explanations are set in Noto Sans TC.

## Layout

The page is one centred column with a maximum width of 1100px and 48px side gutters (22px at 768px and below). The nav uses the same column, so the brand lines up with the h1 and the contact pill with the race panel's right edge. Three breakpoints are in use: 1024px (the hero is two columns from 1024px up; the case bento's top row stacks at 1024px and below), 900px (the process track turns into a vertical timeline), and 768px (phones). Sections stack vertically with about 50–60px of top padding and open with a baseline-aligned head: outlined numeral, title, mono note. Section heads sit 44px above their content.

The hero is a two-column grid (1.15fr copy, 0.85fr race with a 360px floor, 48px gap, centred vertically). The copy column holds the two-line headline, the description, and the actions; the right column holds the compact race panel. Below 1024px the grid is one column and the race sits 32px under the actions. Inside the race each lane is a stack: name and clock on one baseline row, a five-segment bar (6px gap), and the step list, which wraps between steps, never inside one.

The results row sits under the hero: three equal cards at a 16px gap, one column on phones. The marquee band follows. The case is a bento: a top row of the Dashboard screenshot (2fr) beside the reconciliation card (1fr), and a bottom row of three (shipping card, roles card, the two side screenshots). At 1024px and below the top row stacks and the bottom row pairs the two text cards over the full-width side shots; on phones everything is one column. Services are one panel holding rows, not cards: a 220px title on the left, the description over chip stations on the right, rows divided by dashed rules, one column on phones. The process is one panel with four steps on a horizontal track; at 900px and below it becomes a vertical timeline with a 24px marker column. Cards and FAQ items stack at a 16px gap. Every interactive target is at least 44px tall.

## Elevation & Depth

The system is flat and tonal. Ground, Slate Panel, and the translucent panels make the layers, and 1px Hairline borders define the edges. There are no ambient or blurred shadows. The only shadow is a hard offset under mint primary pills, a native device of this world. Overlays (lightbox, booking dialog) dim the page with a blue-black backdrop rather than lifting the surface.

### Shadow Vocabulary
- **Hard Mint Offset** (`box-shadow: 4px 4px 0 #1d5c47`): mint primary pills only (the hero and contact "免費諮詢 15 分鐘", the process "預約諮詢", and the booking submit button).
- **Dialog Backdrop** (`rgba(5, 8, 12, 0.72)`; the lightbox uses 0.86): dims the page behind modals.

### Named Rules
**The One Shadow Rule.** The hard mint offset belongs only to filled mint pills. Cards, panels, images, and dialogs never cast shadows.

## Shapes

Shapes are rounded but not soft. Every button, chip, tag, status badge, stamp, and race segment is a full pill (999px); process markers are 14px circles. Content cards (race, results, bento, process) use an 18px radius, images, screenshots and explainer diagrams 16px, and the contact card and booking panel 22px. Fields, thumbnails, notifications, and the lightbox image share 10px. The hexagonal logo is the one non-rectilinear mark. Borders are 1px solid by default. Dashed 1.5px borders mark the contact card and booking panel (in mint); a 2px dashed Strong Rule draws the process track. Small tilts are part of the form language: the Q pill and stamps sit at -2deg.

## Components

### Buttons
- **Shape:** full pill (999px).
- **Primary:** Terminal Mint fill, Night Ground text, 700 at 15px, 14px 28px padding, Hard Mint Offset. The hero "免費諮詢 15 分鐘", the contact pill, and the process "預約諮詢" (10px 20px, 14px) carry `data-booking` and open the booking dialog. As a `<button>` it brightens on hover (`brightness(1.08)`) and drops to 0.55 opacity when disabled.
- **Text Link:** the hero's secondary action "看實際案例 →": Ink text at 16px, 44px tall, a 1px Strong Rule underline that turns mint on hover and focus.
- **Mint Outline:** a 1px mint border, mint mono 13px text, 44px tall, filled with Mint Wash on hover. Used for race replay.
- **Nav Contact:** mint pill in the nav, mono 600 at 13px, reading "聯絡我".
- **Text Action:** mono 13–14px in mint (case link), or Faint Ink for cancel.
- **Focus:** every interactive element gets a 2px mint outline at a 2px offset.

### Chips
- **Style:** mono 11–13px pills with 6px 13px padding. Service chips use a Ground fill with a dashed-rule border and Soft Ink text. There are no tech chips; the stack is a plain list in the footer.
- **Accent variant:** a mint border and mint text mark the Taiwan-specific integrations (LINE Pay, ECPay, and similar) only.
- **Status badge:** a mint outline pill with a 6px mint dot, used for the live "已上線營運中" status.

### Cards / Containers
- **Corner Style:** 18px (22px for the contact card and booking panel).
- **Background:** Slate Panel, or the 85% translucent panel (other work, FAQ).
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px Hairline; the hover border is Strong Rule. Bento cards also lift 2px on hover and focus-within (not under reduced motion).
- **Internal Padding:** 28px (22px on phones); the FAQ uses 28px 26px.

### Inputs / Fields
- **Style:** Ground fill, 1px Hairline, 10px radius, 11px 13px padding, Noto Sans TC 14px, a mint caret, labels in mono 12px Muted Ink above.
- **Focus:** the border turns mint, with a 2px mint outline at a 1px offset on keyboard focus.
- **Error:** `aria-invalid` turns the border Error Line. A field-level message in Error Rose at 12.5px sits directly under the field. A bordered status box above the actions handles send failures. Errors are never colour-only; they always come with text.

### Navigation
The nav sits in the page column (1100px, 48px gutters). On the left is the brand block: the YZ logo (42px) beside "Yuzen Chen" (Noto Sans TC 700, 16px, Ink) over the mono tagline "流程自動化 × 系統開發" (12px, mint). The links are Chinese (案例, 服務, 合作流程, 關於我, 常見問題; Noto Sans TC 15px, Soft Ink, 28px gap, 44px targets), pushed right, followed by the mint "聯絡我" pill. At 768px and below the brand and pill share the first row and the five links spread across a second row (16px gap). The nav is labelled 主選單, has no background, and is not sticky.

### Race Panel (signature)
A compact Slate Panel (18px radius, 28px padding, 22px on phones) in the hero's right column. Its head holds a three-line mono caption (每次對帳，兩種跑法 / Wama' House 實測 / 縮時：1 秒約 20 分鐘) and the Mint Outline "重跑一次" button, which always reserves its space and stays inert and invisible until a run completes, so the panel never resizes. Two lanes follow, divided by a Hairline: 人工處理 (greys) and 系統自動 (mint, bold name). Each lane has its name and a static clock (2 小時, 20 分鐘), a five-segment 10px pill bar, and the five-step list joined by → arrows. Worked manual segments turn Strong Rule; the active one is hatched and crawls (`grind`, 0.9s linear), and the two slow steps stay hatched in the finished state. Automated segments go solid mint. When the automated lane lands, a 2px mint rule draws in under its bar (scaleX, 0.55s, `cubic-bezier(0.16, 1, 0.3, 1)`). Only the bars and step lists play, on scroll-in, at the real 6:1 ratio (50ms per reconciliation minute); the clocks never count. The server-rendered markup is the finished race, so no-JS and reduced-motion visitors see the result.

### Results Row
Three Slate Panel cards right under the hero: 每次對帳 120 → 20 分鐘, 人工介入 0 次, 超商貨運單 1 鍵產出. A muted label sits over a 56px mint mono numeral and its unit. Only the first card animates: a 1.6s countdown from 120 to 20 on scroll-in. The markup holds the final figure and a screen-reader sentence, so no-JS and reduced-motion visitors read it as is.

### Marquee
A full-bleed band between two Hairlines carrying 對帳自動化, 訂單自動通知, 金流物流串接, 庫存即時同步, 異常自動通報, 上線後持續維護, separated by ✦, looping at 22s linear. It is `aria-hidden` and stops under reduced motion.

### Service Rows
These are three rows on one panel (流程自動化, 系統與網站開發, 技術顧問) under the heading 我能幫您做什麼, separated by dashed rules. Each row has a heavy title, a muted description, and parallel chip stations with no connectors. They share the race panel's material.

### Case Study
The case head (title, 已上線營運中 status badge, lead) sits over a bento of Slate Panel cards. Screenshot cards (營運 Dashboard large, 訂單 / 物流 and 庫存管理 small) are plain links to the image files marked `data-lightbox`, with a "點擊放大" hint and a label over each; they open the shared lightbox, and without JS the link still shows the image. The text cards carry a 28px mint stroke icon and a title (帳，系統自己對; 貨，一鍵就能出; 三種角色，一套系統). The first two hold a `<dl class="ba">` with a 原本 block (Muted label, Soft Ink text) and a 現在 block (mint label, Ink text); the third is a short paragraph. The other-work cards reuse the same 原本/現在 pairs. The live-site link follows the bento.

### Process Track
One Slate Panel, section 03 合作流程, holding four steps: 免費諮詢 15 分鐘 (with the "預約諮詢" primary pill), 需求訪談與流程圖, 開發與測試 (title only until the owner supplies its text), 上線與維護. On desktop the steps sit in four columns on a horizontal 2px dashed Strong Rule track running from the first marker's centre to the last; each 14px mint marker sits on the track with the mono step number, title and description below. At 900px and below it becomes a vertical timeline: a 24px marker column with a dashed line from each marker down to the next, and the text beside it.

### About
One Slate Panel (18px radius, 32px 28px padding; 22px 20px on phones), section 04 關於我. On desktop a two-column grid (240px, then the text, 48px gap): the 240px square headshot with a 1.5px Strong Rule border, 16px radius and the hard mint shadow, untilted and unfiltered, beside the bio. Two Soft Ink paragraphs (15.5px, 1.85 line height) lead into three highlights, each marked by an 8px mint square, with the label in bold Ink. Below a 1px dashed rule, a small 經歷 heading (15px, 700) heads the job rows: a 92px mono Faint Ink year column, then the title in Ink and the company in Muted Ink, with no literal separators. The foot line pairs the degree (13px Muted Ink) with the mint "完整經歷見 LinkedIn ↗" link (44px target, opens a new tab). At 768px and below it stacks into one column with a 140px photo on top.

### FAQ Explainers
The FAQ explainers are inline SVG diagrams authored at 1280×720 in a viewBox, framed with a Hairline border and a 16px radius. They use the scoped explainer palette. On desktop they loop. At 768px and below they stay still until tapped: a translucent scrim sits over the diagram with a 56px panel badge (1.5px mint ring, play triangle), and a tap plays the timeline once. With reduced motion the diagrams never play and no badge appears.

### Booking Dialog
Opened by any `data-booking` trigger (hero, process, contact). A native `<dialog>` holds a Slate Panel with a 1.5px dashed mint border and a 22px radius. A 44px close icon sits top right. It contains a two-column field grid (one column on phones) and a centred row with the primary submit and a mono cancel.

### Contact
A centred card on the 60% panel with a 1.5px dashed mint border and 22px radius, hung from the tilted "06 / 聯絡" stamp. It asks 公司裡有哪件事，每天都在重複做？, offers the "免費諮詢 15 分鐘" primary pill (`data-booking`), and lists mail@yuzen.tw underneath.

### Footer
A Hairline over a native `<details class="stack-details">` disclosure, "使用的技術" in mono 13px Muted Ink with a rotating chevron. Open, it shows a `<dl>` of four groups (開發, 台灣在地金物流, 部署, 品質) with a 130px mono label column (one column on phones) and the items in Soft Ink joined by middle dots. The copyright line sits below in Faint Ink.

### Icons
Icons are inline SVG with `stroke="currentColor"`, stroke width 1.75, and round caps and joins: a 16-unit viewBox at 14–18px for close, chevron, and play, and a 24-unit viewBox at 28px for the bento card icons. There is no icon font and no glyph-as-icon in page chrome.

## Do's and Don'ts

### Do:
- **Do** keep every surface on Night Ground (#0d1117) or Slate Panel (#151b23), and add depth with 1px Hairline borders, not shadows.
- **Do** reserve mint for automated or finished states inside process diagrams. Elsewhere use it as the single action colour; manual and pending states stay grey.
- **Do** use dashed rules for pending or parallel items and solid rules for settled ones.
- **Do** set times, counts, and step numbers in IBM Plex Mono with tabular figures, and headlines in Noto Sans TC 900.
- **Do** make every action and tag a full pill, and give filled mint pills the 4px 4px 0 Deep Mint offset.
- **Do** draw icons as inline SVG at stroke 1.75 with currentColor.
- **Do** render the finished state on the server so animations degrade to a correct still under reduced motion or without JS. On phones, explainer motion plays only on tap.
- **Do** regenerate `public/og.png` (1200×630) with `npm run og` whenever the hero copy changes.
- **Do** show form errors at the field, in Error Rose text with an Error Line border, and keep targets at least 44px.
- **Do** keep the YZ hexagon logo as the only brand mark.

### Don't:
- **Don't** use emoji anywhere. The smoke test fails on them; typographic arrows (→ ↗) are fine.
- **Don't** introduce a light theme, light section, or second accent hue in page chrome. The explainer palette stays inside the explainers.
- **Don't** put shadows on cards, panels, images, or dialogs, or use a soft blurred shadow anywhere.
- **Don't** bring back the 80% headline, the terminal prompt, the typing animation, or a separate tech-stack section; the stack lives in the footer disclosure.
- **Don't** use mint for manual, waiting, or failing states. Errors are Error Rose, and progress is grey.
- **Don't** darken Faint Ink below #808a99; it is the contrast floor for captions on the panel.
- **Don't** use icon fonts, `<img>` icons, or text glyphs as icons in page chrome.
