# sroi-booking design tokens
Tone: NCKU red (#B81C22 sampled from Research NCKU banner), high-contrast, universally readable (2026-10-22).
- band #9B1219 + 6px #B81C22 rule, ground #EFF1F4, surface #FFFFFF, ink #1E1E22, ink-2 #3C3C44
- accent #9B1219; open slot = white + 2px red border + "✓ 可預約"; taken = grey dashed + strike + "✕ 已被預約"; mine = green fill + "●"; closed = flat light grey; gold #D9A81E accents (band rule, header rule, step marker, tags)
- state never relies on colour alone (icon + text + border style); UI borders >= 3:1
- base 18px, targets >= 48px, focus ring 3px + white halo; supports prefers-contrast, forced-colors, reduced-motion
