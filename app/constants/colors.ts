export const COLORS = {
  page:    'var(--color-page)',
  surface: 'var(--color-surface)',
  section: 'var(--color-section)',
} as const;

export const shaderColors = {
  // Indigo-infused gradient: near-black → dark → indigo midtone → signature indigo.
  // The MeshGradient flows these together, giving the box a living indigo glow on dark.
  dark:  ['#09090B', '#15151B', '#2E2B52', '#7079E8'] as const,
  light: ['#FAFAFA', '#F0F0F3', '#DAD9F5', '#A5A9F0'] as const,
} as const;
