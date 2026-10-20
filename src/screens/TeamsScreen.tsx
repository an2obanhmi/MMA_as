import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Team } from '../types/models.types';
import { createTeam, joinTeam, getUserTeamsRealtime } from '../services/teamService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors, Spacing, Fonts, BrutalShadow, BrutalShadowSmall } from '../styles/theme';

interface TeamsScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export const TeamsScreen: React.FC<TeamsScreenProps> = ({ navigation }) => {
  const { user, userProfile } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [modalType, setModalType] = useState<'create' | 'join' | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [teamCodeInput, setTeamCodeInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = getUserTeamsRealtime(
      user.uid,
      (fetchedTeams) => {
        setTeams(fetchedTeams);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching teams:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setFormError('// ERROR: TEAM NAME IS REQUIRED');
      return;
    }
    if (!user) return;

    try {
      setSubmitting(true);
      setFormError(null);
      await createTeam(
        teamName,
        teamDesc,
        user.uid,
        userProfile?.name || 'User',
        user.email || ''
      );
      setModalType(null);
      setTeamName('');
      setTeamDesc('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'COULD NOT CREATE TEAM';
      setFormError(`// ERROR: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!teamCodeInput.trim()) {
      setFormError('// ERROR: TEAM ID CODE IS REQUIRED');
      return;
    }
    if (!user) return;

    try {
      setSubmitting(true);
      setFormError(null);
      await joinTeam(
        teamCodeInput,
        user.uid,
        userProfile?.name || 'User',
        user.email || ''
      );
      setModalType(null);
      setTeamCodeInput('');
      Alert.alert('// SUCCESS', 'Successfully joined team workspace!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'COULD NOT JOIN TEAM';
      setFormError(`// ERROR: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerMonoTag}>[MODULE // 02]</Text>
        <Text style={styles.headerTitle}>TEAMS.</Text>
        <Text style={styles.headerSubtitle}>
          Workspaces, roster management and real-time war room chat.
        </Text>
      </View>

      {/* Action Buttons: Create & Join */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.createBtn]}
          onPress={() => {
            setFormError(null);
            setModalType('create');
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color={Colors.text} />
          <Text style={styles.actionBtnText}>CREATE TEAM</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.joinBtn]}
          onPress={() => {
            setFormError(null);
            setModalType('join');
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="enter-outline" size={18} color={Colors.text} />
          <Text style={styles.actionBtnText}>JOIN WITH CODE</Text>
        </TouchableOpacity>
      </View>

      {/* Teams List */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={Colors.text} />
          <Text style={styles.loadingText}>{'// SYNCING TEAM DIRECTORY...'}</Text>
        </View>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.teamCard}
              onPress={() =>
                navigation.navigate('TeamDetail', {
                  teamId: item.id,
                  teamName: item.name,
                })
              }
              activeOpacity={0.85}
            >
              <View style={styles.teamTop}>
                <View style={styles.teamCodePill}>
                  <Text style={styles.teamCodeText}>
                    CODE: {item.id.substring(0, 8)}
                  </Text>
                </View>
                {item.ownerId === user?.uid && (
                  <View style={styles.ownerBadge}>
                    <Text style={styles.ownerBadgeText}>OWNER</Text>
                  </View>
                )}
              </View>

              <Text style={styles.teamName}>{item.name}</Text>
              {item.description ? (
                <Text style={styles.teamDesc} numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}

              <View style={styles.teamFooter}>
                <Text style={styles.footerLink}>ENTER WORKSPACE -{'>'}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.text} />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.text]}
              tintColor={Colors.text}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptySquare}>
                <Ionicons name="people-outline" size={36} color={Colors.text} />
              </View>
              <Text style={styles.emptyTitle}>NO_TEAMS_REGISTERED</Text>
              <Text style={styles.emptySubtitle}>
                You are currently a lone operator. Create a new team workspace or join an existing team using its invite code.
              </Text>
            </View>
          }
        />
      )}

