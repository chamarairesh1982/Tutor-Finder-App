// Design System Tokens based on DESIGN_SYSTEM.md with desktop-friendly scale

export const colors = {
  // Brand
  primary: '#4F46E5', // Indigo-600
  primaryDark: '#312E81', // Indigo-900
  primaryLight: '#6366F1', // Indigo-500
  primarySoft: '#EEF2FF', // Indigo-50

  secondary: '#0EA5E9', // Sky-500
  secondaryDark: '#0369A1', // Sky-700

  accent: '#F59E0B', // Amber-500

  // Rating
  ratingStars: '#FBBF24', // Amber-400

  // Neutrals - Light Mode
  neutrals: {
    background: '#F6F7FB',
    surface: '#FFFFFF',
    surfaceAlt: '#F3F4F6',
    border: '#E2E8F0',
    cardBorder: '#E5E7EB',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    placeholder: '#94A3B8',
  },

  // Neutrals - Dark Mode
  darkNeutrals: {
    background: '#0B1221',
    surface: '#111827',
    surfaceAlt: '#1F2937',
    border: '#1F2937',
    cardBorder: '#334155',
    textPrimary: '#E2E8F0',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    placeholder: '#94A3B8',
  },

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Status Chip
  statusPending: '#FEF3C7',
  statusPendingText: '#92400E',
  statusAccepted: '#D1FAE5',
  statusAcceptedText: '#065F46',
  statusDeclined: '#FEE2E2',
  statusDeclinedText: '#991B1B',

  // Accessibility
  focusRing: '#C7D2FE',
  focusRingStrong: '#A5B4FC',
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
    shadowColor: 'rgba(15, 23, 42, 0.18)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  md: {
    shadowColor: 'rgba(79, 70, 229, 0.16)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 22,
    elevation: 8,
  },
  lg: {
    shadowColor: 'rgba(15, 23, 42, 0.18)',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 12,
  },
  glass: {
    shadowColor: 'rgba(15, 23, 42, 0.12)',
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
