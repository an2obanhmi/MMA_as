import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors, ColorTheme } from '../styles/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  themeMode: ThemeMode;
  theme: 'light' | 'dark';
  isDark: boolean;
  colors: ColorTheme;
  isReady: boolean;
  toggleTheme: () => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setTheme: (mode: 'light' | 'dark') => Promise<void>;
}

const THEME_STORAGE_KEY = '@antigravity_theme_mode';

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isReady, setIsReady] = useState(false);

  // Load saved theme preference on initial mount
  useEffect(() => {
    let isMounted = true;
    const loadThemePreference = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (isMounted && savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system')) {
          setThemeModeState(savedMode as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme preference from storage:', error);
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    loadThemePreference();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update theme mode and persist to AsyncStorage
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to persist theme preference:', error);
    }
  }, []);

  // Backwards compatible setTheme
  const setTheme = useCallback(
    async (mode: 'light' | 'dark') => {
      await setThemeMode(mode);
    },
    [setThemeMode]
  );

  // Derive active dark status: if system, follow OS; otherwise follow explicit choice
  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  const theme: 'light' | 'dark' = isDark ? 'dark' : 'light';
  const colors: ColorTheme = isDark ? DarkColors : LightColors;

  // Toggle between light and dark
  const toggleTheme = useCallback(async () => {
    const nextMode: ThemeMode = isDark ? 'light' : 'dark';
    await setThemeMode(nextMode);
  }, [isDark, setThemeMode]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        theme,
        isDark,
        colors,
        isReady,
        toggleTheme,
        setThemeMode,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
