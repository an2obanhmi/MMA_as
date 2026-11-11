import React, { useState, useMemo } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, Fonts, BrutalShadow, ColorTheme } from '../styles/theme';
import { getFirebaseAuthErrorMessage } from '../utils/authErrorHandler';
import { ToastBanner, ToastConfig } from '../components/ToastBanner';

import { ForgotPasswordModal } from '../components/ForgotPasswordModal';

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Focus tracking for input styling
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<ToastConfig | null>(null);

  // Forgot Password Modal state
  const [forgotModalVisible, setForgotModalVisible] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      showToast('Vui lòng nhập đầy đủ email và mật khẩu.', 'error');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      showToast('Đăng nhập thành công! Đang chuyển hướng...', 'success');
    } catch (err: unknown) {
      const friendlyMsg = getFirebaseAuthErrorMessage(err);
      showToast(friendlyMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Toast Notification Banner */}
      <ToastBanner toast={toast} onDismiss={() => setToast(null)} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.brandBox}>
          <Text style={styles.brandMeta}>{'// PRACTICAL EXAM 02'}</Text>
          <Text style={styles.brandTitle}>AUTH.</Text>
          <Text style={styles.brandSubtitle}>
            Hệ thống xác thực tài khoản & không gian làm việc nhóm.
          </Text>
        </View>

        {/* Card Form */}
        <View style={styles.formCard}>
          <Text style={styles.formCardHeader}>[SIGN IN // ĐĂNG NHẬP]</Text>

          {/* Email input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ĐỊA CHỈ EMAIL*</Text>
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              placeholder="operator@company.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password input with Show/Hide toggle */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>MẬT KHẨU*</Text>
            <View style={[styles.passwordWrapper, passwordFocused && styles.inputFocused]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••••••"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password link */}
          <View style={styles.forgotRow}>
            <TouchableOpacity
              onPress={() => setForgotModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotLink}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          {/* Submit CTA */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#121212" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>ĐĂNG NHẬP -{'>'}</Text>
            )}
          </TouchableOpacity>

          {/* Switch to SignUp */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>CHƯA CÓ TÀI KHOẢN?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.7}
            >
              <Text style={styles.switchLink}>[ĐĂNG KÝ NGAY]</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        visible={forgotModalVisible}
        initialEmail={email}
        onClose={() => setForgotModalVisible(false)}
        onSuccess={() => {
          showToast('Đã gửi liên kết khôi phục tới email của bạn!', 'success');
        }}
      />
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: ColorTheme, isDark: boolean) =>
  StyleSheet.create({
    brandBox: {
      marginBottom: Spacing.xl,
    },
    brandMeta: {
      color: colors.textSecondary,
      fontFamily: Fonts.mono,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      marginBottom: 4,
    },
    brandSubtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      marginTop: 4,
    },
    brandTitle: {
      color: colors.text,
      fontFamily: Fonts.display,
      fontSize: 48,
      fontWeight: '900',
      letterSpacing: -2,
    },
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    eyeBtn: {
      alignItems: 'center',
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    fieldGroup: {
      marginBottom: Spacing.md,
    },
    fieldLabel: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1,
      marginBottom: 6,
    },
    forgotLink: {
      color: colors.accentBlue,
      fontFamily: Fonts.mono,
      fontSize: 12,
      fontWeight: '800',
    },
    forgotRow: {
      alignItems: 'flex-end',
      marginBottom: Spacing.md,
      marginTop: -4,
    },
    formCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 2,
      padding: Spacing.lg,
      ...BrutalShadow,
    },
    formCardHeader: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 0.5,
      marginBottom: Spacing.md,
    },
    input: {
      backgroundColor: isDark ? colors.background : colors.surface,
      borderColor: colors.border,
      borderWidth: 2,
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 13,
      paddingHorizontal: Spacing.md,
      paddingVertical: 12,
    },
    inputFocused: {
      backgroundColor: isDark ? '#2A2C18' : '#FFFDEB',
      borderColor: colors.accentElectric,
      borderWidth: 2.5,
    },
    passwordInput: {
      color: colors.text,
      flex: 1,
      fontFamily: Fonts.mono,
      fontSize: 13,
      paddingHorizontal: Spacing.md,
      paddingVertical: 12,
    },
    passwordWrapper: {
      alignItems: 'center',
      backgroundColor: isDark ? colors.background : colors.surface,
      borderColor: colors.border,
      borderWidth: 2,
      flexDirection: 'row',
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: Spacing.lg,
    },
    submitBtn: {
      alignItems: 'center',
      backgroundColor: colors.accentElectric,
      borderColor: colors.border,
      borderWidth: 2,
      justifyContent: 'center',
      marginTop: Spacing.xs,
      paddingVertical: 14,
      ...BrutalShadow,
    },
    submitBtnText: {
      color: '#121212',
      fontFamily: Fonts.mono,
      fontSize: 13,
      fontWeight: '900',
      letterSpacing: 1,
    },
    switchLink: {
      color: colors.accentBlue,
      fontFamily: Fonts.mono,
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
    switchRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      marginTop: Spacing.lg,
    },
    switchText: {
      color: colors.textSecondary,
      fontFamily: Fonts.mono,
      fontSize: 12,
      fontWeight: '600',
    },
  });
