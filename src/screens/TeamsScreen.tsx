import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts, BrutalShadow } from '../styles/theme';

export const TeamsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerMonoTag}>[MODULE // 02]</Text>
        <Text style={styles.headerTitle}>TEAMS.</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconSquare}>
            <Ionicons name="people-sharp" size={40} color={Colors.text} />
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>PRACTICAL EXAM 2</Text>
          </View>
          <Text style={styles.title}>COMING_SOON</Text>
          <Text style={styles.description}>
            Collaborative team workspaces, role assignments, and permission matrices will be unlocked in the next release cycle.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
    padding: Spacing.xl,
    width: '100%',
    ...BrutalShadow,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  description: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  header: {
    backgroundColor: Colors.background,
    borderBottomColor: Colors.border,
    borderBottomWidth: 2,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  headerMonoTag: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerTitle: {
    color: Colors.text,
    fontFamily: Fonts.display,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  iconSquare: {
    alignItems: 'center',
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderWidth: 2,
    height: 72,
    justifyContent: 'center',
    marginBottom: Spacing.md,
    width: 72,
    ...BrutalShadow,
  },
  tag: {
    backgroundColor: Colors.text,
    marginBottom: Spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    color: Colors.textInverted,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
});
