import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, Fonts, BrutalShadow, BrutalShadowSmall, ColorTheme } from '../styles/theme';
import { sendResetPasswordEmail } from '../services/authService';
import { getTasksRealtime } from '../services/taskService';
import { getUserTeamsRealtime } from '../services/teamService';
import { ToastBanner, ToastConfig } from '../components/ToastBanner';
import { Task } from '../types/task.types';

// 8 Retro / Cyberpunk Robot Avatar Presets
const AVATAR_PRESETS = [
  { id: 'p1', name: 'CyberBot', url: 'https://api.dicebear.com/7.x/bottts/png?seed=CyberBot' },
  { id: 'p2', name: 'Matrix', url: 'https://api.dicebear.com/7.x/bottts/png?seed=Matrix' },
  { id: 'p3', name: 'Glitch', url: 'https://api.dicebear.com/7.x/bottts/png?seed=Glitch' },
  { id: 'p4', name: 'Neon', url: 'https://api.dicebear.com/7.x/bottts/png?seed=Neon' },
  { id: 'p5', name: 'Vortex', url: 'https://api.dicebear.com/7.x/bottts/png?seed=Vortex' },
  { id: 'p6', name: 'Pulse', url: 'https://api.dicebear.com/7.x/bottts/png?seed=Pulse' },
  { id: 'p7', name: 'Terminal', url: 'https://api.dicebear.com/7.x/bottts/png?seed=Terminal' },
  { id: 'p8', name: 'Titan', url: 'https://api.dicebear.com/7.x/bottts/png?seed=Titan' },
];

