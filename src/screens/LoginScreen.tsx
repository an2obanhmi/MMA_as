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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, Fonts, BrutalShadow, BrutalShadowSmall } from '../styles/theme';
import { getFirebaseAuthErrorMessage } from '../utils/authErrorHandler';
import { ToastBanner, ToastConfig } from '../components/ToastBanner';

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Focus tracking for input styling
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<ToastConfig | null>(null);

  // Forgot Password Modal states
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

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

  const handleSendResetEmail = async () => {
    if (!resetEmail.trim()) {
      showToast('Vui lòng cung cấp địa chỉ email nhận liên kết khôi phục.', 'error');
      return;
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail.trim())) {
      showToast('Địa chỉ email không đúng định dạng.', 'error');
      return;
    }

    try {
      setResetLoading(true);
      await resetPassword(resetEmail);
      setForgotModalVisible(false);
      setResetEmail('');
      showToast(
        'Đã gửi liên kết khôi phục tới email của bạn. Vui lòng kiểm tra hộp thư (kể cả mục Spam)!',
        'success'
      );
    } catch (err: unknown) {
      const friendlyMsg = getFirebaseAuthErrorMessage(err);
      showToast(friendlyMsg, 'error');
    } finally {
      setResetLoading(false);
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
              onPress={() => {
                setResetEmail(email.trim());
                setForgotModalVisible(true);
              }}
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
      <Modal
        visible={forgotModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setForgotModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalSub}>{'// RECOVERY PROTOCOL'}</Text>
                <Text style={styles.modalTitle}>KHÔI PHỤC MẬT KHẨU</Text>
              </View>
              <TouchableOpacity
                onPress={() => setForgotModalVisible(false)}
                style={styles.closeBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Nhập email tài khoản của bạn. Hệ thống sẽ gửi một liên kết an toàn để bạn thiết lập lại mật khẩu mới.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>EMAIL NHẬN LIÊN KẾT*</Text>
              <TextInput
                style={styles.input}
                placeholder="operator@company.com"
                placeholderTextColor={Colors.textMuted}
                value={resetEmail}
                onChangeText={setResetEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setForgotModalVisible(false)}
                disabled={resetLoading}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>HỦY BỎ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetSubmitBtn}
                onPress={handleSendResetEmail}
                disabled={resetLoading}
                activeOpacity={0.8}
              >
                {resetLoading ? (
                  <ActivityIndicator color={Colors.text} size="small" />
                ) : (
                  <Text style={styles.resetSubmitBtnText}>GỬI LIÊN KẾT -{'>'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  cancelBtn: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  cancelBtnText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '800',
  },
  closeBtn: {
    borderColor: Colors.border,
    borderWidth: 2,
    padding: 4,
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
  modalActionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  modalDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  modalHeader: {
    alignItems: 'flex-start',
    borderBottomColor: Colors.border,
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 16, 18, 0.75)',
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalSheet: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderWidth: 2.5,
    padding: Spacing.lg,
    width: '100%',
    ...BrutalShadow,
  },
  modalSub: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
  },
  modalTitle: {
    color: Colors.text,
    fontFamily: Fonts.display,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
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
  resetSubmitBtn: {
    alignItems: 'center',
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderWidth: 2,
    flex: 2,
    justifyContent: 'center',
    paddingVertical: 12,
    ...BrutalShadowSmall,
  },
  resetSubmitBtnText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '900',
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
