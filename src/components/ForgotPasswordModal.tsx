import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts, BrutalShadow, BrutalShadowSmall } from '../styles/theme';
import { sendResetPasswordEmail } from '../services/authService';

interface ForgotPasswordModalProps {
  visible: boolean;
  initialEmail?: string;
  onClose: () => void;
  onSuccess?: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  initialEmail = '',
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (visible) {
      setEmail(initialEmail);
      setErrorMessage(null);
      setLoading(false);
    }
  }, [visible, initialEmail]);

  const handleSubmit = async () => {
    setErrorMessage(null);

    try {
      setLoading(true);
      await sendResetPasswordEmail(email);

      const targetEmail = email.trim().toLowerCase();

      // Show clear actionable success alert
      Alert.alert(
        '// LIÊN KẾT ĐÃ ĐƯỢC GỬI',
        `Hệ thống đã gửi hướng dẫn đặt lại mật khẩu đến địa chỉ:\n${targetEmail}\n\n⚠️ LƯU Ý QUAN TRỌNG:\n• Vui lòng kiểm tra kỹ cả Hộp thư đến (Inbox) và mục Thư rác (Spam / Junk) của Gmail.\n• Liên kết có hiệu lực trong vòng 60 phút.`,
        [
          {
            text: 'ĐÃ HIỂU',
            onPress: () => {
              if (onSuccess) onSuccess(targetEmail);
              setEmail('');
              onClose();
            },
          },
        ]
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể gửi email đặt lại mật khẩu.';
      setErrorMessage(`// LỖI: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalSub}>{'// SECURE RECOVERY PROTOCOL'}</Text>
              <Text style={styles.modalTitle}>QUÊN MẬT KHẨU</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Ionicons name="close" size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.modalDesc}>
            Nhập địa chỉ email tài khoản của bạn. Firebase Auth sẽ gửi liên kết an toàn để bạn thiết lập lại mật khẩu mới trực tiếp trong Gmail.
          </Text>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={Colors.accentOrange} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Email Input Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ĐỊA CHỈ EMAIL TÀI KHOẢN*</Text>
            <TextInput
              style={[styles.input, isFocused && styles.inputFocused]}
              placeholder="example@gmail.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMessage) setErrorMessage(null);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.modalActionRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>HỦY BỎ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={Colors.text} size="small" />
              ) : (
                <Text style={styles.submitBtnText}>GỬI LIÊN KẾT -{'>'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  modalHeader: {
    alignItems: 'flex-start',
    borderBottomColor: Colors.border,
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  modalSub: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  modalTitle: {
    color: Colors.text,
    fontFamily: Fonts.display,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  closeBtn: {
    alignItems: 'center',
    borderColor: Colors.border,
    borderWidth: 2,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  modalDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  errorBox: {
    alignItems: 'center',
    backgroundColor: '#FFEBE6',
    borderColor: Colors.accentOrange,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
    padding: 10,
  },
  errorText: {
    color: Colors.accentOrange,
    flex: 1,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
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
    backgroundColor: '#FFFDEB',
    borderColor: Colors.border,
    borderWidth: 2.5,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
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
  submitBtn: {
    alignItems: 'center',
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderWidth: 2,
    flex: 2,
    justifyContent: 'center',
    paddingVertical: 12,
    ...BrutalShadowSmall,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
