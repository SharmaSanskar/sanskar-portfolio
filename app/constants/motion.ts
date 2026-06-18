// Shared motion language — keep every section on one rhythm.
// Cubic-bezier tuples are typed so Framer Motion's `ease` accepts them directly.

type Bezier = [number, number, number, number];

export const EASE = {
  out:     [0.25, 0.46, 0.45, 0.94] as Bezier, // smooth deceleration (entrances)
  outExpo: [0.16, 1, 0.3, 1] as Bezier,         // strong settle (hero / shader)
  inOut:   [0.65, 0.045, 0.355, 1] as Bezier,   // symmetric
  back:    [0.34, 1.56, 0.64, 1] as Bezier,     // slight overshoot (accents)
} as const;

export const DUR = {
  fast:   0.3,
  base:   0.6,
  slow:   1.0,
  reveal: 1.2,
} as const;