      {/* Modal for Create / Join */}
      <Modal
        visible={modalType !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalType(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === 'create' ? 'NEW_TEAM_WORKSPACE.' : 'JOIN_WORKSPACE.'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalType(null)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {formError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{formError}</Text>
              </View>
            ) : null}

            {modalType === 'create' ? (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>WORKSPACE NAME*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Core Engineering Squad"
                    placeholderTextColor={Colors.textMuted}
                    value={teamName}
                    onChangeText={(t) => {
                      setTeamName(t);
                      if (formError) setFormError(null);
                    }}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>PURPOSE / DESCRIPTION</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Brief description of the team mission..."
                    placeholderTextColor={Colors.textMuted}
                    value={teamDesc}
                    onChangeText={setTeamDesc}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <TouchableOpacity
                  style={styles.modalSubmitBtn}
                  onPress={handleCreateTeam}
                  disabled={submitting}
                  activeOpacity={0.8}
                >
                  {submitting ? (
                    <ActivityIndicator color={Colors.text} size="small" />
                  ) : (
                    <Text style={styles.modalSubmitBtnText}>ESTABLISH TEAM +</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>TEAM IDENTIFIER CODE*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Paste Firestore Team Document ID"
                    placeholderTextColor={Colors.textMuted}
                    value={teamCodeInput}
                    onChangeText={(t) => {
                      setTeamCodeInput(t);
                      if (formError) setFormError(null);
                    }}
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity
                  style={styles.modalSubmitBtn}
                  onPress={handleJoinTeam}
                  disabled={submitting}
                  activeOpacity={0.8}
                >
                  {submitting ? (
                    <ActivityIndicator color={Colors.text} size="small" />
                  ) : (
                    <Text style={styles.modalSubmitBtnText}>JOIN WORKSPACE -{'>'}</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  actionBtn: {
    alignItems: 'center',
    borderColor: Colors.border,
    borderWidth: 2,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingVertical: 12,
    ...BrutalShadowSmall,
  },
  actionBtnText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  centerBox: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
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
  createBtn: {
    backgroundColor: Colors.accentElectric,
  },
  emptyContainer: {
    alignItems: 'center',
    borderColor: Colors.borderMuted,
    borderStyle: 'dashed',
    borderWidth: 2,
    justifyContent: 'center',
    marginTop: Spacing.lg,
    padding: Spacing.xl,
  },
  emptySquare: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
    height: 64,
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    width: 64,
    ...BrutalShadow,
  },
  emptySubtitle: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
    textAlign: 'center',
  },
  emptyTitle: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
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
  footerLink: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '800',
  },
  header: {
    backgroundColor: Colors.background,
    borderBottomColor: Colors.border,
    borderBottomWidth: 2,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerMonoTag: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  headerTitle: {
    color: Colors.text,
    fontFamily: Fonts.display,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  input: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 13,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  joinBtn: {
    backgroundColor: Colors.surface,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  modalHeader: {
    alignItems: 'center',
    borderBottomColor: Colors.border,
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  modalOverlay: {
    backgroundColor: 'rgba(15, 16, 18, 0.75)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderTopWidth: 3,
    padding: Spacing.lg,
  },
  modalSubmitBtn: {
    alignItems: 'center',
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderWidth: 2,
    marginTop: Spacing.sm,
    paddingVertical: 14,
    ...BrutalShadow,
  },
  modalSubmitBtnText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalTitle: {
    color: Colors.text,
    fontFamily: Fonts.display,
    fontSize: 22,
    fontWeight: '900',
  },
  ownerBadge: {
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ownerBadgeText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '800',
  },
  teamCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    ...BrutalShadow,
  },
  teamCodePill: {
    backgroundColor: Colors.surfaceSecondary,
    borderColor: Colors.border,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  teamCodeText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
  },
  teamDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  teamFooter: {
    alignItems: 'center',
    borderTopColor: Colors.borderMuted,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },
  teamName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginVertical: 4,
  },
  teamTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textArea: {
    minHeight: 70,
  },
});
