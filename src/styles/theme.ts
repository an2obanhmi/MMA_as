export const Colors = {
  primary: '#2563EB', // Blue
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  secondary: '#64748B', // Slate
  background: '#F8FAFC', // Off-white / light slate
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',

  // Status Colors
  statusTodo: '#3B82F6',
  statusTodoBg: '#EFF6FF',
  statusInProgress: '#F59E0B',
  statusInProgressBg: '#FFFBEB',
  statusDone: '#10B981',
  statusDoneBg: '#ECFDF5',

  // Priority Colors
  priorityHigh: '#EF4444',
  priorityHighBg: '#FEF2F2',
  priorityMedium: '#F59E0B',
  priorityMediumBg: '#FFFBEB',
  priorityLow: '#10B981',
  priorityLowBg: '#ECFDF5',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  fontFamily: undefined, // Default system font
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
};
