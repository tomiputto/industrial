/** Sandvik HMI design tokens — TypeScript constants */

export const color = {
  bg:          '#07090b',
  surface0:    '#0e1216',
  surface1:    '#161b20',
  surface2:    '#1f262d',
  surface3:    '#2a323a',
  surface4:    '#3a444d',
  border:      '#4a555f',
  borderSoft:  '#2d353d',
  borderStrong:'#5e6770',

  ink1: '#f1f4f7',
  ink2: '#c4cdd5',
  ink3: '#8d97a1',
  ink4: '#5e6770',
  ink5: '#3d454d',

  blue100: '#cfe6fb',
  blue300: '#6bb5ee',
  blue500: '#1f8fe6',
  blue600: '#1474c4',
  blue700: '#0d5897',

  orange100: '#ffd6b8',
  orange300: '#ff9a5a',
  orange500: '#f26a1a',
  orange600: '#cc5210',
  orange700: '#993c0a',

  ok:     '#3aa66b',
  warn:   '#e8a93a',
  danger: '#d83a3a',
  info:   '#1f8fe6',
} as const;

export const spacing = {
  s1:  4,
  s2:  8,
  s3:  12,
  s4:  16,
  s5:  24,
  s6:  32,
  s7:  48,
  s8:  64,
} as const;

export const radius = {
  r1:   3,
  r2:   6,
  r3:   10,
  r4:   14,
  pill: 999,
} as const;

export const font = {
  sans: "'Manrope', system-ui, -apple-system, sans-serif",
  mono: "'Manrope', system-ui, -apple-system, sans-serif",
} as const;
