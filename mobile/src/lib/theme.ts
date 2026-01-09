// Design System Tokens based on DESIGN_SYSTEM.md

export const colors = {
  // Brand
  primary: '#4F46E5', // Indigo-600
  primaryDark: '#3730A3', // Indigo-800
  primaryLight: '#6366F1', // Indigo-500
  primarySoft: '#EEF2FF', // Indigo-50

  secondary: '#10B981', // Emerald-500
  secondaryDark: '#059669', // Emerald-600

  accent: '#F59E0B', // Amber-500

  // Rating
  ratingStars: '#FBBF24', // Amber-400

  // Neutrals - Light Mode
  neutrals: {
    background: '#FFFFFF',
    surface: '#F9FAFB', // Gray-50
    surfaceAlt: '#F3F4F6', // Gray-100
    border: '#E5E7EB', // Gray-200
    textPrimary: '#111827', // Gray-900
    textSecondary: '#6B7280', // Gray-500
    textMuted: '#9CA3AF', // Gray-400
    placeholder: '#9CA3AF', // Gray-400
  },

  // Neutrals - Dark Mode
  darkNeutrals: {
    background: '#111827', // Gray-900
    surface: '#1F2937', // Gray-800
    surfaceAlt: '#374151', // Gray-700
    border: '#4B5563', // Gray-600
    textPrimary: '#F9FAFB', // Gray-50
    textSecondary: '#D1D5DB', // Gray-300
    textMuted: '#6B7280', // Gray-500
    placeholder: '#6B7280', // Gray-500
  },

  // Semantic
  success: '#10B981', // Emerald-500
  warning: '#F59E0B', // Amber-500
  error: '#EF4444', // Red-500
  info: '#3B82F6', // Blue-500

  // Status Chip
  statusPending: '#FEF3C7', // Amber-100
  statusPendingText: '#92400E', // Amber-800
  statusAccepted: '#D1FAE5', // Emerald-100
  statusAcceptedText: '#065F46', // Emerald-800
  statusDeclined: '#FEE2E2', // Red-100
  statusDeclinedText: '#991B1B', // Red-800
};

export const typography = {
  fontFamily: {
    sans: 'System', // Will use platform default
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
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  // New neumorphic/glass shadow
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  }
};

export const animation = {
  fast: 150,
  normal: 250,
  slow: 350,
};
