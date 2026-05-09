// Shared figure palette. Replaces the per-widget `const COLOR = {...}` blocks
// that every widget redeclared with the same five hexes. Names are by *role*
// (curve, tangent, secant, point, axis), not by hue, so a widget reads as
// math first.
//
// Hexes here mirror the literals in widgets prior to migration; they map onto
// Lemma's `--color-*` tokens but stay as inline strings because Mafs props
// (color={...}) want a string, not a CSS variable reference.

export const figureColors = {
  curve: "#1e6da6", // primary curve / function plot — blue
  curveAlt: "#3a8c4a", // secondary curve — green
  point: "#3a8c4a", // movable / anchor point — green
  tangent: "#7a5c2c", // muted reference line — brown
  secant: "#b6451e", // active overlay — terracotta (matches --color-acc)
  axis: "#9ca3a4", // axes / ticks — neutral gray
  trail: "#7a5c2c", // path trails / history
} as const;

export type FigureColor = keyof typeof figureColors;
