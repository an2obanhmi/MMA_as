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

import { ForgotPasswordModal } from '../components/ForgotPasswordModal';

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();

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
              placeholderTextColor={Colors.textMuted}
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
              <ActivityIndicator color={Colors.text} size="small" />
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
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
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
  forgotLink: {
    color: Colors.accentBlue,
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
    marginTop: Spacing.xs,
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
