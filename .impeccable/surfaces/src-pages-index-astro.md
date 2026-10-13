---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

# Home page

Scope: the single-page home route (`src/pages/index.astro`). Visitor mode: Persuade.

Audience and job: Taiwanese small e-commerce owners, mostly non-technical, deciding whether Yuzen can be trusted with their systems. Success is trust; booking and mail are the follow-on channels.

Proof: Wama' House real numbers only (0 manual interventions, one-click 7-11 waybill, reconciliation 2 hr to 20 min). The 80% headline stays by owner's choice; it is an estimate and must never be presented as measured.

Constraints: the dark terminal palette in `src/styles/tokens.css`, the YZ logo, no emoji anywhere, phone FAQ animations play only on tap, static site with Formspree.

## Direction contract

THESIS: The page is a race. One Wama' House reconciliation runs two lanes, by hand and automated, every station a reconciliation step, and the visitor watches the automated lane finish while the manual one is still grinding. It refuses the category default of a headline over three service cards.

OWN-WORLD: Near-black ground, panel slate, one mint accent that only ever means "automated / done". Lanes are long horizontal panels with five stations; mono timing digits; dashed rules for waiting, solid mint for finished, with a mint rule drawn under the automated lane as its arrival beat; the manual lane's slow steps stay hatched in the finished still. Pill buttons with the hard mint shadow.

STORY: The visitor sees the 80% claim, then watches real Wama' House timing prove the mechanism, reads what each automation replaced in the live system, scans the three services as rows on the same panel material, clears the two FAQ doubts, and books.

FIRST VIEWPORT: Prompt line and the 80% headline top left, set on three fixed lines so "80% 作業時間" never splits at display size (two lines only fit by shrinking the display), description and both actions top right. Full-width race track below with manual and automated lanes, clocks at the right end landing on 2 hr and 20 min, the three real figures under it. Primary action "查看案例" top right, booking stays in nav.

FORM: Two-lane race track, position 4 of 7 on the grounded list. Signature interaction: time-lapse race on scroll-in at a true 6:1 ratio, replayable. seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
