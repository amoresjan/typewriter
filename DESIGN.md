---
name: The Typewriter Times
description: A vintage newspaper-themed typing game — print authority meets neobrutalism.
colors:
  ink: "#0f0e0c"
  paper: "#faf8f4"
  ghost: "#f5f3ef"
  ash-border: "#e8e6e1"
  ash-muted: "#d4d2cd"
  attribution: "#6e6e6e"
  press-red: "#f87171"
typography:
  display:
    fontFamily: "'Manufacturing Consent', cursive"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "'Times New Roman', Times, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "'Times New Roman', Times, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.ghost}"
    textColor: "{colors.ink}"
  modal-surface:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "32px"
  toast:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
---

# Design System: The Typewriter Times

## 1. Overview: The Morning Press

**Creative North Star: "The Morning Press"**

A broadsheet printed before dawn, folded twice, placed on a cafe table still slightly cool from the press. The reader straightens it, finds the article, and begins. That is the physical scene this interface inhabits. Everything in this design system serves that moment: the weight of the masthead, the column of editorial type, the mechanical precision of keys pressed and letters committed.

This is not a typing app that looks like a newspaper. It is a newspaper that happens to be typed. The distinction matters: it means the design decisions flow from print-production logic, not screen-design convention. Column structure earns its grid. Ink weight earns its contrast. The neobrutalist component layer — hard-offset shadows, 2px borders, blocky buttons — is the press hall made literal. These elements behave like physical type blocks: flat at rest, pressing into the page when depressed, returning when released.

This system explicitly refuses: the gamer-coded typing-test aesthetic (Monkeytype/Typeracer dark mode, neon accents, HUD energy); the SaaS dashboard pattern (cards, progress rings, metric widgets, corporate blue-grey); Wordle-style flat pastels (any saturated non-red color shatters the newspaper illusion); the beige-neutral Figma/Notion register (clean but characterless, no point of view).

**Key Characteristics:**
- Print-black and newsprint-white as the total chromatic vocabulary, plus one error red
- Three typeface registers that never overlap: blackletter masthead / serif editorial / sans-serif UI
- Neobrutalism as a press-hall material language — hard offset shadows, 2px ink borders, no ornament
- The cursor blink is the only animation on the typing surface; everything else is still
- Stats recede into the masthead; the editorial copy is the stage

## 2. Colors: The Ink-and-Paper Palette

A monochromatic ink-and-paper palette with a single error signal. The color doctrine is that everything visible should be explainable by what a printing press can do with black ink on warm cream paper. Press-red is the only color with hue — and it appears only when something is wrong.

The codebase currently uses Tailwind's `black` and `white` (pure `#000000` / `#ffffff`). Migrate to the ink and paper tokens below: they read as identical at a glance but carry a trace of warmth that distinguishes this surface from a clinical screen.

### Primary
- **Ink** (`#0f0e0c`): The single dominant color. Masthead type, all borders, button fills, cursor block, modal imprint shadows. Near-black with a trace of warm chroma — ink on paper, not pixels on glass.

### Secondary
- **Press-red** (`#f87171`): Errors only. Incorrect letters, over-typed characters beyond word length. Nowhere else. Its rarity is its meaning.

### Neutral
- **Paper** (`#faf8f4`): The base surface — every background, modal, field, and page. Warm-tinted newsprint, not clinical white.
- **Ghost** (`#f5f3ef`): Secondary button hover state. One notch deeper than Paper; barely perceptible, but provides tactile response without breaking the palette.
- **Ash Border** (`#e8e6e1`): Structural dividers and column rules — the default border color. Warm-tinted rather than the cool gray-200 of screen-native systems.
- **Ash Muted** (`#d4d2cd`): Untyped text. Low-contrast, warm — a visual horizon the typist moves toward.
- **Attribution** (`#6e6e6e`): Secondary information: author names, source labels, meta text. Mid-warm-gray.

### Named Rules
**The One Ink Rule.** Ink (`#0f0e0c`) is used at full strength or not at all. No opacity tricks, no tinted decorative variants. Press-red is the sole chromatic signal, and it means one thing: wrong.

**The No-New-Hues Rule.** Never introduce a second accent color. No blue for links, no green for success, no amber for warnings. State and meaning are expressed through weight, position, and the existing two-color vocabulary.

## 3. Typography: Two Registers, One Voice

**Display Font:** "Manufacturing Consent" (cursive blackletter)
**Body Font:** "Times New Roman", Times, serif
**UI Font:** system-ui, -apple-system, BlinkMacSystemFont, sans-serif

