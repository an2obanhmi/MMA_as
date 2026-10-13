import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts, BrutalShadow } from '../styles/theme';

export const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerMonoTag}>[MODULE // 03]</Text>
        <Text style={styles.headerTitle}>PROFILE.</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatarSquare}>
            <Ionicons name="person-sharp" size={40} color={Colors.text} />
          </View>
          <Text style={styles.userName}>GUEST_OPERATOR</Text>
          <Text style={styles.userRole}>{'// UNRESTRICTED PUBLIC ACCESS'}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>MODE: PRACTICAL_EXAM_01</Text>
            <Text style={styles.infoText}>FIREBASE: FIRESTORE TEST BED</Text>
          </View>

          <View style={styles.tag}>
            <Text style={styles.tagText}>PRACTICAL EXAM 2</Text>
          </View>
          <Text style={styles.description}>
            Authentication, user credential synchronization, and customizable security rules will be activated in Practical Exam 2.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarSquare: {
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
  infoBox: {
    backgroundColor: Colors.surfaceSecondary,
    borderColor: Colors.border,
    borderWidth: 1.5,
    marginVertical: Spacing.md,
    padding: Spacing.sm,
    width: '100%',
  },
  infoText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
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
  userName: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  userRole: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
});
