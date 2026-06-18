export const COLORS = {
  page:    'var(--color-page)',
  surface: 'var(--color-surface)',
  section: 'var(--color-section)',
} as const;

export const shaderColors = {
  // Vibrant indigo gradient — a dark anchor + saturated indigos so the full-bleed
  // hero shader reads alive (not dimmed). Edge scrims keep text legible.
  dark:  ['#0B0B16', '#2E2B6E', '#4F46E5', '#8B8FF5'] as const,
  light: ['#FAFAFA', '#E8E7FB', '#C7C9F5', '#A5A9F0'] as const,
} as const;
