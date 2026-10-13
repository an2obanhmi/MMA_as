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

interface SignUpScreenProps {
  navigation: any;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!name.trim()) {
      setError('// ERROR: FULL NAME IS REQUIRED');
      return;
    }
    if (!email.trim()) {
      setError('// ERROR: EMAIL IS REQUIRED');
      return;
    }
    if (password.length < 6) {
      setError('// ERROR: PASSPHRASE MUST BE AT LEAST 6 CHARACTERS');
      return;
    }
    if (password !== confirmPassword) {
      setError('// ERROR: PASSPHRASES DO NOT MATCH');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await signup(name, email, password);
    } catch (err: any) {
      console.error('SignUp error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('// ERROR: EMAIL ALREADY REGISTERED');
      } else if (err.code === 'auth/invalid-email') {
        setError('// ERROR: INVALID EMAIL FORMAT');
      } else {
        setError(`// ERROR: ${err.message || 'REGISTRATION FAILED'}`);
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
          <Text style={styles.brandMeta}>{'// NEW ENROLLMENT'}</Text>
          <Text style={styles.brandTitle}>SIGN UP.</Text>
          <Text style={styles.brandSubtitle}>
            Create your operator identity to unlock collaborative features.
          </Text>
        </View>

        {/* Card Form */}
        <View style={styles.formCard}>
          <Text style={styles.formCardHeader}>[REGISTRATION PROTOCOL]</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Name input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>OPERATOR NAME*</Text>
            <TextInput
              style={styles.input}
              placeholder="Alex Vance"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (error) setError(null);
              }}
            />
          </View>

          {/* Email input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>WORK EMAIL*</Text>
            <TextInput
              style={styles.input}
              placeholder="alex@company.com"
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
            <Text style={styles.fieldLabel}>PASSPHRASE (MIN 6 CHARS)*</Text>
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

          {/* Confirm Password input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CONFIRM PASSPHRASE*</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••••••"
              placeholderTextColor={Colors.textMuted}
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                if (error) setError(null);
              }}
              secureTextEntry
            />
          </View>

          {/* Submit CTA */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={Colors.text} size="small" />
            ) : (
              <Text style={styles.submitBtnText}>CREATE OPERATOR ACCOUNT -{'>'}</Text>
            )}
          </TouchableOpacity>

          {/* Switch to Login */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>ALREADY ENROLLED?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.switchLink}>[SIGN IN HERE]</Text>
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
