import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskPriority, TaskStatus } from '../types/task.types';
import { Colors, Spacing } from '../styles/theme';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getStatusBadgeStyle = (status: TaskStatus) => {
    switch (status) {
      case 'Done':
        return { bg: Colors.statusDoneBg, text: Colors.statusDone };
      case 'In Progress':
        return { bg: Colors.statusInProgressBg, text: Colors.statusInProgress };
      case 'To Do':
      default:
        return { bg: Colors.statusTodoBg, text: Colors.statusTodo };
    }
  };

  const getPriorityBadgeStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return { bg: Colors.priorityHighBg, text: Colors.priorityHigh };
      case 'Low':
        return { bg: Colors.priorityLowBg, text: Colors.priorityLow };
      case 'Medium':
      default:
        return { bg: Colors.priorityMediumBg, text: Colors.priorityMedium };
    }
  };

  const statusStyle = getStatusBadgeStyle(task.status);
  const priorityStyle = getPriorityBadgeStyle(task.priority);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {task.title}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onEdit(task)}
            accessibilityLabel="Edit task"
          >
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => task.id && onDelete(task.id)}
            accessibilityLabel="Delete task"
          >
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {task.description ? (
        <Text style={styles.description} numberOfLines={3}>
          {task.description}
        </Text>
      ) : null}

      <View style={styles.footerRow}>
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.badgeText, { color: statusStyle.text }]}>{task.status}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: priorityStyle.bg }]}>
            <Text style={[styles.badgeText, { color: priorityStyle.text }]}>{task.priority}</Text>
          </View>
        </View>

        {task.dueDate ? (
          <View style={styles.dueDateContainer}>
            <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.dueDateText}>{task.dueDate}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  dueDateContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  dueDateText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  title: {
    color: Colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
});
