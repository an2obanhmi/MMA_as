import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, Fonts, BrutalShadow } from '../styles/theme';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('// ERROR: BOTH EMAIL AND PASSWORD ARE REQUIRED');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await login(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('// ERROR: INVALID EMAIL OR PASSWORD');
      } else if (err.code === 'auth/invalid-email') {
        setError('// ERROR: INVALID EMAIL FORMAT');
      } else {
        setError(`// ERROR: ${err.message || 'LOGIN FAILED'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Brand Header */}
        <View style={styles.brandBox}>
          <Text style={styles.brandMeta}>{'// PRACTICAL EXAM 02'}</Text>
          <Text style={styles.brandTitle}>AUTH.</Text>
          <Text style={styles.brandSubtitle}>
            Secure entry gate for collaborative team workspaces.
          </Text>
        </View>

        {/* Card Form */}
        <View style={styles.formCard}>
          <Text style={styles.formCardHeader}>[SIGN IN // CREDENTIALS]</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Email input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>OPERATOR EMAIL*</Text>
            <TextInput
              style={styles.input}
              placeholder="operator@company.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (error) setError(null);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PASSPHRASE*</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••••••"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (error) setError(null);
              }}
              secureTextEntry
            />
          </View>

          {/* Submit CTA */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={Colors.text} size="small" />
            ) : (
              <Text style={styles.submitBtnText}>AUTHENTICATE -{'>'}</Text>
            )}
          </TouchableOpacity>

          {/* Switch to SignUp */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>NEW OPERATOR?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.7}
            >
              <Text style={styles.switchLink}>[REGISTER ACCOUNT]</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  brandBox: {
    marginBottom: Spacing.xl,
  },
  brandMeta: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  brandSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  brandTitle: {
    color: Colors.text,
    fontFamily: Fonts.display,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  errorBox: {
    backgroundColor: '#FFEBE6',
    borderColor: Colors.accentOrange,
    borderWidth: 1.5,
    marginBottom: Spacing.md,
    padding: Spacing.sm,
  },
  errorText: {
    color: Colors.accentOrange,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '800',
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
    padding: Spacing.lg,
    ...BrutalShadow,
  },
  formCardHeader: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 13,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  submitBtn: {
    alignItems: 'center',
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderWidth: 2,
    justifyContent: 'center',
    marginTop: Spacing.sm,
    paddingVertical: 14,
    ...BrutalShadow,
  },
  submitBtnText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  switchLink: {
    color: Colors.accentBlue,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.lg,
  },
  switchText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '600',
  },
});
