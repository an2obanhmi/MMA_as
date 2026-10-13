import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { TaskCard } from '../components/TaskCard';
import { TaskFormModal } from '../components/TaskFormModal';
import { StatusFilter } from '../components/StatusFilter';
import { useTasks } from '../hooks/useTasks';
import { Task, TaskFilter } from '../types/task.types';
import { Colors, Spacing, Fonts, BrutalShadow } from '../styles/theme';

export const HomeScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [activeFilter, setActiveFilter] = useState<TaskFilter>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const {
    tasks,
    allTasks,
    loading,
    error,
    refreshing,
    onRefresh,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks(activeFilter);

  // Completed & Total metrics
  const totalCount = allTasks.length;
  const completedCount = allTasks.filter((t) => t.status === 'Done').length;

  // Filter count map
  const filterCounts: Record<TaskFilter, number> = {
    All: allTasks.length,
    'To Do': allTasks.filter((t) => t.status === 'To Do').length,
    'In Progress': allTasks.filter((t) => t.status === 'In Progress').length,
    Done: completedCount,
  };

  const handleOpenCreate = () => {
    setSelectedTask(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  // Quick toggle between To Do and Done
  const handleToggleStatus = async (task: Task) => {
    if (!task.id) return;
    const nextStatus = task.status === 'Done' ? 'To Do' : 'Done';
    try {
      await updateTask(task.id, { status: nextStatus });
    } catch {
      Alert.alert('// ERROR', 'Failed to update task state.');
    }
  };

  const handleDeleteConfirm = (taskId: string) => {
    Alert.alert(
      '// CONFIRM DELETION',
      'This action will permanently purge the task document from Firestore.',
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'PURGE',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
            } catch {
              Alert.alert('// ERROR', 'Failed to delete task.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleFormSubmit = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (selectedTask && selectedTask.id) {
      await updateTask(selectedTask.id, taskData);
    } else {
      await createTask(taskData);
    }
  };

  return (
    <View style={styles.container}>
      {/* Neo-brutalist Header */}
      <Header completedCount={completedCount} totalCount={totalCount} />

      {/* Main Container - Responsive layout width constraint for tablets */}
      <View style={[styles.mainWrapper, isTablet && styles.tabletWrapper]}>
        {/* Status Filter Capsule Bar */}
        <StatusFilter
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          counts={filterCounts}
        />

        {/* Error notification banner */}
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{'[ALERT // '}{error}{']'}</Text>
          </View>
        ) : null}

        {/* Task List / Loading / Empty States */}
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={Colors.text} />
            <Text style={styles.loadingText}>{'// CONNECTING FIRESTORE STREAM...'}</Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id || Math.random().toString()}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onToggleStatus={handleToggleStatus}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteConfirm}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
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
                  <Ionicons name="code-working" size={36} color={Colors.text} />
                </View>
                <Text style={styles.emptyTitle}>NO_ITEMS_FOUND</Text>
                <Text style={styles.emptySubtitle}>
                  {activeFilter === 'All'
                    ? 'BOARD IS COMPLETELY CLEAR. INITIATE A NEW TASK BELOW.'
                    : `ZERO TASKS CLASSIFIED UNDER [${activeFilter.toUpperCase()}].`}
                </Text>
                {activeFilter === 'All' && (
                  <TouchableOpacity
                    style={styles.emptyButton}
                    onPress={handleOpenCreate}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.emptyButtonText}>INITIALIZE TASK +</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        )}
      </View>

      {/* Rebellious Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleOpenCreate}
        activeOpacity={0.85}
        accessibilityLabel="Create task"
      >
        <Ionicons name="add" size={32} color={Colors.text} />
      </TouchableOpacity>

      {/* Create / Edit Modal Form */}
      <TaskFormModal
        visible={modalVisible}
        initialTask={selectedTask}
        onClose={() => {
          setModalVisible(false);
          setSelectedTask(null);
        }}
        onSubmit={handleFormSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centerBox: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  emptyButton: {
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderWidth: 2,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    ...BrutalShadow,
  },
  emptyButtonText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    borderColor: Colors.borderMuted,
    borderStyle: 'dashed',
    borderWidth: 2,
    justifyContent: 'center',
    marginHorizontal: Spacing.xs,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 48,
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
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: Spacing.xs,
  },
  errorBanner: {
    backgroundColor: Colors.accentOrange,
    borderColor: Colors.border,
    borderWidth: 2,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    padding: Spacing.sm,
  },
  errorBannerText: {
    color: '#FFFFFF',
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
  },
  fab: {
    alignItems: 'center',
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderRadius: 0, // Sharp square Neo-Brutalist
    borderWidth: 2.5,
    bottom: 24,
    height: 58,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    width: 58,
    ...BrutalShadow,
  },
  listContent: {
    paddingBottom: 96,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
  },
  mainWrapper: {
    flex: 1,
    width: '100%',
  },
  tabletWrapper: {
    alignSelf: 'center',
    maxWidth: 720,
  },
});
