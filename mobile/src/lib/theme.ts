// Design System Tokens based on DESIGN_SYSTEM.md with desktop-friendly scale

export const colors = {
  // Brand - AAA/AA compliant contrast (4.5:1+ against white)
  primary: '#A21CAF', // Fuchsia-700 (5.4:1 contrast)
  primaryDark: '#701A75', // Fuchsia-900
  primaryLight: '#F0ABFC', // Fuchsia-300
  primarySoft: '#FDF4FF', // Fuchsia-50

  secondary: '#6D28D9', // Violet-700 (6.8:1 contrast)
  secondaryDark: '#4C1D95', // Violet-900
  secondaryLight: '#C4B5FD', // Violet-300

  accent: '#E11D48', // Rose-600 (WCAG AA Compliant)

  // Semantic Categories (Text-safe variants for labels)
  categories: {
    purple: '#7E22CE', // Purple-700
    blue: '#1D4ED8', // Blue-700
    green: '#047857', // Emerald-700
    pink: '#BE185D', // Pink-700
    orange: '#C2410C', // Orange-700
    indigo: '#4338CA', // Indigo-700
  },

  // Rating
  ratingStars: '#D97706', // Amber-600 (Safe AA)

  // Neutrals - Light Mode
  neutrals: {
    background: '#F6F7FB',
    surface: '#FFFFFF',
    surfaceAlt: '#F3F4F6',
    border: '#E2E8F0',
    cardBorder: '#E5E7EB',
    textPrimary: '#0F172A', // Slate-900 (High contrast)
    textSecondary: '#334155', // Slate-700 (Safe AA)
    textMuted: '#475569', // Slate-600 (WCAG AA compliant 4.5:1)
    placeholder: '#94A3B8',
  },

  // Neutrals - Dark Mode
  darkNeutrals: {
    background: '#0B1221',
    surface: '#111827',
    surfaceAlt: '#1F2937',
    border: '#1F2937',
    cardBorder: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#E2E8F0',
    textMuted: '#94A3B8',
    placeholder: '#94A3B8',
  },

  // Semantic
  success: '#059669', // Green-600 (Safe AA)
  warning: '#B45309', // Amber-700 (Darker for better warning visibility)
  error: '#DC2626', // Red-600 (Safe AA)
  info: '#2563EB', // Blue-600 (Safe AA)

  // Status Chip
  statusPending: '#FEF3C7',
  statusPendingText: '#92400E',
  statusAccepted: '#D1FAE5',
  statusAcceptedText: '#065F46',
  statusDeclined: '#FEE2E2',
  statusDeclinedText: '#991B1B',

  // Accessibility
  focusRing: '#F5D0FE',
  focusRingStrong: '#F0ABFC',
};

export const typography = {
  fontFamily: {
    sans: 'System',
    mono: 'monospace',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 44,
    '6xl': 56, // Added for big hero titles
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};

export const spacing = {
  xxs: 2,
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 120, // Added for hero spacing
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: 'rgba(15, 23, 42, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  md: {
    shadowColor: 'rgba(217, 70, 239, 0.12)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 22,
    elevation: 8,
  },
  lg: {
    shadowColor: 'rgba(15, 23, 42, 0.12)',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 12,
  },
  glass: {
    shadowColor: 'rgba(15, 23, 42, 0.08)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
  },
};

export const animation = {
  fast: 150,
  normal: 250,
  slow: 350,
};

export const layout = {
  contentMaxWidth: 1280,
  wideContentMaxWidth: 1440,
  pageGutter: spacing.lg,
};
