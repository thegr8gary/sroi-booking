# sroi-booking design tokens
Tone: precise / restrained, but high-contrast and universally readable (2026-10-22).
- band #12275A (white text 14:1), ground #E6ECF7, surface #FFFFFF, ink #0F1B33 (14.5:1), ink-2 #34425F (>=8:1)
- accent #14449C; open slot = white + 2px blue border + "✓ 可預約"; taken = grey dashed + strike + "✕ 已被預約"; mine = green fill + "●"; closed = blue stripes
- state never relies on colour alone (icon + text + border style); UI borders >= 3:1
- base 18px, targets >= 48px, focus ring 3px + white halo; supports prefers-contrast, forced-colors, reduced-motion