export const ProfileScreen: React.FC = () => {
  const { user, userProfile, updateUserProfile, logout } = useAuth();
  const { isDark, colors, themeMode, setThemeMode } = useTheme();

  // State
  const [loggingOut, setLoggingOut] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [nameSaving, setNameSaving] = useState(false);
  const [toast, setToast] = useState<ToastConfig | null>(null);

  // Modals
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  // Dynamic Styles
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  // Stats
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    teams: 0,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // Real-time stats listener
  useEffect(() => {
    if (!user) return;

    // Listen to tasks
    const unsubTasks = getTasksRealtime(
      (allTasks: Task[]) => {
        const userTasks = allTasks.filter(
          (t) => t.assigneeId === user.uid || (!t.teamId && !t.assigneeId)
        );
        const targetTasks = userTasks.length > 0 ? userTasks : allTasks;
        const completed = targetTasks.filter((t) => t.status === 'Done').length;
        const pending = targetTasks.filter((t) => t.status !== 'Done').length;

        setStats((prev) => ({ ...prev, completed, pending }));
      },
      (err) => console.error('Error fetching tasks for stats:', err)
    );

    // Listen to teams
    const unsubTeams = getUserTeamsRealtime(
      user.uid,
      (userTeams) => {
        setStats((prev) => ({ ...prev, teams: userTeams.length }));
      },
      (err) => console.error('Error fetching teams for stats:', err)
    );

    return () => {
      unsubTasks();
      unsubTeams();
    };
  }, [user]);

  // Open Name Edit Modal
  const openEditNameModal = () => {
    setNewName(userProfile?.name || '');
    setNameError(null);
    setNameModalVisible(true);
  };

  // Save Display Name
  const handleSaveName = async () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setNameError('// LỖI: Tên hiển thị không được để trống.');
      return;
    }
    if (trimmed.length > 30) {
      setNameError('// LỖI: Tên hiển thị tối đa 30 ký tự.');
      return;
    }

    try {
      setNameSaving(true);
      setNameError(null);
      await updateUserProfile({ name: trimmed });
      setNameModalVisible(false);
      showToast('Đã cập nhật tên hiển thị thành công!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể lưu tên hiển thị.';
      setNameError(`// LỖI: ${msg}`);
    } finally {
      setNameSaving(false);
    }
  };

  // Save Avatar URL
  const handleSelectAvatarUrl = async (url: string) => {
    try {
      setAvatarLoading(true);
      setAvatarModalVisible(false);
      await updateUserProfile({ avatarUrl: url });
      showToast('Đã cập nhật ảnh đại diện thành công!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật ảnh.';
      showToast(msg, 'error');
    } finally {
      setAvatarLoading(false);
    }
  };

  // Pick Image from Gallery
  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('// QUYỀN TRUY CẬP', 'Ứng dụng cần quyền truy cập thư viện ảnh để đổi Avatar.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        await handleSelectAvatarUrl(uri);
      }
    } catch (err: unknown) {
      console.error('Gallery pick error:', err);
      showToast('Không thể chọn ảnh từ thư viện.', 'error');
    }
  };

  // Take photo with Camera
  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('// QUYỀN TRUY CẬP', 'Ứng dụng cần quyền sử dụng máy ảnh để chụp Avatar.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        await handleSelectAvatarUrl(uri);
      }
    } catch (err: unknown) {
      console.error('Camera capture error:', err);
      showToast('Không thể chụp ảnh mới.', 'error');
    }
  };

  // Password reset from profile
  const handleSecurityResetPassword = () => {
    const targetEmail = user?.email || userProfile?.email;
    if (!targetEmail) {
      showToast('Không tìm thấy địa chỉ email tài khoản.', 'error');
      return;
    }

    Alert.alert(
      '// ĐỔI MẬT KHẨU',
      `Bạn có muốn hệ thống gửi liên kết đặt lại mật khẩu an toàn đến hòm thư:\n${targetEmail}?`,
      [
        { text: 'HỦY', style: 'cancel' },
        {
          text: 'GỬI LIÊN KẾT',
          onPress: async () => {
            try {
              await sendResetPasswordEmail(targetEmail);
              Alert.alert(
                '// THÀNH CÔNG',
                `Đã gửi liên kết đặt lại mật khẩu tới:\n${targetEmail}\n\nVui lòng kiểm tra Hộp thư đến (Inbox) hoặc thư mục Thư rác (Spam/Junk) của Gmail.`
              );
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : 'Gửi email thất bại.';
              showToast(msg, 'error');
            }
          },
        },
      ]
    );
  };

  // Safe Logout confirmation
  const handleLogout = () => {
    Alert.alert(
      '// KẾT THÚC PHIÊN [LOGOUT]',
      'Bạn có chắc chắn muốn kết thúc phiên đăng nhập trên thiết bị này?',
      [
        { text: 'HỦY BỎ', style: 'cancel' },
        {
          text: 'ĐĂNG XUẤT',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoggingOut(true);
              await logout();
            } catch {
              Alert.alert('// LỖI', 'Không thể hoàn tất đăng xuất.');
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Toast Notification */}
      <ToastBanner
        toast={toast}
        onDismiss={() => setToast(null)}
      />

      {/* Editorial Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerMonoTag}>[MODULE // 03]</Text>
          <View style={styles.onlineBadge}>
            <View style={styles.greenPulseDot} />
            <Text style={styles.onlineBadgeText}>STATUS: ONLINE</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>PROFILE.</Text>
      </View>

      <View style={styles.content}>
        {/* User Identity Card */}
        <View style={styles.card}>
          {/* Avatar with Camera badge */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={() => setAvatarModalVisible(true)}
              activeOpacity={0.8}
            >
              {userProfile?.avatarUrl ? (
                <Image
                  source={{ uri: userProfile.avatarUrl }}
                  style={styles.avatarImg}
                />
              ) : (
                <View style={styles.avatarSquare}>
                  <Ionicons name="person-sharp" size={40} color={colors.text} />
                </View>
              )}

              {/* Loading overlay */}
              {avatarLoading ? (
                <View style={styles.avatarLoadingOverlay}>
                  <ActivityIndicator size="small" color={colors.text} />
                </View>
              ) : null}
            </TouchableOpacity>

            {/* Small camera badge */}
            <TouchableOpacity
              style={styles.cameraBadge}
              onPress={() => setAvatarModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={16} color="#111111" />
            </TouchableOpacity>
          </View>

          {/* Name with Edit pencil */}
          <View style={styles.nameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {userProfile?.name || 'OPERATOR'}
            </Text>
            <TouchableOpacity
              onPress={openEditNameModal}
              style={styles.editNameBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil" size={15} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userEmail}>
            {userProfile?.email || user?.email || 'N/A'}
          </Text>

          {/* Stats Grid Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statsCol}>
              <Text style={styles.statsLabel}>[COMPLETED]</Text>
              <Text style={[styles.statsValue, { color: colors.accentGreen }]}>
                {stats.completed}
              </Text>
              <Text style={styles.statsSub}>RESOLVED</Text>
            </View>

            <View style={[styles.statsCol, styles.statsColBorder]}>
              <Text style={styles.statsLabel}>[PENDING]</Text>
              <Text style={[styles.statsValue, { color: colors.accentBlue }]}>
                {stats.pending}
              </Text>
              <Text style={styles.statsSub}>ACTIVE</Text>
            </View>

            <View style={styles.statsCol}>
              <Text style={styles.statsLabel}>[TEAMS]</Text>
              <Text style={[styles.statsValue, { color: colors.accentOrange }]}>
                {stats.teams}
              </Text>
              <Text style={styles.statsSub}>WORKSPACE</Text>
            </View>
          </View>

          {/* Metadata badges */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>OPERATOR ID:</Text>
              <Text style={styles.infoVal}>
                {user?.uid.substring(0, 12).toUpperCase()}...
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>AUTH METHOD:</Text>
              <Text style={styles.infoVal}>FIREBASE SECURE AUTH</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>SESSION STATUS:</Text>
              <Text style={[styles.infoVal, { color: colors.accentGreen }]}>
                AUTHENTICATED // ACTIVE
              </Text>
            </View>
          </View>
        </View>

        {/* System & Preferences Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>SYSTEM & PREFERENCES</Text>

          {/* Change Password Card */}
          <TouchableOpacity
            style={styles.settingCard}
            onPress={handleSecurityResetPassword}
            activeOpacity={0.7}
          >
            <View style={styles.settingIconBox}>
              <Ionicons name="key-outline" size={20} color={colors.text} />
            </View>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>BẢO MẬT // ĐỔI MẬT KHẨU</Text>
              <Text style={styles.settingDesc}>Gửi liên kết khôi phục mật khẩu qua Gmail</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Theme Mode Selector Card */}
          <View style={styles.themeCard}>
            <View style={styles.themeCardHeader}>
              <View style={styles.settingIconBox}>
                <Ionicons
                  name={themeMode === 'system' ? 'phone-portrait-outline' : isDark ? 'moon' : 'sunny'}
                  size={20}
                  color={isDark ? colors.accentElectric : colors.text}
                />
              </View>
              <View style={styles.settingTextCol}>
                <Text style={styles.settingTitle}>GIAO DIỆN HỆ THỐNG</Text>
                <Text style={styles.settingDesc}>
                  {themeMode === 'system'
                    ? `HỆ THỐNG [${isDark ? 'TỐI' : 'SÁNG'}]`
                    : isDark
                    ? 'CHẾ ĐỘ: DARK [HIGH CONTRAST]'
                    : 'CHẾ ĐỘ: LIGHT [STANDARD NEO]'}
                </Text>
              </View>
            </View>

            {/* Segmented Controls for Light / Dark / System */}
            <View style={styles.themeSegmentContainer}>
              <TouchableOpacity
                style={[
                  styles.themeSegmentBtn,
                  themeMode === 'light' && styles.themeSegmentBtnActive,
                ]}
                onPress={() => setThemeMode('light')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="sunny-outline"
                  size={14}
                  color={themeMode === 'light' ? '#111111' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.themeSegmentText,
                    themeMode === 'light' && styles.themeSegmentTextActive,
                  ]}
                >
                  SÁNG
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeSegmentBtn,
                  themeMode === 'dark' && styles.themeSegmentBtnActive,
                ]}
                onPress={() => setThemeMode('dark')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="moon-outline"
                  size={14}
                  color={themeMode === 'dark' ? '#111111' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.themeSegmentText,
                    themeMode === 'dark' && styles.themeSegmentTextActive,
                  ]}
                >
                  TỐI
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeSegmentBtn,
                  themeMode === 'system' && styles.themeSegmentBtnActive,
                ]}
                onPress={() => setThemeMode('system')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="sync-outline"
                  size={14}
                  color={themeMode === 'system' ? '#111111' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.themeSegmentText,
                    themeMode === 'system' && styles.themeSegmentTextActive,
                  ]}
                >
                  TỰ ĐỘNG
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* System Version Card */}
          <View style={styles.versionCard}>
            <View style={styles.versionRow}>
              <Ionicons name="hardware-chip-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.versionMono}>SYSTEM VERSION // v1.2.0-STABLE</Text>
            </View>
            <Text style={styles.versionMeta}>KERNEL: EXPO 57 // REACT 19 // FIREBASE 13</Text>
          </View>
        </View>

        {/* Safe Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.8}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
              <Text style={styles.logoutBtnText}>[TERMINATE SESSION [LOGOUT]]</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* MODAL 1: EDIT DISPLAY NAME */}
      <Modal
        visible={nameModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalSub}>{'// IDENTITY PROTOCOL'}</Text>
                <Text style={styles.modalTitle}>ĐỔI TÊN HIỂN THỊ</Text>
              </View>
              <TouchableOpacity
                onPress={() => setNameModalVisible(false)}
                style={styles.closeBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Tên hiển thị này sẽ xuất hiện trên các công việc phân công và phòng trò chuyện nhóm của bạn.
            </Text>

            {nameError ? (
              <View style={styles.modalErrorBox}>
                <Ionicons name="alert-circle-outline" size={15} color={colors.accentOrange} />
                <Text style={styles.modalErrorText}>{nameError}</Text>
              </View>
            ) : null}

            <View style={styles.modalFieldGroup}>
              <Text style={styles.modalFieldLabel}>TÊN HIỂN THỊ MỚI (MAX 30)*</Text>
              <TextInput
                style={styles.modalInput}
                value={newName}
                onChangeText={(t) => {
                  setNewName(t);
                  if (nameError) setNameError(null);
                }}
                maxLength={30}
                placeholder="Nhập tên mới..."
                placeholderTextColor={colors.textMuted}
                autoFocus
              />
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setNameModalVisible(false)}
                disabled={nameSaving}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>HỦY BỎ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSaveName}
                disabled={nameSaving}
                activeOpacity={0.8}
              >
                {nameSaving ? (
                  <ActivityIndicator size="small" color="#111111" />
                ) : (
                  <Text style={styles.modalSubmitText}>LƯU THAY ĐỔI -{'>'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: AVATAR PICKER (DEVICE UPLOAD & RETRO PRESETS) */}
      <Modal
        visible={avatarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalSub}>{'// AVATAR PROTOCOL'}</Text>
                <Text style={styles.modalTitle}>CẬP NHẬT AVATAR</Text>
              </View>
              <TouchableOpacity
                onPress={() => setAvatarModalVisible(false)}
                style={styles.closeBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Device Upload Options */}
            <Text style={styles.presetSectionTitle}>TÙY CHỌN 1: TẢI ẢNH TỪ THIẾT BỊ</Text>
            <View style={styles.deviceUploadRow}>
              <TouchableOpacity
                style={styles.uploadOptionBtn}
                onPress={handlePickFromGallery}
                activeOpacity={0.8}
              >
                <Ionicons name="images-outline" size={20} color={colors.text} />
                <Text style={styles.uploadOptionText}>CHỌN TỪ THƯ VIỆN</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadOptionBtn}
                onPress={handleTakePhoto}
                activeOpacity={0.8}
              >
                <Ionicons name="camera-outline" size={20} color={colors.text} />
                <Text style={styles.uploadOptionText}>CHỤP ẢNH MỚI</Text>
              </TouchableOpacity>
            </View>

            {/* Presets Grid */}
            <Text style={[styles.presetSectionTitle, { marginTop: Spacing.md }]}>
              TÙY CHỌN 2: BỘ AVATAR RETRO PRESETS
            </Text>
            <View style={styles.presetsGrid}>
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = userProfile?.avatarUrl === preset.url;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    style={[
                      styles.presetItem,
                      isSelected && styles.presetItemSelected,
                    ]}
                    onPress={() => handleSelectAvatarUrl(preset.url)}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: preset.url }} style={styles.presetImg} />
                    <Text style={styles.presetName}>{preset.name.toUpperCase()}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const createStyles = (colors: ColorTheme, isDark: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    scrollContent: {
      paddingBottom: Spacing.xxl,
    },
    header: {
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
      borderBottomWidth: 2,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
    },
    headerTopRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    headerMonoTag: {
      color: colors.textSecondary,
      fontFamily: Fonts.mono,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1,
    },
    headerTitle: {
      color: colors.text,
      fontFamily: Fonts.display,
      fontSize: 32,
      fontWeight: '900',
      letterSpacing: -1,
    },
    onlineBadge: {
      alignItems: 'center',
      backgroundColor: isDark ? '#0F3628' : '#E6FBF2',
      borderColor: colors.accentGreen,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    greenPulseDot: {
      backgroundColor: colors.accentGreen,
      borderRadius: 3,
      height: 6,
      width: 6,
    },
    onlineBadgeText: {
      color: colors.accentGreen,
      fontFamily: Fonts.mono,
      fontSize: 9,
      fontWeight: '800',
    },
    content: {
      padding: Spacing.md,
    },
    card: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 2,
      padding: Spacing.lg,
      width: '100%',
      ...BrutalShadow,
    },
    avatarContainer: {
      marginBottom: Spacing.md,
      position: 'relative',
    },
    avatarWrapper: {
      borderColor: colors.border,
      borderWidth: 2,
      overflow: 'hidden',
      ...BrutalShadow,
    },
    avatarImg: {
      backgroundColor: isDark ? colors.surfaceSecondary : colors.accentElectric,
      height: 96,
      width: 96,
    },
    avatarSquare: {
      alignItems: 'center',
      backgroundColor: isDark ? colors.surfaceSecondary : colors.accentElectric,
      height: 96,
      justifyContent: 'center',
      width: 96,
    },
    avatarLoadingOverlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
      bottom: 0,
      justifyContent: 'center',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    cameraBadge: {
      alignItems: 'center',
      backgroundColor: colors.accentElectric,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 2,
      bottom: -6,
      height: 32,
      justifyContent: 'center',
      position: 'absolute',
      right: -6,
      width: 32,
      ...BrutalShadowSmall,
    },
    nameRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
    },
    userName: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 22,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
    editNameBtn: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.border,
      borderWidth: 1.5,
      height: 28,
      justifyContent: 'center',
      width: 28,
    },
    userEmail: {
      color: colors.textSecondary,
      fontFamily: Fonts.mono,
      fontSize: 12,
      fontWeight: '700',
      marginTop: 4,
    },
    statsContainer: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.border,
      borderWidth: 2,
      flexDirection: 'row',
      marginTop: Spacing.lg,
      width: '100%',
      ...BrutalShadowSmall,
    },
    statsCol: {
      alignItems: 'center',
      flex: 1,
      paddingVertical: 12,
    },
    statsColBorder: {
      borderLeftColor: colors.border,
      borderLeftWidth: 1.5,
      borderRightColor: colors.border,
      borderRightWidth: 1.5,
    },
    statsLabel: {
      color: colors.textSecondary,
      fontFamily: Fonts.mono,
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    statsValue: {
      fontFamily: Fonts.display,
      fontSize: 24,
      fontWeight: '900',
      marginVertical: 2,
    },
    statsSub: {
      color: colors.textMuted,
      fontFamily: Fonts.mono,
      fontSize: 8,
      fontWeight: '700',
    },
    infoBox: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.border,
      borderWidth: 1.5,
      marginTop: Spacing.md,
      padding: Spacing.md,
      width: '100%',
    },
    infoKey: {
      color: colors.textSecondary,
      fontFamily: Fonts.mono,
      fontSize: 11,
      fontWeight: '700',
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    infoVal: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 11,
      fontWeight: '800',
    },
    settingsSection: {
      marginTop: Spacing.xl,
    },
    sectionTitle: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 1,
      marginBottom: Spacing.sm,
    },
    settingCard: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 2,
      flexDirection: 'row',
      marginBottom: Spacing.sm,
      padding: Spacing.md,
      ...BrutalShadowSmall,
    },
    settingIconBox: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.border,
      borderWidth: 1.5,
      height: 38,
      justifyContent: 'center',
      marginRight: Spacing.md,
      width: 38,
    },
    settingTextCol: {
      flex: 1,
    },
    settingTitle: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 12,
      fontWeight: '800',
    },
    settingDesc: {
      color: colors.textSecondary,
      fontSize: 11,
      marginTop: 2,
    },
    themeCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 2,
      marginBottom: Spacing.sm,
      padding: Spacing.md,
      ...BrutalShadowSmall,
    },
    themeCardHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: Spacing.md,
    },
    themeSegmentContainer: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.border,
      borderWidth: 1.5,
      flexDirection: 'row',
      gap: 6,
      padding: 4,
    },
    themeSegmentBtn: {
      alignItems: 'center',
      borderRadius: 0,
      flex: 1,
      flexDirection: 'row',
      gap: 4,
      justifyContent: 'center',
      paddingVertical: 8,
    },
    themeSegmentBtnActive: {
      backgroundColor: colors.accentElectric,
      borderColor: colors.border,
      borderWidth: 1.5,
    },
    themeSegmentText: {
      color: colors.textSecondary,
      fontFamily: Fonts.mono,
      fontSize: 10,
      fontWeight: '800',
    },
    themeSegmentTextActive: {
      color: '#111111',
      fontWeight: '900',
    },
    versionCard: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.border,
      borderWidth: 1.5,
      marginTop: Spacing.xs,
      padding: Spacing.md,
    },
    versionRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    versionMono: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 11,
      fontWeight: '800',
    },
    versionMeta: {
      color: colors.textMuted,
      fontFamily: Fonts.mono,
      fontSize: 10,
      marginTop: 4,
    },
    logoutBtn: {
      alignItems: 'center',
      backgroundColor: colors.accentOrange,
      borderColor: colors.border,
      borderWidth: 2,
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      marginTop: Spacing.xl,
      paddingVertical: 14,
      width: '100%',
      ...BrutalShadow,
    },
    logoutBtnText: {
      color: '#FFFFFF',
      fontFamily: Fonts.mono,
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
    modalOverlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      flex: 1,
      justifyContent: 'center',
      padding: Spacing.lg,
    },
    modalSheet: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 2.5,
      maxHeight: '85%',
      padding: Spacing.lg,
      width: '100%',
      ...BrutalShadow,
    },
    modalHeader: {
      alignItems: 'flex-start',
      borderBottomColor: colors.border,
      borderBottomWidth: 2,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.md,
      paddingBottom: Spacing.sm,
    },
    modalSub: {
      color: colors.textSecondary,
      fontFamily: Fonts.mono,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1,
    },
    modalTitle: {
      color: colors.text,
      fontFamily: Fonts.display,
      fontSize: 20,
      fontWeight: '900',
      letterSpacing: -0.5,
    },
    closeBtn: {
      alignItems: 'center',
      borderColor: colors.border,
      borderWidth: 2,
      height: 32,
      justifyContent: 'center',
      width: 32,
    },
    modalDesc: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: Spacing.md,
    },
    modalErrorBox: {
      alignItems: 'center',
      backgroundColor: isDark ? '#3E1914' : '#FFEBE6',
      borderColor: colors.accentOrange,
      borderWidth: 1.5,
      flexDirection: 'row',
      gap: 8,
      marginBottom: Spacing.md,
      padding: 8,
    },
    modalErrorText: {
      color: colors.accentOrange,
      flex: 1,
      fontFamily: Fonts.mono,
      fontSize: 11,
      fontWeight: '700',
    },
    modalFieldGroup: {
      marginBottom: Spacing.md,
    },
    modalFieldLabel: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1,
      marginBottom: 6,
    },
    modalInput: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 2,
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 14,
      paddingHorizontal: Spacing.md,
      paddingVertical: 12,
    },
    modalActionRow: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginTop: Spacing.md,
    },
    modalCancelBtn: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.border,
      borderWidth: 2,
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 12,
    },
    modalCancelText: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 12,
      fontWeight: '800',
    },
    modalSubmitBtn: {
      alignItems: 'center',
      backgroundColor: colors.accentElectric,
      borderColor: colors.border,
      borderWidth: 2,
      flex: 2,
      justifyContent: 'center',
      paddingVertical: 12,
      ...BrutalShadowSmall,
    },
    modalSubmitText: {
      color: '#111111',
      fontFamily: Fonts.mono,
      fontSize: 12,
      fontWeight: '900',
    },
    presetSectionTitle: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.5,
      marginBottom: Spacing.xs,
    },
    deviceUploadRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginBottom: Spacing.xs,
    },
    uploadOptionBtn: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.border,
      borderWidth: 1.5,
      flex: 1,
      flexDirection: 'row',
      gap: 6,
      justifyContent: 'center',
      paddingVertical: 10,
      ...BrutalShadowSmall,
    },
    uploadOptionText: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 10,
      fontWeight: '800',
    },
    presetsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'space-between',
      marginTop: Spacing.xs,
    },
    presetItem: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.border,
      borderWidth: 1.5,
      padding: 6,
      width: '23%',
    },
    presetItemSelected: {
      backgroundColor: colors.accentElectric,
      borderColor: colors.border,
      borderWidth: 2.5,
    },
    presetImg: {
      height: 48,
      width: 48,
    },
    presetName: {
      color: colors.text,
      fontFamily: Fonts.mono,
      fontSize: 8,
      fontWeight: '800',
      marginTop: 4,
    },
  });
