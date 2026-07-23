export const colors = {
  // Surface hierarchy
  'surface': '#0f0e0e',
  'surface-dim': '#0f0e0e',
  'surface-bright': '#3a3939',
  'surface-container-lowest': '#0d0c0c',
  'surface-container-low': '#171616',
  'surface-container': '#1c1b1a',
  'surface-container-high': '#262525',
  'surface-container-highest': '#313030',
  'surface-variant': '#46483a',

  // Primary (Neon Yellow-Green)
  'primary': '#cacb2b',
  'on-primary': '#313100',
  'primary-container': '#3b3c00',
  'on-primary-container': '#e7e864',
  'primary-fixed': '#d2f000',
  'primary-fixed-dim': '#b8d300',

  // Secondary
  'secondary': '#c3c5e4',
  'on-secondary': '#313136',
  'secondary-container': '#3b3d5b',
  'on-secondary-container': '#e0e1ff',

  // Tertiary
  'tertiary': '#e7c0a0',
  'on-tertiary': '#4a2810',
  'tertiary-container': '#593e25',
  'on-tertiary-container': '#ffdcbe',

  // Error
  'error': '#ffb4ab',
  'on-error': '#690005',
  'error-container': '#93000a',
  'on-error-container': '#ffdad6',

  // On-surface
  'on-surface': '#e5e2e1',
  'on-surface-variant': '#c8c5b6',

  // Outline
  'outline': '#909378',
  'outline-variant': '#46483a',

  // Inverse
  'inverse-surface': '#e5e2e1',
  'inverse-on-surface': '#313030',
  'inverse-primary': '#576500',
} as const

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, ui-monospace, monospace',
  },
  fontSize: {
    'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '800' }],
    'headline-lg': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
    'headline-lg-mobile': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
    'headline-md': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
    'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
    'data-display': ['24px', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '600' }],
    'label-caps': ['12px', { lineHeight: '1', letterSpacing: '0.1em', fontWeight: '500' }],
    'label-sm': ['11px', { lineHeight: '1', fontWeight: '500' }],
  },
} as const

export const spacing = {
  unit: '4px',
  xs: '4px',
  sm: '8px',
  gutter: '12px',
  md: '16px',
  lg: '24px',
  xl: '40px',
  'container-margin': '20px',
} as const

export const borderRadius = {
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
} as const
