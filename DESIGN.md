---
name: Lace Anatomy
description: Visualize and dissect Cardano blockchain transactions through interactive diagrams and structured data exploration.
colors:
  blueprint-blue: "#4299e1"
  blueprint-blue-hover: "#3182ce"
  drafting-table: "#fafafa"
  tracing-paper: "#f3f4f6"
  inkwell: "#1f2937"
  smudge: "#6b7280"
  graphite-border: "#e5e7eb"
  blueprint-shadow: "#000000"
  red-alert-bg: "#f48b8b"
  red-alert-text: "#f04d4d"
  red-alert-border: "#d93e3e"
  green-confirm-bg: "#d1fae5"
  green-confirm-border: "#86efac"
  explorer-glow: "#f5f3ff"
  canvas-input-blue: "#0000FF"
  canvas-output-red: "#FF0000"
  canvas-mint-green: "#8AC926"
  canvas-burn-red: "#FF3E45"
  canvas-cert-purple: "#9d4edd"
  canvas-withdrawal-yellow: "#ffdd63"
typography:
  display:
    fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.15
  headline:
    fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  mono-data:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.blueprint-blue}"
    textColor: "{colors.drafting-table}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.blueprint-blue-hover}"
    textColor: "{colors.drafting-table}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  card-default:
    backgroundColor: "{colors.drafting-table}"
    rounded: "{rounded.sm}"
    padding: "16px"
  input-search:
    backgroundColor: "{colors.tracing-paper}"
    textColor: "{colors.inkwell}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  nav-item:
    backgroundColor: "{colors.tracing-paper}"
    textColor: "{colors.inkwell}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  nav-item-active:
    backgroundColor: "{colors.inkwell}"
    textColor: "{colors.drafting-table}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
---

# Design System: Lace Anatomy

## 1. Overview

**Creative North Star: "The Engineering Blueprint"**

Lace Anatomy is a developer tool built on the metaphor of an engineering blueprint: gridded canvas, schematic clarity, purposeful annotation. Every element is a tool, not decoration. The interface renders transaction data like a draftsman renders mechanical systems: structured views, labeled components, spatial relationships carrying meaning.

The visual language is technical and data-dense but never cluttered. Monospace anchors the data layer (hashes, addresses, CBOR, amounts); sans-serif carries the UI chrome (labels, headings, navigation). The color system uses a single blue accent against warm-neutral backgrounds, with semantic red/green/purple reserved for error, success, and the explorer context. Nothing glows, nothing animates without purpose.

This system explicitly rejects old-school enterprise density (nested tables, beveled chrome, Oracle/IBM-era trim) and Web3 decoration (neon-on-black, glassmorphism, gradient everything). The interface should feel like it was built by developers for developers: confident, precise, and boring in the best way.

**Key Characteristics:**
- Blueprint grid canvas as the signature surface; dot-grid pattern on the grapher
- Single blue accent carries action; neutrals carry structure; semantic colors stay quarantined to their domain
- IBM Plex Sans for chrome, JetBrains Mono for data; no third font
- Cards are containers, not decorations; borders are structural, not ornamental
- Dark mode is an alternate drafting surface, not a different product

## 2. Colors

The palette is a restrained developer-tool scheme: one blue accent for interaction, warm grayscale neutrals for structure, and a set of locked-down semantic colors for data visualization and alerts. The explorer introduces a faint violet row background that stays contained to its context.

