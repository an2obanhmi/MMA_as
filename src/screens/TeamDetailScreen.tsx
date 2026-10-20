import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskCard } from '../components/TaskCard';
import { TaskFormModal } from '../components/TaskFormModal';
import { TeamMember } from '../types/models.types';
import { Task } from '../types/task.types';
import { getTeamMembersRealtime } from '../services/teamService';
import { getTeamTasksRealtime, createTask, updateTask, deleteTask } from '../services/taskService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors, Spacing, Fonts, BrutalShadow, BrutalShadowSmall } from '../styles/theme';

type TeamDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'TeamDetail'>;

export const TeamDetailScreen: React.FC<TeamDetailScreenProps> = ({ route, navigation }) => {
  const { teamId, teamName } = route.params;

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'tasks' | 'members'>('tasks');
  const [loading, setLoading] = useState(true);

  // Task modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const unsubMembers = getTeamMembersRealtime(
      teamId,
      (fetchedMembers) => setMembers(fetchedMembers),
      (err) => console.error('Error fetching members:', err)
    );

    const unsubTasks = getTeamTasksRealtime(
      teamId,
      (fetchedTasks) => {
        setTasks(fetchedTasks);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching team tasks:', err)
        setLoading(false);
      }
    );

    return () => {
      unsubMembers();
      unsubTasks();
    };
  }, [teamId]);

  const handleShareCode = async () => {
    try {
      await Share.share({
        message: `Join my team "${teamName}" on Task Management App using Team Code:\n${teamId}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleTaskStatus = async (task: Task) => {
    if (!task.id) return;
    const nextStatus = task.status === 'Done' ? 'To Do' : 'Done';
    await updateTask(task.id, { status: nextStatus });
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert('// DELETE TASK', 'Purge this task from team workspace?', [
      { text: 'CANCEL', style: 'cancel' },
      {
        text: 'DELETE',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(taskId);
        },
      },
    ]);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (selectedTask && selectedTask.id) {
      await updateTask(selectedTask.id, {
        ...taskData,
        teamId,
        teamName,
      });
    } else {
      await createTask({
        ...taskData,
        teamId,
        teamName,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerSub}>WORKSPACE DIRECTORY</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {teamName}.
            </Text>
          </View>
        </View>

        {/* Action Row: Invite Code & War Room Chat */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.codeShareBtn}
            onPress={handleShareCode}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={16} color={Colors.text} />
            <Text style={styles.codeShareText}>SHARE CODE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chatLaunchBtn}
            onPress={() =>
              navigation.navigate('Chat', {
                teamId,
                teamName,
              })
            }
            activeOpacity={0.85}
          >
            <Ionicons name="chatbubbles" size={18} color={Colors.text} />
            <Text style={styles.chatLaunchText}>WAR ROOM CHAT -{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Tab switch */}
        <View style={styles.tabSwitch}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'tasks' && styles.tabBtnActive]}
            onPress={() => setActiveTab('tasks')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'tasks' && styles.tabBtnTextActive,
              ]}
            >
              TASKS ({tasks.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'members' && styles.tabBtnActive]}
            onPress={() => setActiveTab('members')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'members' && styles.tabBtnTextActive,
              ]}
            >
              ROSTER ({members.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={Colors.text} />
        </View>
      ) : activeTab === 'tasks' ? (
        <View style={styles.bodyWrapper}>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id || Math.random().toString()}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onToggleStatus={handleToggleTaskStatus}
                onEdit={(t) => {
                  setSelectedTask(t);
                  setModalVisible(true);
                }}
                onDelete={handleDeleteTask}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>NO_TEAM_TASKS</Text>
                <Text style={styles.emptySubtitle}>
                  This team workspace has zero assigned tasks. Use the button below to assign one.
                </Text>
              </View>
            }
          />

          {/* Create Task in Team FAB */}
          <TouchableOpacity
            style={styles.fab}
            onPress={() => {
              setSelectedTask(null);
              setModalVisible(true);
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={30} color={Colors.text} />
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id || item.userId}
          renderItem={({ item }) => (
            <View style={styles.memberCard}>
              <View style={styles.memberLeft}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>
                    {item.userName ? item.userName.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.memberName}>{item.userName || 'Unnamed'}</Text>
                  <Text style={styles.memberEmail}>{item.userEmail || item.userId}</Text>
                </View>
              </View>

              <View
                style={[
                  styles.rolePill,
                  item.role === 'owner' ? styles.roleOwner : styles.roleMember,
                ]}
              >
                <Text
                  style={[
                    styles.roleText,
                    item.role === 'owner' ? styles.roleOwnerText : styles.roleMemberText,
                  ]}
                >
                  {item.role.toUpperCase()}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Task Modal with Team Roster for Assignee Selection */}
      <TaskFormModal
        visible={modalVisible}
        initialTask={selectedTask}
        teamMembers={members}
        onClose={() => {
          setModalVisible(false);
          setSelectedTask(null);
        }}
        onSubmit={handleSaveTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  backBtn: {
    borderColor: Colors.border,
    borderWidth: 2,
    padding: 8,
  },
  bodyWrapper: {
    flex: 1,
  },
  centerBox: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  chatLaunchBtn: {
    alignItems: 'center',
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderWidth: 2,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingVertical: 10,
    ...BrutalShadowSmall,
  },
  chatLaunchText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '900',
  },
  codeShareBtn: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  codeShareText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '800',
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    borderColor: Colors.borderMuted,
    borderStyle: 'dashed',
    borderWidth: 2,
    marginTop: Spacing.xl,
    padding: Spacing.xl,
  },
  emptySubtitle: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  emptyTitle: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 15,
    fontWeight: '900',
  },
  fab: {
    alignItems: 'center',
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderWidth: 2.5,
    bottom: 24,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    width: 56,
    ...BrutalShadow,
  },
  header: {
    backgroundColor: Colors.background,
    borderBottomColor: Colors.border,
    borderBottomWidth: 2,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  headerSub: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerTitle: {
    color: Colors.text,
    fontFamily: Fonts.display,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.md,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 80,
  },
  memberAvatar: {
    alignItems: 'center',
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderWidth: 1.5,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  memberAvatarText: {
    fontFamily: Fonts.mono,
    fontSize: 16,
    fontWeight: '900',
  },
  memberCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    ...BrutalShadowSmall,
  },
  memberEmail: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 11,
  },
  memberLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  memberName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  roleMember: {
    backgroundColor: Colors.surfaceSecondary,
  },
  roleMemberText: {
    color: Colors.text,
  },
  roleOwner: {
    backgroundColor: Colors.text,
  },
  roleOwnerText: {
    color: Colors.accentElectric,
  },
  rolePill: {
    borderColor: Colors.border,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  roleText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '800',
  },
  tabBtn: {
    borderColor: Colors.border,
    borderWidth: 1.5,
    flex: 1,
    paddingVertical: 10,
  },
  tabBtnActive: {
    backgroundColor: Colors.text,
  },
  tabBtnText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  tabBtnTextActive: {
    color: Colors.accentElectric,
  },
  tabSwitch: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.sm,
  },
});
