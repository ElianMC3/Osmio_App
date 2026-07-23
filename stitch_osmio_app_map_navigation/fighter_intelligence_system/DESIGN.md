---
name: Fighter Intelligence System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c6c9ab'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#909378'
  outline-variant: '#454932'
  surface-tint: '#b8d300'
  primary: '#ffffff'
  on-primary: '#2c3400'
  primary-container: '#d2f000'
  on-primary-container: '#5d6b00'
  inverse-primary: '#576500'
  secondary: '#b8c4ff'
  on-secondary: '#002584'
  secondary-container: '#173bab'
  on-secondary-container: '#a0b1ff'
  tertiary: '#ffffff'
  on-tertiary: '#213145'
  tertiary-container: '#d3e4fe'
  on-tertiary-container: '#56657c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d2f000'
  primary-fixed-dim: '#b8d300'
  on-primary-fixed: '#191e00'
  on-primary-fixed-variant: '#414c00'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c4ff'
  on-secondary-fixed: '#001453'
  on-secondary-fixed-variant: '#173bab'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  data-display:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: -0.02em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-margin: 20px
  gutter: 12px
---

## Brand & Style

The brand personality is "The fighter's notebook with technological steroids." It is a high-performance, tactical interface designed for athletes who treat their training like a science. The aesthetic balances the grit of a combat sports gym with the precision of a high-end sports lab.

The design system utilizes a **Tactical Minimalism** style. It prioritizes data density and rapid legibility through high-contrast elements, sharp geometry, and a dark-mode-first architecture. The UI evokes a sense of "Information Dominance"—giving the user the feeling of looking at a mission-control dashboard for their own physical evolution. Visual flair is reserved for data visualization and critical action states, ensuring the interface remains a tool, never a distraction.

## Colors

The palette is engineered for high-contrast environments and low-light training conditions. 

- **Backgrounds:** The foundation is built on `Obsidian` (#0F0F0F) for deep backgrounds and `Charcoal` (#1A1A1A) for elevated surfaces and containers.
- **Striking (Primary):** `Neon Yellow-Green` (#DFFF00) is the high-energy signal color. It is used for primary actions, success states, and striking-related metrics. It must be used sparingly to maintain its "alarm" impact.
- **Grappling (Secondary):** `Deep Sapphire Blue` (#1E40AF) provides a calm, technical contrast for ground-work data and endurance metrics.
- **Fuerza (Tertiary):** `Steel Gray` (#64748B) represents strength and raw iron, used for weightlifting, structural data, and disabled states.
- **Status:** Red is reserved exclusively for over-training alerts or injury markers.

## Typography

The typography system uses a dual-font approach to separate narrative from data.

1.  **Headlines (Inter):** Tight, bold, and geometric. Headlines use heavy weights (700-800) and negative letter spacing to create a sense of density and strength.
2.  **Data & Labels (JetBrains Mono):** A monospaced font is used for all numerical values, timestamps, and technical labels. This ensures that columns of numbers align perfectly in lists and heatmaps, reinforcing the "high-end lab" aesthetic.
3.  **Caps Policy:** Technical labels and categories (e.g., "VO2 MAX", "ROUND 1") should always be set in uppercase with increased letter spacing to enhance the tactical feel.

## Layout & Spacing

This design system follows a **Fixed-Fluid Hybrid** model. On mobile, content uses a tight 20px margin to maximize screen real estate for data. On desktop, content is constrained to a 12-column grid with a maximum width of 1440px.

The spacing rhythm is based on a **4px base unit**. Elements are grouped closely to create "information modules." 
- Use `md` (16px) for standard internal padding within cards.
- Use `sm` (8px) for related technical data points.
- Vertical rhythm should be strict: use larger `xl` (40px) gaps only between major section shifts (e.g., moving from "Today's Volume" to "Historical Trends").

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Glassmorphism**, rather than traditional shadows.

1.  **Surface 0 (Base):** Obsidian (#0F0F0F).
2.  **Surface 1 (Cards):** Charcoal (#1A1A1A). These surfaces use a 1px solid border (#2A2A2A) to define edges.
3.  **Surface 2 (Overlays/Active):** A semi-transparent "Glass" effect using a backdrop blur (20px) and a subtle white tint (5-10% opacity). This is used for navigation bars and floating action buttons.
4.  **Interaction:** When an element is pressed, it should not lift; instead, it should gain a subtle inner glow or a stroke in the Primary (Neon) color.

## Shapes

The shape language is aggressive and precise. 

- **Primary Radius:** Use a `Soft` (0.25rem) radius for most UI elements. This keeps the edges sharp enough to look industrial but modern enough to feel polished.
- **Large Components:** Large cards or sections may use `rounded-lg` (0.5rem), but never more.
- **Strict No-Pill Policy:** Buttons and chips are rectangular with minimal rounding. Avoid fully circular buttons (pill-shaped) to maintain the "tactical tool" aesthetic.
- **Data Viz:** Heatmaps should use square tiles with 2px gaps. Line graphs should use sharp vertices or very minimal smoothing.

## Components

- **Action Buttons:** Large, rectangular, and high-contrast. The primary button is #DFFF00 with black text. Secondary buttons are ghost-style with #DFFF00 borders.
- **Segmented Controls:** Used for switching between "Striking," "Grappling," and "Fuerza." The active segment uses the color associated with that discipline as a bottom-border indicator (3px thick).
- **Interactive Cards:** Use Charcoal (#1A1A1A) backgrounds. Header data inside cards should use `label-caps`. Progress bars within cards are thin (4px height) and utilize the discipline-specific accent color.
- **Heatmaps:** GitHub-style 52-week activity charts. Empty days are #1A1A1A; active days scale in intensity using the primary neon green.
- **Inputs:** Dark backgrounds with a 1px border. On focus, the border changes to the primary neon green and the label moves to a small floating `label-sm` position.
- **Line Graphs:** Ultra-thin lines (1.5pt) with "data-points" highlighted by small square markers. Use a subtle gradient fill below the line that fades to 0% opacity.