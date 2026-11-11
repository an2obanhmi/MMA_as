import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, Fonts, BrutalShadowSmall, ColorTheme } from '../styles/theme';

interface HeaderProps {
  completedCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({ completedCount, totalCount }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  // Format current date: e.g. "OCT 13, 2026 // TUE"
  const now = new Date();
  const dayStr = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();

  return (
    <View style={styles.container}>
      {/* Top micro metadata bar */}
      <View style={styles.metaRow}>
        <Text style={styles.monoMeta}>
          {dateStr} {'//'} {dayStr}
        </Text>
        <View style={styles.badgeRatio}>
          <Text style={styles.badgeRatioText}>
            [{completedCount}/{totalCount} COMPLETED]
          </Text>
        </View>
      </View>

      {/* Hero Typography */}
      <View style={styles.titleRow}>
        <Text style={styles.massiveTitle}>TASKS.</Text>
        <View style={styles.accentBox}>
          <Text style={styles.accentBoxText}>V1.0</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Minimalist execution board. Less clutter, maximum focus.
      </Text>
    </View>
  );
};

const createStyles = (colors: ColorTheme, _isDark: boolean) =>
  StyleSheet.create({
    accentBox: {
      backgroundColor: colors.accentElectric,
      borderColor: colors.border,
      borderWidth: 2,
      marginBottom: 6,
      paddingHorizontal: 8,
      paddingVertical: 2,
      transform: [{ rotate: '-4deg' }],
      ...BrutalShadowSmall,
    },
    accentBoxText: {
      color: '#111111',
      fontFamily: Fonts.mono,
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 1,
    },
    badgeRatio: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.border,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    badgeRatioText: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    container: {
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
      borderBottomWidth: 2,
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.lg,
    },
    massiveTitle: {
      color: colors.text,
      fontFamily: Fonts.display,
      fontSize: 40,
      fontWeight: '900',
      letterSpacing: -1.5,
    },
    metaRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    monoMeta: {
      color: colors.textSecondary,
      fontFamily: Fonts.mono,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '500',
      marginTop: 2,
    },
    titleRow: {
      alignItems: 'flex-end',
      flexDirection: 'row',
      gap: 8,
    },
  });