**Character:** A three-tier typographic system where the tiers never touch. The Gothic blackletter commands the masthead. The serif editorial carries the reading experience — the typing content, the article headline. The system sans operates silently below both, handling everything functional: stats, buttons, labels, toast copy. A reader can tell at a glance which register a piece of text belongs to, and therefore what it is asking of them.

### Hierarchy
- **Display** (400, 3rem/48px, lh 1): Masthead only. "The Typewriter Times." Never used elsewhere.
- **Headline** (600, 1.5rem/24px, lh 1.25): Article title — the name of the piece being typed. Italic treatment optional for sourced content.
- **Body** (400, 1rem/16px, lh 1.625): Typing content. The editorial copy. Rendered in two newspaper columns (`column-count: 2`, `column-gap: 2rem`) with a 1px Ash Border column rule between them. `text-justify` for print-correct alignment. Times New Roman at its intended measure.
- **Label** (500, 0.875rem/14px, lh 1.25): WPM/accuracy stats, button text, author attribution, toast copy. System sans only. The functional layer.

### Named Rules
**The Two-Register Rule.** "Manufacturing Consent" is the masthead face. Never apply it to buttons, sub-headings, modal titles, toast titles, or any UI text. The moment it escapes the masthead, the newspaper illusion fractures and the interface reads as costume rather than character.

**The Stats Rule.** Live statistics (WPM, accuracy) are always set in label type (system-ui, 0.875rem, tabular-nums). Never bump them into a larger editorial or display style. Stats serve the session; content commands the stage.

## 4. Elevation: Press Keys

This system uses hard, flat-offset solid shadows exclusively. There are no blurred ambient shadows, no diffuse glows, no elevation through transparency or blur. The philosophy is the press-key model: a surface is flat at rest. When it becomes actionable on hover, it lifts 2px on the Y axis and acquires a hard imprint shadow below — as if a key is being depressed against resistance. When pressed (active state), it returns flush to the page. When released, it rises again.

Two values cover the entire system. The difference is the imprint depth, not the blur.

### Shadow Vocabulary
- **Key press** (`box-shadow: 2px 2px 0px 0px #0f0e0c`): The standard hover imprint for secondary buttons and interactive elements where the full ink weight should show. Tight, hard, structural — a stamp.
- **Key press, soft** (`box-shadow: 2px 2px 0px 0px rgba(0,0,0,0.5)`): Hover imprint for primary (ink-filled) buttons. Half-opacity prevents the shadow from reading as a double-border against the dark fill.
- **Surface imprint** (`box-shadow: 4px 4px 0px 0px #0f0e0c`): Applied to elevated surfaces — the modal, the toast. The heavier offset signals a surface lifted off the page. Never on flat resting elements.

### Named Rules
**The Flat-First Rule.** Elements are flat at rest. Shadows appear only as a response to state (hover, focus, elevation). Never apply a shadow to a static surface that does not change state.

**The Press-Key Rule.** Hard-offset imprints only. Two values: 2×2 for interactive, 4×4 for elevated surfaces. No blur radius. No spread. No ambient glow. If it looks like a drop shadow, redo it.

## 5. Components: The Press Hall

### Buttons (NeoButton)

Telegraph keys — satisfying and mechanical. Two variants (primary, secondary) sharing the same shape and motion. Both: 2px solid ink border, 6px rounded corners (`{rounded.sm}`), system-sans label (0.875rem, 500 weight), full-width within their container. The signature motion is a -2px Y-translate on hover with a simultaneous shadow imprint appearing below; on active, the element returns to rest (0 translate, no shadow). The press-then-release cycle mirrors a physical key.

- **Primary:** Ink fill (`{colors.ink}`) / Paper text. Hover: lift + soft press-key shadow.
- **Secondary:** Paper fill, Ink border, Ink text. Hover: Ghost fill (`{colors.ghost}`) + full press-key shadow.
- **Focus visible:** 2px Ink outline, 2px offset. Never invisible, never stylized.

### Typing Surface (Letter)

The most distinctive component in the system. Characters in the typing content are rendered as individual `<span>` elements with four mutually exclusive states:

- **Typed (correct):** Ink text (`{colors.ink}`) on Paper. No background. Weight unchanged from Body type.
- **Typed (incorrect):** Press-red (`{colors.press-red}`) background, Paper text. No underline needed — the red fills the glyph space.
- **Current (cursor):** Ink background, Paper text. 1s `step-end` blink animation — binary, no fade. At the end of a word, the cursor appears on the trailing space character.
- **Untyped:** Ash Muted text (`{colors.ash-muted}`). Low contrast, warm — the horizon.
- **Over-typed (extra characters):** Same as incorrect — Press-red background, Paper text.

