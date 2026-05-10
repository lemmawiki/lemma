# Lemma — brand kit

The mark is **The Tangent**: a circle and a line touching at one point. The
point is the lemma — a single certainty from which everything that follows
derives. Tangency is the entire field of differential geometry collapsed into
the smallest possible figure.

## What's here

| File                  | What it is                                                 |
| --------------------- | ---------------------------------------------------------- |
| `mark.svg`            | The mark, ink stroke, transparent.                         |
| `mark-on-dark.svg`    | Cream stroke for dark backgrounds.                         |
| `lockup.svg`          | Mark + "Lemma" wordmark, horizontal, ink.                  |
| `lockup-on-dark.svg`  | Same lockup in cream.                                      |
| `og.svg` / `og.png`   | 1200 × 630 social card. PNG is the derivative.             |
| `avatar.svg` / `.png` | 1024 × 1024 square avatar (GitHub org, etc.).              |
| `mark-1024.png`       | Raster mark for slides, READMEs, anywhere PNG is required. |

The PNGs are rendered from the SVGs by `apps/web/scripts/build-brand.mjs` —
re-run `pnpm run build:brand` after editing any SVG.

The site (`apps/web`) only carries the two files actually referenced from
`<head>`: `favicon.svg` (= `mark.svg`) and `og.png`. The build script keeps
those copies in sync.

## Construction

The mark is drawn in a 100 × 100 viewBox.

|        | Value                                                    |
| ------ | -------------------------------------------------------- |
| Circle | center (50, 50), radius 26                               |
| Line   | y = 76, from x = 10 to x = 90 (tangent to circle bottom) |
| Stroke | 6 (6 % of viewBox), butt caps, single weight             |

The standalone mark is centered in its 100 × 100 viewBox so it composes
correctly inside square icon frames (iOS home-screen, PWA, avatar). The
`lockup*.svg` files use a different mark position — circle (50, 38),
line y = 64 — so the tangent line aligns with the wordmark baseline.

## Color

| Role       | Hex       | Use                                            |
| ---------- | --------- | ---------------------------------------------- |
| Ink        | `#14110d` | The mark on light backgrounds. Body text.      |
| Cream      | `#faf7f2` | Page background. The mark on dark backgrounds. |
| Card       | `#ffffff` | Surface, alt background.                       |
| Terracotta | `#b6451e` | Accent — never recolor the mark with this.     |

The mark is one color at a time. No gradients, no shadows, no double-stroke.

## Clear space

Leave at least one circle-radius (26 viewBox units, ≈ 26 % of mark width) of
empty space on all sides of the mark.

## Minimum size

16 px square. Below that, drop the mark and use the wordmark.

## Don't

- Stretch the mark.
- Recolor outside the palette.
- Pair with imagery that obscures the line.
- Use the terracotta accent for the mark.
- Combine with another mark.

## Typography

| Role               | Font                                                   | License       |
| ------------------ | ------------------------------------------------------ | ------------- |
| Display + wordmark | [Fraunces](https://fonts.google.com/specimen/Fraunces) | SIL Open Font |
| Body               | [Inter](https://rsms.me/inter/)                        | SIL Open Font |
| Mono               | [JetBrains Mono](https://www.jetbrains.com/lp/mono/)   | SIL Open Font |

## License

Brand assets are CC BY 4.0. The mark and the name "Lemma" identify the
project — please don't use them to imply endorsement of unrelated work.
