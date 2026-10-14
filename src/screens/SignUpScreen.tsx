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
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, Fonts, BrutalShadow } from '../styles/theme';
import { getFirebaseAuthErrorMessage } from '../utils/authErrorHandler';
import { ToastBanner, ToastConfig } from '../components/ToastBanner';

interface SignUpScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { signup } = useAuth();

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
              placeholderTextColor={Colors.textMuted}
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
              placeholderTextColor={Colors.textMuted}
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
                placeholderTextColor={Colors.textMuted}
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
                  color={Colors.text}
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
                placeholderTextColor={Colors.textMuted}
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
                  color={Colors.text}
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
              <ActivityIndicator color={Colors.text} size="small" />
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
    fontSize: 13,
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
  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  inputFocused: {
    borderColor: Colors.accentBlue,
    backgroundColor: '#FAFAFF',
  },
  inputMismatch: {
    borderColor: Colors.accentOrange,
    backgroundColor: '#FFF5F2',
  },
  mismatchText: {
    color: Colors.accentOrange,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  passwordInput: {
    color: Colors.text,
    flex: 1,
    fontFamily: Fonts.mono,
    fontSize: 13,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  passwordWrapper: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
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
