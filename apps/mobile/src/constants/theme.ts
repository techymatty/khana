export const COLORS = {
  primary: '#0F9D58',
  primaryDark: '#0B7A43',
  primaryLight: '#E8F5E9',
  primaryGradientStart: '#0F9D58',
  primaryGradientEnd: '#00C853',

  secondary: '#FF6B35',
  accent: '#FFB800',

  background: '#F5F7FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textOnPrimary: '#FFFFFF',

  border: '#E5E7EB',
  divider: '#F3F4F6',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  star: '#FFB800',
  halal: '#0F9D58',

  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

export const FONTS = {
  regular: { fontSize: 14, color: COLORS.text },
  medium: { fontSize: 16, fontWeight: '500' as const, color: COLORS.text },
  semibold: { fontSize: 16, fontWeight: '600' as const, color: COLORS.text },
  bold: { fontSize: 18, fontWeight: '700' as const, color: COLORS.text },
  h1: { fontSize: 28, fontWeight: '800' as const, color: COLORS.text },
  h2: { fontSize: 24, fontWeight: '700' as const, color: COLORS.text },
  h3: { fontSize: 20, fontWeight: '600' as const, color: COLORS.text },
  caption: { fontSize: 12, color: COLORS.textSecondary },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
