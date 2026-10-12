import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Colors, Spacing } from '../styles/theme';

export const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header
        title="User Profile"
        subtitle="Manage your personal preferences and account settings"
      />
      <View style={styles.content}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person-outline" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Guest User</Text>
        <Text style={styles.subtitle}>Public Mode (No Authentication Required)</Text>
        <Text style={styles.badge}>Practical Exam 2</Text>
        <Text style={styles.description}>
          Authentication, personalized workspace settings, and role-based permissions will be
          introduced in Practical Exam 2.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarCircle: {
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    marginBottom: Spacing.md,
    width: 100,
  },
  badge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    color: Colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: Spacing.md,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
});