### Primary
- **Blueprint Blue** (#4299e1): Primary action buttons, links, active states. The only color that signals interaction. Used on the Draw/Dissect buttons, active nav indicators, and tRPC link styling. Dark mode shifts to #3182ce.

### Neutral
- **Drafting Table** (#fafafa): Page background. The canvas the UI sits on. Very light, nearly white, with the faintest warmth. Dark mode: #111827 (deep drafting room).
- **Tracing Paper** (#f3f4f6): Surface and card backgrounds. One step darker than the drafting table, providing subtle containment. Dark mode: #1f2937.
- **Inkwell** (#1f2937): Primary text. The darkest neutral, used for headings, labels, body copy. Near-black but never pure black. Dark mode inverts to #f9fafb.
- **Smudge** (#6b7280): Secondary text, muted labels, descriptions. Halfway between ink and paper; readable but recessive. Dark mode: #9ca3af.
- **Graphite Border** (#e5e7eb): Structural borders, dividers, section rules. Light enough to organize without dominating. Dark mode: #374151.
- **Blueprint Shadow** (#000000): Box shadow color. Used sparingly and only in light mode; shadows vanish in dark mode.

### Semantic
- **Red Alert** (#f04d4d text, #f48b8b bg, #d93e3e border): Error states, empty data indicators, warning text. Three values form a complete error surface: background tint, text, and border.
- **Green Confirm** (#d1fae5 bg, #86efac border): Success states, confirmation backgrounds. Light mode only; dark mode uses #064e3b background.
- **Explorer Glow** (#f5f3ff): Explorer row and card backgrounds. A faint violet that distinguishes the explorer section from the rest of the app. Never bleeds into other surfaces. Dark mode: #2d3748.

### Canvas Colors (Konva — distinct from UI palette)
The transaction diagram layer uses its own semantic color vocabulary for data visualization. These are hardcoded in the Konva renderer and do not participate in the UI theme system.
- **Canvas Input Blue** (#0000FF): Lines connecting input UTXOs
- **Canvas Output Red** (#FF0000): Lines connecting output UTXOs
- **Canvas Mint Green** (#8AC926 fill, #77AD21 stroke): Minting icon
- **Canvas Burn Red** (#FF3E45 fill, #FF262D stroke): Burning icon
- **Canvas Cert Purple** (#9d4edd fill, #893ec7 stroke): Certificate icon
- **Canvas Withdrawal Yellow** (#ffdd63 fill, #fcd72c stroke): Withdrawal icon
- **Canvas Grey** (#808080): Transaction box fill
- **Canvas Lighter Grey** (#F7F7F7): Transaction label background

### Named Rules
**The One Accent Rule.** Blueprint Blue is used on ≤10% of any given screen. Buttons, links, active states. Its rarity is the point: if everything is blue, nothing is actionable.

**The Canvas Quarantine Rule.** Konva diagram colors (red, true blue, green, purple, yellow) never appear in the UI chrome. The canvas is a separate visual layer with its own color language. The two palettes do not blend.

## 3. Typography

**Sans Font:** IBM Plex Sans (Google Fonts, variable weight 400–700)
**Mono Font:** JetBrains Mono (Google Fonts, variable weight 400–700)

**Character:** IBM Plex Sans brings a technical-adjacent warmth that avoids the sterility of Inter and the personality of system fonts. JetBrains Mono provides a developer-native reading experience for data: ligatures off, clear glyph differentiation, comfortable at small sizes.

### Hierarchy
- **Display** (700, 3rem, 1.15): Main page headings. Currently "Lace Anatomy" in the header and "About Us" on the homepage. Used exactly twice.
- **Headline** (600, 1.875rem, 1.25): Section titles. "See more about us", explorer section headers.
- **Title** (600, 1.25rem, 1.4): Card headings, PropBlock values, section labels in the dissector sidebar.
- **Body** (400, 1rem, 1.6): Paragraph text, descriptions, instruction copy. Capped at 65–75ch for readability.
- **Label** (500, 0.875rem, 1.5): UI labels, stat headings, section tags. Mono font. All-caps via tracking, not text-transform, unless the variant demands it.
- **Mono Data** (400, 0.75rem, 1.6): Transaction hashes, CBOR data, addresses, asset names, policy IDs, script hashes. The workhorse of the data layer. Tabular numbers aligned via `font-variant-numeric: tabular-nums`.

### Named Rules
**The Data Face Rule.** JetBrains Mono is the exclusive typeface for all blockchain data (hashes, addresses, CBOR, asset names, policy IDs, amounts). Never render a hash or address in a proportional font. Never use IBM Plex Sans for code-adjacent values.

**The Flat Scale Rule.** Hierarchy is conveyed through weight contrast, not size inflation. A 700-weight Display sits against a 400-weight Body with a 3:1 size ratio. No intermediate weights dilute the distinction.

## 4. Elevation

Lace Anatomy is predominantly flat. The interface uses tonal layering (Drafting Table → Tracing Paper → Inkwell) rather than shadow-based depth. Cards and surfaces differentiate through background color shifts and solid borders, not drop shadows.

**The Flat-By-Default Rule.** Surfaces are flat at rest. A single `shadow-md` with Blueprint Shadow appears only on interactive cards and buttons in light mode, providing just enough lift to signal clickability. Dark mode disables shadows entirely: tonal contrast alone carries depth. If it looks like a 2014 Material Design app (too many shadows, too dark, too blurry), the shadow vocabulary is too aggressive.

### Shadow Vocabulary
- **Card Lift** (`box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)`): Applied to interactive cards and the header in light mode only. A single elevation level. No shadow stacking, no multi-level z-indexing.

## 5. Components

### Buttons
Lead: "Confident rectangles with bottom-heavy shadow. The primary action button feels like a physical control: thick bottom border, rounded bottom edge, shadow underneath."

- **Shape:** Rounded top corners (8px / `rounded-lg`), squared-off bottom corners with a heavy 8px bottom border in a darker shade, and an extended `rounded-b-xl` (12px) to create a dimensional slab effect.
- **Primary (Draw/Dissect):** Blueprint Blue background, #1e3a8a (blue-950) 8px bottom border. White text in JetBrains Mono. Shadow: `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)`.
- **Secondary (Nav/Action):** HeroUI `variant="flat"` with `shadow-md`. JetBrains Mono text.
- **Hover:** No animation. The heavy bottom border and shadow already signal physicality.

### Cards / Containers
Lead: "Structured containers with dashed borders. Cards don't try to be soft; they're structural frames for data."

- **Corner Style:** 8px (`rounded-lg`).
- **Background:** Drafting Table (light) or inkwell-dark surface. Explorer cards use Explorer Glow.
- **Border:** 2px solid Graphite Border. Explorer cards use 2px dashed Graphite Border.
- **Shadow:** `shadow-md` in light mode only; none in dark mode.
- **Internal Padding:** 16px (`p-4`) standard; 24px (`p-6`) on larger content cards.

### Inputs / Fields
Lead: "Monospace search bar with mode toggle. The primary interaction surface for entering CBOR or transaction hashes."

- **Style:** Full-width single-line input. JetBrains Mono text. Tracing Paper background. 2px solid Graphite Border.
- **Radius:** 8px (`rounded-lg`).
- **Focus:** No glow or ring shift. Border transitions from Graphite Border to Blueprint Blue (2px solid). Subtle, purposeful.
- **Mode Toggle:** Segmented control above the input: "CBOR" / "Hash" tabs. Active tab: dark background, light text. Inactive: light background.
- **Error:** Red Alert border and background tint on invalid input.

### Navigation
Lead: "Sticky header with dashed bottom border. Horizontal button row, no sidebar. Flat, simple, always visible."

- **Style:** Drafting Table background. Border-bottom: 2px dashed Graphite Border. Sticky at top (`z-40`).
- **Items:** Rounded-xl (12px) pill buttons: TxPipe logo, "Lace Anatomy" heading, Transaction / Address / Explorer buttons, Theme toggle.
- **Active State:** Inkwell background, Drafting Table text.
- **Inactive State:** Tracing Paper background, Inkwell text.
- **Typography:** JetBrains Mono, text-base (1rem), font-medium.
- **Theme Toggle:** Sun/Moon emoji in a disabled placeholder button that activates on client mount (hydration-safe).

### PropBlock
Lead: "The atomic unit of data display. A labeled key-value pair used throughout the dissector and explorer."

- **Style:** Title + value pair. Title: uppercase, xs (0.75rem), semibold, tracking-wide, Smudge color. Value: font-mono, sm (0.875rem), medium, Inkwell color, tabular-nums.
- **Empty State:** Red Alert variant: Red Alert background, Red Alert border, Red Alert text, dashed border.
- **Green State:** Green Confirm background, Green Confirm border (success indicators).

### Section
Lead: "A bordered blockquote wrapper that groups related content blocks."

- **Style:** Dashed left border (4px on md+) in Graphite Border. Padding: 16px vertical, 40px horizontal on desktop.
- **Typography:** Inherits from children; Section owns only the frame.

### Detail Tabs
Lead: "HeroUI-wrapped tab bar for transaction and block detail pages. Minimal chrome, functional emphasis."

- **Style:** HeroUI `<Tabs>` with variant="underlined". JetBrains Mono labels.
- **Tabs (current):** Overview, Diagram, Dissect, CBOR, Datum, Scripts.
- **Active:** Blueprint Blue underline, medium weight.
- **Inactive:** Smudge text, regular weight.

## 6. Do's and Don'ts

### Do:
- **Do** render all blockchain data (hashes, addresses, CBOR, policy IDs, asset names) in JetBrains Mono.
- **Do** use tabular-nums for any numerical column: amounts, indices, counts.
- **Do** keep the canvas color vocabulary quarantined to the Konva layer.
- **Do** use dashed borders for structural grouping (cards, sections) and solid borders for interactive edges (inputs, buttons).
- **Do** let the dot-grid canvas background be the signature texture. It signals "blueprint" without saying it.
- **Do** prefer progressive disclosure: show the transaction at a glance, let developers drill into any UTxO or field.

### Don't:
- **Don't** use old-school enterprise patterns: dense nested tables, beveled chrome, 90s-era button styling, Oracle/IBM-style sidebars with tree menus.
- **Don't** use Web3 clichés: neon-on-black, glassmorphism, gradient text, animated grid backgrounds.
- **Don't** apply Blueprint Blue to more than 10% of a screen's surface area. Its job is to say "click here", not "look at me".
- **Don't** mix Konva canvas colors into the UI chrome. Red is for output UTxO lines, not for UI accents.
- **Don't** use side-stripe borders (`border-left` or `border-right` > 1px) as accent decoration. Full borders or nothing.
- **Don't** nest cards inside cards. A card is a terminal container.
- **Don't** reach for a modal first. The slide-out InfoPanel and fullscreen JSON view already provide inline/progressive alternatives.
