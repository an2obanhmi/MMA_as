import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, Fonts, BrutalShadow } from '../styles/theme';

export const ProfileScreen: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      '// TERMINATE SESSION',
      'Are you sure you want to log out from this device?',
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'LOGOUT',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoggingOut(true);
              await logout();
            } catch (err) {
              Alert.alert('// ERROR', 'Failed to log out.');
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Editorial Header */}
      <View style={styles.header}>
        <Text style={styles.headerMonoTag}>[MODULE // 03]</Text>
        <Text style={styles.headerTitle}>PROFILE.</Text>
      </View>

      <View style={styles.content}>
        {/* User Identity Card */}
        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            {userProfile?.avatarUrl ? (
              <Image
                source={{ uri: userProfile.avatarUrl }}
                style={styles.avatarImg}
              />
            ) : (
              <View style={styles.avatarSquare}>
                <Ionicons name="person-sharp" size={40} color={Colors.text} />
              </View>
            )}
          </View>

          <Text style={styles.userName}>
            {userProfile?.name || 'OPERATOR'}
          </Text>
          <Text style={styles.userEmail}>
            {userProfile?.email || user?.email || 'N/A'}
          </Text>

          {/* Metadata badges */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>OPERATOR ID:</Text>
              <Text style={styles.infoVal}>
                {user?.uid.substring(0, 10).toUpperCase()}...
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>AUTH PROVIDER:</Text>
              <Text style={styles.infoVal}>FIREBASE EMAIL/PASS</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>STATUS:</Text>
              <Text style={[styles.infoVal, { color: Colors.accentGreen }]}>
                AUTHENTICATED // ACTIVE
              </Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            disabled={loggingOut}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={18} color={Colors.text} />
            <Text style={styles.logoutBtnText}>TERMINATE SESSION [LOGOUT]</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  avatarImg: {
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderWidth: 2,
    height: 84,
    width: 84,
    ...BrutalShadow,
  },
  avatarSquare: {
    alignItems: 'center',
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderWidth: 2,
    height: 84,
    justifyContent: 'center',
    width: 84,
    ...BrutalShadow,
  },
  avatarWrapper: {
    marginBottom: Spacing.md,
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
    padding: Spacing.md,
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
    marginVertical: Spacing.lg,
    padding: Spacing.md,
    width: '100%',
  },
  infoKey: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoVal: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '800',
  },
  logoutBtn: {
    alignItems: 'center',
    backgroundColor: Colors.accentOrange,
    borderColor: Colors.border,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 14,
    width: '100%',
    ...BrutalShadow,
  },
  logoutBtnText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  userEmail: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  userName: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
