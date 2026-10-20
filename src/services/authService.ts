import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

/**
 * Validates basic email format using standard regex.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Sends a password reset email to the specified email address using Firebase Authentication.
 * Handles input normalization (trim & lowercase), pre-validation, and provides granular Vietnamese error messages.
 *
 * @param rawEmail The user input email address
 * @throws Error with user-friendly message
 */
export const sendResetPasswordEmail = async (rawEmail: string): Promise<void> => {
  // 1. Sanitize and normalize email
  const email = (rawEmail || '').trim().toLowerCase();

  // 2. Pre-validation checks
  if (!email) {
    throw new Error('Vui lòng nhập địa chỉ email của bạn.');
  }

  if (!isValidEmail(email)) {
    throw new Error('Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.');
  }

  // 3. Dispatch to Firebase Authentication
  try {
    console.log(`[authService] Requesting password reset email for: "${email}"`);
    await sendPasswordResetEmail(auth, email);
    console.log(`[authService] sendPasswordResetEmail call succeeded for: "${email}"`);
  } catch (error: unknown) {
    console.error('[authService.sendResetPasswordEmail] Firebase error:', error);

    const err = error as { code?: string; message?: string };
    const code = err.code || '';

    switch (code) {
      case 'auth/invalid-email':
        throw new Error('Địa chỉ email không đúng định dạng.');
      case 'auth/user-not-found':
        throw new Error('Email này chưa được đăng ký tài khoản trong hệ thống.');
      case 'auth/too-many-requests':
        throw new Error('Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng đợi vài phút rồi thử lại.');
      case 'auth/network-request-failed':
        throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra lại kết nối Internet.');
      case 'auth/missing-email':
        throw new Error('Vui lòng cung cấp địa chỉ email.');
      default:
        throw new Error(err.message || 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.');
    }
  }
};
