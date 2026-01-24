// TutorMatch UK — MVP Design System Tokens
// A calm, professional, world-class design system for UK trust and clarity.
// 8pt Grid System

export const colors = {
  // Primary — Deep blue, trustworthy. Use sparingly for CTAs and key highlights.
  primary: '#1E40AF',
  primaryDark: '#1E3A8A',
  primaryHover: '#1E3A8A',
  primaryLight: '#DBEAFE',
  primarySoft: '#EFF6FF',

  // Secondary accent (reserved for future use)
  secondary: '#6366F1',
  accent: '#8B5CF6',
  focusRing: 'rgba(30, 64, 175, 0.4)',

  // Neutrals — The calm foundation of the UI
  neutrals: {
    background: '#FAFBFC',    // Page background (slightly cooler)
    surface: '#FFFFFF',       // Cards, panels
    surfaceAlt: '#F4F6F8',    // Subtle alternate backgrounds
    border: '#E5E7EB',        // Default borders
    borderAlt: '#D1D5DB',     // Stronger borders when needed
    textPrimary: '#111827',   // Main headings and important text
    textSecondary: '#4B5563', // Body text (WCAG AA compliant)
    textMuted: '#9CA3AF',     // Hints, placeholders, captions
    placeholder: '#9CA3AF',
  },

  // Semantic Status Colours
  success: '#059669',
  successLight: '#ECFDF5',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEF2F2',
  info: '#2563EB',
  infoLight: '#DBEAFE',

  // Rating stars
  ratingStars: '#F59E0B',
  ratingMuted: '#E5E7EB',

  // Trust Badge Colours (UK-appropriate, subtle)
  trust: {
    dbs: '#059669',           // DBS green
    dbsLight: '#ECFDF5',
    certified: '#1E40AF',     // Certification blue
    certifiedLight: '#EFF6FF',
    verified: '#6366F1',      // Future verified status
    verifiedLight: '#EEF2FF',
  },

  // Booking Status Chips
  status: {
    pending: { bg: '#FEF3C7', text: '#92400E' },
    accepted: { bg: '#ECFDF5', text: '#065F46' },
    declined: { bg: '#FEF2F2', text: '#991B1B' },
    completed: { bg: '#F4F6F8', text: '#4B5563' },
  },

  // Category accent colours (for category tiles only)
  categories: {
    purple: '#8B5CF6',
    blue: '#3B82F6',
    green: '#10B981',
    pink: '#EC4899',
    orange: '#F59E0B',
    indigo: '#6366F1',
    red: '#EF4444',
    teal: '#14B8A6',
  }
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
    '5xl': 48,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
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
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 96,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 12,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  glass: {
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  }
};

export const layout = {
  contentMaxWidth: 1200, // Standard web grid width
  wideContentMaxWidth: 1440,
  pageGutter: spacing.md,
};

export const animation = {
  fast: 150,
  normal: 250,
  slow: 350,
};
