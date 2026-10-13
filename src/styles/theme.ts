import { Platform } from 'react-native';

export const Colors = {
  // Backgrounds
  background: '#F7F7F5',       // Warm crafted off-white
  surface: '#FFFFFF',          // Clean white container
  surfaceSecondary: '#EFEFEA', // Light contrasting surface
  darkObsidian: '#0F1012',     // Dark fallback / pure black elements

  // Text & Inks
  text: '#111111',             // Deep charcoal printer ink
  textSecondary: '#555555',    // Muted dark
  textMuted: '#888888',        // Secondary annotation ink
  textInverted: '#F7F7F5',

  // Brutalist Line & Hard Shadows
  border: '#111111',           // Hard boundary
  borderMuted: '#D8D8D3',
  hardShadow: '#111111',

  // Accent Colors (Neo-Brutalist & Editorial Pops)
  accentElectric: '#E2F952',   // Acid Lime / Electric Yellow
  accentBlue: '#002FA7',       // International Klein Blue
  accentOrange: '#FF5A36',     // Raw vermilion
  accentGreen: '#10B981',      // Emerald clean

  // Status Colors
  statusTodo: '#111111',
  statusTodoBg: '#FFFFFF',
  statusInProgress: '#002FA7',
  statusInProgressBg: '#EBF0FF',
  statusDone: '#10B981',
  statusDoneBg: '#E6FBF2',

  // Priority Colors
  priorityHigh: '#FF5A36',
  priorityHighBg: '#FFEBE6',
  priorityMedium: '#111111',
  priorityMediumBg: '#EFEFEA',
  priorityLow: '#666666',
  priorityLowBg: '#F3F3F0',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const Fonts = {
  mono: Platform.select({
    ios: 'Courier',
    android: 'monospace',
    default: 'monospace',
  }),
  display: Platform.select({
    ios: 'Helvetica Neue',
    android: 'sans-serif-black',
    default: 'sans-serif',
  }),
};

export const BrutalShadow = {
  shadowColor: '#111111',
  shadowOffset: { width: 3, height: 3 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 4,
};

export const BrutalShadowSmall = {
  shadowColor: '#111111',
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 2,
};
