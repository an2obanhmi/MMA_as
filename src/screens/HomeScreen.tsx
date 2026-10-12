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
import { Colors, Spacing } from '../styles/theme';

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

  // Calculate filter counts
  const filterCounts: Record<TaskFilter, number> = {
    All: allTasks.length,
    'To Do': allTasks.filter(t => t.status === 'To Do').length,
    'In Progress': allTasks.filter(t => t.status === 'In Progress').length,
    Done: allTasks.filter(t => t.status === 'Done').length,
  };

  const handleOpenCreate = () => {
    setSelectedTask(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleDeleteConfirm = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to permanently delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
            } catch {
              Alert.alert('Error', 'Failed to delete task. Please try again.');
            }
          },
        },
      ],
      { cancelable: true },
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
      {/* App Header with short description */}
      <Header
        title="Task Manager"
        subtitle="Organize, track, and manage your daily tasks seamlessly"
      />

      {/* Main Container - Responsive layout width constraint for tablets */}
      <View style={[styles.mainWrapper, isTablet && styles.tabletWrapper]}>
        {/* Create Task Button & Status Filter bar */}
        <View style={styles.toolbarRow}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleOpenCreate}
            accessibilityLabel="Create new task"
          >
            <Ionicons name="add" size={20} color={Colors.surface} />
            <Text style={styles.createButtonText}>Create Task</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <StatusFilter
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          counts={filterCounts}
        />

        {/* Error notification if any */}
        {error ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color={Colors.error} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        ) : null}

        {/* Task List / Loading / Empty States */}
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Syncing tasks with Firestore...</Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={item => item.id || Math.random().toString()}
            renderItem={({ item }) => (
              <TaskCard task={item} onEdit={handleOpenEdit} onDelete={handleDeleteConfirm} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="clipboard-outline" size={56} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No tasks found</Text>
                <Text style={styles.emptySubtitle}>
                  {activeFilter === 'All'
                    ? 'Get started by creating your first task!'
                    : `No tasks under "${activeFilter}" status.`}
                </Text>
                {activeFilter === 'All' && (
                  <TouchableOpacity style={styles.emptyButton} onPress={handleOpenCreate}>
                    <Text style={styles.emptyButtonText}>+ Create Task Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        )}
      </View>

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
  createButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  createButtonText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyButton: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  emptyButtonText: {
    color: Colors.primaryDark,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: 48,
  },
  emptySubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.md,
  },
  errorBanner: {
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
  },
  errorBannerText: {
    color: Colors.error,
    flex: 1,
    fontSize: 13,
  },
  listContent: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
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
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
});
