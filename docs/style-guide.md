# Einat Shomonov — Website Style Guide

> Living document. Last updated during the June 2026 design session.

---

## Brand Identity

**Name:** עינת שומונוב (Einat Shomonov)  
**Tagline:** ריפוי, מדיטציה ושלווה פנימית  
**Direction:** RTL (Hebrew), `dir="rtl"` on `<html>`  
**Font:** `'Heebo', sans-serif` — a Hebrew-optimised Google Font  
**Tone:** Spiritual, feminine, calm, healing/wellness

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#7B5EA7` | Purple — main brand color, headings, icons, borders |
| `--color-primary-light` | `#9B7EC7` | Hover states, lighter accents |
| `--color-primary-dark` | `#5B3E87` | Active states, footer gradient |
| `--color-secondary` | `#D4A5B5` | Blush pink — accent details, decorative lines |
| `--color-accent` | `#8B7D3C` | Gold — used in logo text, premium feel |
| `--color-bg` | `#FFFFFF` | Base page background |
| `--color-bg-alt` | `#F5F0F8` | Soft lavender — hero section, expertise section, alt sections |
| `--color-text` | `#2D2D2D` | Near-black body text |
| `--color-text-light` | `#6B6B6B` | Muted text, descriptions |
| `--color-border` | `#E8E0EF` | Soft lavender border — cards, inputs |
| `--color-error` | `#D32F2F` | Form validation errors |
| `--color-success` | `#388E3C` | Form success states |

### Color usage rules
- **Never** use solid `--color-primary` as a card border — it is too visually heavy. Use `--color-border` instead.
- Card backgrounds use a subtle gradient: `linear-gradient(145deg, #F0EDF8 0%, #EDE4F2 55%, #F4DDE8 100%)`
- Card hover background: `linear-gradient(145deg, #E8E0F4 0%, #E2D5EF 55%, #EDD0E0 100%)`
- Decorative SVG fills use very low opacity: `rgba(212,165,181,0.25)` (blush) or `rgba(245,240,248,0.5)` (lavender)

---

## Typography

```scss
--font-family: 'Heebo', sans-serif;

--font-size-xs:   0.75rem
--font-size-sm:   0.875rem
--font-size-base: 1rem
--font-size-lg:   1.25rem
--font-size-xl:   1.5rem
--font-size-2xl:  clamp(1.75rem, 2.5vw, 2.25rem)
--font-size-3xl:  clamp(2rem, 3.5vw, 3rem)
```

---

## Spacing

```scss
--spacing-xs:  0.25rem
--spacing-sm:  0.5rem
--spacing-md:  1rem
--spacing-lg:  1.5rem
--spacing-xl:  2rem
--spacing-2xl: 3rem
--spacing-3xl: 4rem   ← section vertical padding
```

---

## Border Radius

```scss
--radius-sm:   4px
--radius-md:   8px
--radius-lg:   16px   ← cards, image containers
--radius-full: 9999px ← pill buttons
```

---

## Shadows

```scss
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px rgba(0,0,0,0.07)   ← default card shadow
--shadow-lg: 0 10px 25px rgba(0,0,0,0.1)  ← hover card shadow
```

---

## Layout

- Container max-width: `1200px`, centered with `margin-inline: auto`
- Header height: `88px`
- Breakpoints (defined in `src/styles/_mixins.scss`):

| Name | Min-width |
|------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

---

## Logo

A **white dove** carrying a **rose**, rendered as a JPEG illustration:
- Dove outline: purple/blue gradient stroke
- Rose: pink/purple tones
- Name text: purple (`#7B5EA7`) + gold (`#8B7D3C`) script
- Tagline: לבחור בחיים להיות אהבה
- Files: `logo.jpeg`, `src/assets/logo.jpeg`

---

## SVG Illustration Style

All custom SVG illustrations follow the same fine-line sketch style as the logo.

### Stroke rules
| Property | Value |
|----------|-------|
| `stroke-linecap` | `round` |
| `stroke-linejoin` | `round` |
| Primary stroke color | `#7B5EA7` |
| Primary stroke width | `1.3`–`1.5` |
| Accent stroke color | `#D4A5B5` |
| Accent stroke width | `0.8`–`1.1` |
| Default fill | `none` |

### Fill rules
- Main shapes: `rgba(255,255,255,0.55)` (near-white, slight opacity)
- Lavender tint fills: `rgba(245,240,248,0.5)`
- Blush fills: `rgba(212,165,181,0.25)`–`rgba(212,165,181,0.4)`
- Very faint purple fills: `rgba(123,94,167,0.08)`

