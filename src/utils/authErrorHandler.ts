/**
 * Helper to convert Firebase Auth error codes into friendly, professional Vietnamese messages.
 */
export const getFirebaseAuthErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') {
    return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.';
  }

  const err = error as { code?: string; message?: string };
  const errorCode = err.code || '';

  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.';
    case 'auth/user-not-found':
      return 'Tài khoản không tồn tại. Vui lòng kiểm tra lại email hoặc đăng ký mới.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.';
    case 'auth/email-already-in-use':
      return 'Email này đã được sử dụng cho một tài khoản khác.';
    case 'auth/weak-password':
      return 'Mật khẩu quá yếu. Vui lòng đặt mật khẩu tối thiểu 6 ký tự.';
    case 'auth/too-many-requests':
      return 'Bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng đợi vài phút rồi thử lại.';
    case 'auth/user-disabled':
      return 'Tài khoản này đã bị khóa hoặc tạm ngưng hoạt động.';
    case 'auth/network-request-failed':
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra đường truyền Internet của bạn.';
    case 'auth/missing-password':
      return 'Vui lòng nhập mật khẩu của bạn.';
    case 'auth/missing-email':
      return 'Vui lòng cung cấp địa chỉ email.';
    default:
      return err.message ? `Lỗi: ${err.message}` : 'Đã xảy ra sự cố trong quá trình xác thực.';
  }
};