Respect `prefers-reduced-motion`: pause the cursor blink animation, keep the background state (ink fill remains visible).

**The Typing Surface Rule.** The editorial field is untouchable. No overlapping chrome, no decorative borders, no background tinting of the content area. When unfocused, a 1.5px blur is applied to the entire content `<div>` — never to individual elements. The text and the cursor are the only things that live on this surface.

### Modal (GameCompletion)

The completion surface. Paper background, 2px Ink border, 8px rounded corners (`{rounded.md}`), surface-imprint shadow (4×4 Ink). The overlay behind it is `rgba(0,0,0,0.5)` with `backdrop-filter: blur(4px)` — the blur is applied to the overlay, not the modal; the modal itself is solid and opaque. Never introduce card nesting inside the modal.

The completion headline ("Congratulations!") uses the Display face (Manufacturing Consent) — this is the one UI surface besides the masthead where it appears, because game completion is an editorial event.

### Stat Display

No card, no border, no background. Bold 1.875rem (3xl) number in Ink, 0.875rem label in Attribution gray below. Set in system-sans with `tabular-nums`. Lives inline in the masthead meta row at right-aligned position; also appears in the completion modal's 3-column grid. The number is the stat; the label names it; nothing else.

### Toast (AFK Notification)

Paper background, 2px Ink border, 8px rounded corners, surface-imprint shadow (4×4 Ink). System-sans type throughout: 0.875rem/600 for the title, 0.875rem/400 in Attribution gray for the description. Slides in from right (translateX 100% → 0, 0.3s ease-out), slides out on dismiss (translateX 0 → 100%, 0.3s ease-in). Fixed, bottom-right, above the footer. Auto-dismisses after 5s. Respect `prefers-reduced-motion`: skip the slide animation, appear and disappear without transition.

### Masthead (Header)

The fixed newspaper header at the top of every session. Two rows:

1. **Title row:** Display type (Manufacturing Consent, 3rem), center-aligned, 1px Ink border-bottom, 16px padding below.
2. **Meta row:** Three columns — username (left, label type), formatted date (center, label type, uppercase), live stats (right, label type, tabular-nums). 2px Ink border-bottom.

Nothing in the masthead changes layout. The live stats column updates in place; the rest is static. The masthead must never become a toolbar, a navigation bar, or anything other than a newspaper header.

## 6. Do's and Don'ts

### Do
- **Do** use hard-offset solid shadows (`box-shadow: 2px 2px 0px 0px #0f0e0c` or `4px 4px 0px 0px #0f0e0c`). No blur. No spread.
- **Do** keep the typing surface — the editorial column — free of any overlapping UI chrome.
- **Do** use "Manufacturing Consent" exclusively for the newspaper masthead title and the GameCompletion headline.
- **Do** use system-sans for all functional text: stats, button labels, toast copy, author attribution.
- **Do** keep Press-red (`#f87171`) as the sole chromatic accent, and only for typing errors.
- **Do** respect `prefers-reduced-motion` for cursor blink and toast slide animations.
- **Do** use `tabular-nums` on all live numerical displays (WPM, accuracy, completion stats).
- **Do** use the Ink and Paper tokens (`#0f0e0c`, `#faf8f4`) in place of Tailwind's pure `black`/`white` — the warmth is the point.

### Don't
- **Don't** use neon accents, dark backgrounds, or any gamer-coded aesthetic. The Monkeytype/Typeracer as-is look is explicitly prohibited.
- **Don't** introduce card grids, progress rings, metric widgets, or any SaaS dashboard pattern.
- **Don't** use flat pastels of any hue — Wordle-style or otherwise. Saturated non-red color fractures the newspaper illusion.
- **Don't** use a characterless beige-neutral system. The Figma/Notion register is the anti-reference.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on any element.
- **Don't** use gradient text (`background-clip: text` with a gradient fill). Emphasis is expressed through weight or size.
- **Don't** use glassmorphism (`backdrop-filter: blur` on the modal surface itself or any decorative card). The overlay blur is the one permitted use; it stays on the overlay.
- **Don't** blur, spread, or ambient-glow any shadow. If the shadow has a blur radius, it is wrong.
- **Don't** apply "Manufacturing Consent" outside the masthead and completion headline. Never to buttons, body text, sub-headings, or UI labels.
- **Don't** introduce a second accent color for any reason — no success green, no warning amber, no link blue.
