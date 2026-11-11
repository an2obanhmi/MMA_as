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

interface SignUpScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { signup } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Focus tracking
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const [loading, setLoading] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleSignUp = async () => {
    // 1. Validation: Name
    if (!name.trim()) {
      showToast('Vui lòng nhập họ và tên của bạn.', 'error');
      return;
    }

    // 2. Validation: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      showToast('Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.', 'error');
      return;
    }

    // 3. Validation: Password length
    if (password.length < 6) {
      showToast('Mật khẩu quá ngắn (yêu cầu tối thiểu 6 ký tự).', 'error');
      return;
    }

    // 4. Validation: Confirm Password match
    if (password !== confirmPassword) {
      showToast('Mật khẩu xác nhận không trùng khớp. Vui lòng nhập lại.', 'error');
      return;
    }

    try {
      setLoading(true);
      await signup(name, email, password);
      showToast('Đăng ký tài khoản thành công! Bạn có thể sử dụng ngay.', 'success');
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
          <Text style={styles.brandMeta}>{'// NEW ENROLLMENT'}</Text>
          <Text style={styles.brandTitle}>SIGN UP.</Text>
          <Text style={styles.brandSubtitle}>
            Thiết lập danh tính tài khoản để tham gia không gian nhóm.
          </Text>
        </View>

        {/* Card Form */}
        <View style={styles.formCard}>
          <Text style={styles.formCardHeader}>[REGISTRATION // ĐĂNG KÝ MỚI]</Text>

          {/* Name input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>HỌ VÀ TÊN*</Text>
            <TextInput
              style={[styles.input, nameFocused && styles.inputFocused]}
              placeholder="Nguyễn Văn A"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
            />
          </View>

          {/* Email input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EMAIL CÔNG VIỆC*</Text>
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              placeholder="alex@company.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password input with toggle */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>MẬT KHẨU (TỐI THIỂU 6 KÝ TỰ)*</Text>
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

          {/* Confirm Password input with toggle */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>XÁC NHẬN LẠI MẬT KHẨU*</Text>
            <View
              style={[
                styles.passwordWrapper,
                confirmPasswordFocused && styles.inputFocused,
                confirmPassword.length > 0 &&
                  password !== confirmPassword &&
                  styles.inputMismatch,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••••••"
                placeholderTextColor={colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && password !== confirmPassword ? (
              <Text style={styles.mismatchText}>{'// Mật khẩu xác nhận chưa trùng khớp'}</Text>
            ) : null}
          </View>

          {/* Submit CTA */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#121212" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>TẠO TÀI KHOẢN MỚI -{'>'}</Text>
            )}
          </TouchableOpacity>

          {/* Switch to Login */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>ĐÃ CÓ TÀI KHOẢN?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.switchLink}>[ĐĂNG NHẬP TẠI ĐÂY]</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    inputMismatch: {
      backgroundColor: isDark ? '#3E1810' : '#FFF5F2',
      borderColor: colors.accentOrange,
    },
    mismatchText: {
      color: colors.accentOrange,
      fontFamily: Fonts.mono,
      fontSize: 10,
      fontWeight: '700',
      marginTop: 4,
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
      marginTop: Spacing.sm,
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
