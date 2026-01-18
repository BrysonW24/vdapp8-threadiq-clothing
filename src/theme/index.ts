/**
 * ThreadIQ Theme
 * Calm by design. Minimal. Intelligent, not flashy.
 */

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// ThreadIQ Color Palette - Calm, sophisticated, wardrobe-inspired
export const colors = {
  // Primary - Charcoal/Slate (like a well-tailored suit)
  primary: {
    main: '#2D3436',
    light: '#636E72',
    dark: '#1E2022',
    contrast: '#FFFFFF',
  },
  // Accent - Warm Taupe (leather, natural fabrics)
  accent: {
    main: '#A68B6A',
    light: '#C9B99A',
    dark: '#7D6B52',
    contrast: '#FFFFFF',
  },
  // Background
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#E9ECEF',
    dark: '#1A1A1A',
  },
  // Surface
  surface: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    elevated: '#FFFFFF',
  },
  // Text
  text: {
    primary: '#1A1A1A',
    secondary: '#636E72',
    tertiary: '#95A5A6',
    inverse: '#FFFFFF',
    disabled: '#BDC3C7',
  },
  // Status
  status: {
    success: '#27AE60',
    warning: '#F39C12',
    error: '#E74C3C',
    info: '#3498DB',
  },
  // Care States (using kebab-case keys to match CareState type)
  care: {
    'clean': '#27AE60',
    'due-soon': '#F39C12',
    'overdue': '#E74C3C',
    'in-care': '#3498DB',
  } as Record<string, string>,
  // Border
  border: {
    light: '#E9ECEF',
    default: '#DEE2E6',
    dark: '#ADB5BD',
  },
  // Card
  card: {
    background: '#FFFFFF',
    border: '#E9ECEF',
  },
};

// Spacing (8pt grid)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Typography
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

// React Native Paper Theme
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary.main,
    secondary: colors.accent.main,
    tertiary: colors.accent.light,
    error: colors.status.error,
    background: colors.background.primary,
    surface: colors.surface.primary,
    surfaceVariant: colors.background.secondary,
    onPrimary: colors.primary.contrast,
    onSecondary: colors.accent.contrast,
    onBackground: colors.text.primary,
    onSurface: colors.text.primary,
    onSurfaceVariant: colors.text.secondary,
    onError: '#FFFFFF',
    outline: colors.border.default,
    outlineVariant: colors.border.light,
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.accent.main,
    secondary: colors.accent.light,
    tertiary: colors.accent.light,
    error: colors.status.error,
    background: colors.background.dark,
    surface: '#1E1E1E',
    surfaceVariant: '#2D2D2D',
    onPrimary: colors.text.primary,
    onSecondary: colors.text.primary,
    onBackground: colors.text.inverse,
    onSurface: colors.text.inverse,
    onSurfaceVariant: colors.text.tertiary,
    onError: '#FFFFFF',
    outline: '#3D3D3D',
    outlineVariant: '#2D2D2D',
  },
};

export const theme = lightTheme;
export { lightTheme, darkTheme };
