// colorUtils.ts
// Small, dependency-free helpers for turning a single "habit color" into
// the 6-step intensity scale used by the heat map (0 = nothing logged,
// 5 = most intense).

type RGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mix(hexA: string, hexB: string, t: number): string {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return rgbToHex({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  });
}

/**
 * Given a base habit color, returns 6 hex colors:
 * index 0 = empty/neutral cell, index 1..5 = increasing intensity,
 * darkening and saturating towards the base color as intensity rises.
 */
export function getIntensityShades(baseColor: string, emptyColor = "#232529"): string[] {
  const white = "#ffffff";
  const black = "#000000";

  return [
    emptyColor,
    mix(white, baseColor, 0.35), // level 1 — light tint
    mix(white, baseColor, 0.6), // level 2
    mix(white, baseColor, 0.85), // level 3
    baseColor, // level 4 — pure habit color
    mix(baseColor, black, 0.35), // level 5 — deepest / most intense
  ];
}

export const PRESET_COLORS = [
  "#3fbf74", // green
  "#5aa9e6", // blue
  "#e6b45a", // amber
  "#c07be0", // violet
  "#e0685f", // red
  "#4fd1c5", // teal
  "#f472b6", // pink
  "#a3a84c", // olive
];
