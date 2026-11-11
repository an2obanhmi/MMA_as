import { Platform } from 'react-native';
import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';

export const LightColors = {
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
  cardShadow: '#111111',

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

export const DarkColors: typeof LightColors = {
  // Backgrounds
  background: '#0F1012',       // Pure dark obsidian
  surface: '#1A1B20',          // Deep charcoal surface container
  surfaceSecondary: '#24262E', // Secondary dark surface
  darkObsidian: '#000000',

  // Text & Inks
  text: '#F7F7F5',             // Crisp white text
  textSecondary: '#A0A2AB',    // Soft muted light gray
  textMuted: '#686B75',        // Subdued label
  textInverted: '#111111',

  // Brutalist Line & Hard Shadows
  border: '#3F424E',           // Crisp visible boundary
  borderMuted: '#2D2F38',
  hardShadow: '#000000',
  cardShadow: '#000000',

  // Accent Colors (Remain vibrant Neo-Brutalist pops)
  accentElectric: '#E2F952',   // High-voltage Lime
  accentBlue: '#38BDF8',       // Bright Sky Blue (readable on dark)
  accentOrange: '#FF5A36',     // Raw vermilion
  accentGreen: '#10B981',      // Emerald clean

  // Status Colors
  statusTodo: '#F7F7F5',
  statusTodoBg: '#24262E',
  statusInProgress: '#38BDF8',
  statusInProgressBg: '#132B45',
  statusDone: '#10B981',
  statusDoneBg: '#0F3628',

  // Priority Colors
  priorityHigh: '#FF5A36',
  priorityHighBg: '#3E1914',
  priorityMedium: '#F7F7F5',
  priorityMediumBg: '#24262E',
  priorityLow: '#A0A2AB',
  priorityLowBg: '#1A1B20',
};

export type ColorTheme = typeof LightColors;
export const Colors = LightColors;

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

// React Navigation Themes
export const CustomLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: LightColors.text,
    background: LightColors.background,
    card: LightColors.surface,
    text: LightColors.text,
    border: LightColors.border,
    notification: LightColors.accentOrange,
  },
};

export const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: DarkColors.text,
    background: DarkColors.background,
    card: DarkColors.surface,
    text: DarkColors.text,
    border: DarkColors.border,
    notification: DarkColors.accentOrange,
  },
};