### Decorative sparkles
Every illustration uses the same sparkle vocabulary:
- **Cross marks** (`+`): two `<line>` pairs in `#D4A5B5`, opacity 0.5–0.7
- **4-point star**: 8-point path in `#7B5EA7`, fill `rgba(123,94,167,0.12)` — same shape as the meditation card icon

### Available illustrations
| File | Description | ViewBox |
|------|-------------|---------|
| `src/assets/images/buddha-meditation.svg` | Seated meditating Buddha, lotus flower at base, halo, elongated earlobes, dhyana mudra hands | `0 0 300 490` |
| `src/assets/images/floral-branch.svg` | Weeping branch with large 5-petal blossoms (wisteria style), hanging down | `0 0 300 480` |

---

## Section Patterns

### Hero section (`.hero`)
- Background: `linear-gradient(160deg, var(--color-bg-alt) 0%, rgba(123,94,167,0.12) 100%)`
- `min-height: 100vh`, content vertically centered
- Animated floating particles (petals, leaves, dove wings) using CSS `@keyframes`
- Particles use `--color-primary` stroke and blush/lavender fills at 0.38–0.70 opacity

### Expertise section (`.section--expertise`)
- Background: `var(--color-bg-alt)`
- `min-height: 100vh` **only on `lg`+ screens** (≥1024px)
- `display: flex; align-items: center` for vertical centering
- Decorative images (pseudo-elements):
  - `::before` — floral branch, `inset-inline-start`, hangs from top (`translateY(-30%)`)
  - `::after` — Buddha, `inset-inline-end`, vertically centered
  - **Hidden** on mobile (< `md` / 768px)
  - **Small & faint** on tablets (768–1023px): ~14vw wide, opacity 0.18–0.22
  - **Full size** on desktop (≥1024px): `clamp(200–440px)` wide, `clamp` height in `vh`

### Alt sections (`.section--alt`)
- Background: `var(--color-bg-alt)`

### CTA section (`.section--cta`)
- Background: `linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)`
- White text and form elements

---

## Card Component (`.expertise-deck__card`)

```scss
background: linear-gradient(145deg, #F0EDF8 0%, #EDE4F2 55%, #F4DDE8 100%);
border: 1.5px solid var(--color-border);   // NOT primary color
border-radius: var(--radius-lg);
box-shadow: var(--shadow-md);
padding: var(--spacing-xl) var(--spacing-lg);
```

### Hover animation
```scss
transform: scale(1.06) translateY(-8px);
box-shadow: var(--shadow-lg);
background: linear-gradient(145deg, #E8E0F4 0%, #E2D5EF 55%, #EDD0E0 100%);
```

### Icon hover
```scss
transform: scale(1.1) rotate(-6deg);
```

---

## Icons (`src/assets/icons/`)

All service icons are SVG line-art, matching the illustration style:

| File | Service | Shape |
|------|---------|-------|
| `meditation.svg` | מדיטציה | 4-point sparkle star + cross marks |
| `healing.svg` | ריפוי רגשי | Heart with blush fill |
| `coaching.svg` | ליווי אישי | Compass circle with blush polygon |
| `lectures.svg` | הרצאות וסדנאות | Microphone with blush stand |

### Icon rules
- `stroke="#7B5EA7"`, `stroke-width="1.5"`, `viewBox="0 0 24 24"`
- Accent elements use `stroke="#D4A5B5"`
- Soft fills: `rgba(212,165,181,0.25)` for blush areas

---

## Buttons

```scss
// Primary (filled)
background: var(--color-primary);
color: #fff;
border-radius: var(--radius-full);
padding: var(--spacing-md) var(--spacing-2xl);
&:hover { background: var(--color-primary-dark); }

// Secondary (outline)
background: transparent;
color: var(--color-primary);
border: 2px solid var(--color-primary);
&:hover { background: rgba(123,94,167,0.08); }
```

---

## Responsive Design Principles

1. **Mobile-first** for content; decorative elements are progressively enhanced
2. Decorative illustrations (`::before`, `::after`) are **hidden on mobile**, small on tablet, full on desktop
3. `min-height: 100vh` full-screen sections only apply at `lg` (1024px+)
4. Card grid: single column at ≤600px, 2×2 at >600px
5. Use `clamp()` for smooth scaling: `clamp(min, preferred_vw_or_vh, max)`
6. Use logical properties (`inset-inline-start`, `inset-inline-end`, `margin-inline`) throughout — the site is RTL

---

## RTL Notes

- `inset-inline-start` = **physical right** in RTL
- `inset-inline-end` = **physical left** in RTL
- Always use logical CSS properties — never `left`/`right` directly
- Text alignment defaults to `right` (RTL), use `text-align: center` explicitly where centered layout is needed
