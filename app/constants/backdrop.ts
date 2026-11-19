import { motionValue } from 'motion/react';

/**
 * The site's two gradients. The backdrop starts on Ink in the hero and morphs
 * into Brass while Work's horizontal strip scrolls, then holds Brass for the
 * rest of the page. Both share a near-black base so the change reads as a
 * shift in temperature, not a new scene. Deliberately desaturated.
 */
export const PALETTES = {
  dark: {
    ink:   ['#0A0C10', '#121822', '#1E2A3A', '#4B6A88'],
    brass: ['#0E0C0A', '#1C1813', '#3A2E1F', '#A07C4A'],
  },
  light: {
    ink:   ['#F3F2EE', '#E3E6EA', '#C9D2DC', '#8FA6BC'],
    brass: ['#F4F1EA', '#EAE3D6', '#D9C8AA', '#B8925A'],
  },
} as const;

/**
 * The accent is a pair too: cold frost (drawn from Ink's steel glow) in the
 * hero, warming to brass with the backdrop. Same mix value, same moment.
 */
export const ACCENTS = {
  dark:  { ink: '#B4C6D8', brass: '#C9A46A', toward: '#F2EEE6', soft: 0.16, glow: 0.35 },
  light: { ink: '#4F6A85', brass: '#8A6A35', toward: '#14120F', soft: 0.12, glow: 0.28 },
} as const;

export function hexToRgba(hex: string, alpha: number) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** 0 = Ink, 1 = Brass. Written by WorkSection, read by Backdrop. */
export const paletteMix = motionValue(0);

/** Map Work's strip progress onto the morph: the intro panel stays Ink, the
 *  role panels carry the change, the outro is fully Brass. */
export const MIX_RANGE = [0.15, 0.85] as const;
export function workProgressToMix(p: number) {
  const [a, b] = MIX_RANGE;
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Per-channel sRGB lerp between two equal-length palettes. */
export function mixPalettes(from: readonly string[], to: readonly string[], t: number) {
  return from.map((c, i) => {
    const a = hexToRgb(c);
    const b = hexToRgb(to[i]);
    const rgb = a.map((v, k) => Math.round(v + (b[k] - v) * t));
    return `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  });
}
