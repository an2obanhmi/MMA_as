import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskPriority, TaskStatus } from '../types/task.types';
import { Colors, Spacing, Fonts, BrutalShadow } from '../styles/theme';
import { formatDueDateDisplay } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const isDone = task.status === 'Done';
  const dueInfo = formatDueDateDisplay(task.dueDate, isDone);

  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return {
          bg: Colors.accentOrange,
          color: '#FFFFFF',
          label: 'PR // HIGH',
        };
      case 'Low':
        return {
          bg: Colors.surfaceSecondary,
          color: Colors.text,
          label: 'PR // LOW',
        };
      case 'Medium':
      default:
        return {
          bg: Colors.accentElectric,
          color: Colors.text,
          label: 'PR // MED',
        };
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'Done':
        return 'RESOLVED';
      case 'In Progress':
        return 'IN_FLIGHT';
      case 'To Do':
      default:
        return 'TODO';
    }
  };

  const priorityMeta = getPriorityStyle(task.priority);

  return (
    <View
      style={[
        styles.card,
        isDone && styles.cardDone,
        dueInfo?.status === 'overdue' && !isDone && styles.cardOverdue,
      ]}
    >
      {/* Top Status & Priority Bar */}
      <View style={styles.topBar}>
        <View style={styles.tagsRow}>
          {/* Priority Pill */}
          <View style={[styles.monoPill, { backgroundColor: priorityMeta.bg }]}>
            <Text style={[styles.monoPillText, { color: priorityMeta.color }]}>
              {priorityMeta.label}
            </Text>
          </View>

          {/* Status Pill */}
          <View
            style={[
              styles.monoPillOutline,
              task.status === 'In Progress' && styles.statusInProgressPill,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                task.status === 'In Progress' && styles.statusInProgressText,
              ]}
            >
              {getStatusLabel(task.status)}
            </Text>
          </View>
        </View>

        {/* Due Date Relative Pill */}
        {dueInfo ? (
          <View
            style={[
              styles.dueBadge,
              { backgroundColor: dueInfo.badgeBg },
              dueInfo.status === 'overdue' && styles.dueBadgeOverdue,
            ]}
          >
            <Ionicons
              name={
                dueInfo.status === 'overdue'
                  ? 'alert-circle'
                  : dueInfo.status === 'today'
                  ? 'flash'
                  : 'time-outline'
              }
              size={12}
              color={dueInfo.badgeText}
            />
            <Text style={[styles.dueBadgeText, { color: dueInfo.badgeText }]}>
              {dueInfo.label}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Main Content Area */}
      <View style={styles.contentRow}>
        {/* Brutalist Custom Checkbox */}
        <TouchableOpacity
          style={[styles.checkbox, isDone && styles.checkboxDone]}
          onPress={() => onToggleStatus(task)}
          activeOpacity={0.7}
          accessibilityLabel="Toggle task completion"
        >
          {isDone ? (
            <Ionicons name="checkmark" size={18} color={Colors.textInverted} />
          ) : null}
        </TouchableOpacity>

        {/* Task Title & Description */}
        <View style={styles.textContainer}>
          <Text
            style={[styles.title, isDone && styles.titleDone]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {task.description ? (
            <Text
              style={[styles.description, isDone && styles.descriptionDone]}
              numberOfLines={3}
            >
              {task.description}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Bottom Minimalist Action Bar */}
      <View style={styles.footerBar}>
        <View style={styles.idContainer}>
          <Text style={styles.idText}>
            ID#{task.id?.substring(0, 6).toUpperCase() || 'NEW'}
            {task.dueDate ? ` // ${task.dueDate}` : ''}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onEdit(task)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEditText}>[EDIT]</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => task.id && onDelete(task.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionDeleteText}>[DELETE]</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  actionDeleteText: {
    color: Colors.accentOrange,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionEditText: {
    color: Colors.accentBlue,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    ...BrutalShadow,
  },
  cardDone: {
    backgroundColor: '#F3F3F0',
    borderColor: '#AAAAAA',
    shadowOpacity: 0.2,
  },
  cardOverdue: {
    borderColor: Colors.accentOrange,
    borderLeftWidth: 5,
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    marginTop: 2,
    width: 26,
  },
  checkboxDone: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  contentRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    marginVertical: Spacing.sm,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  descriptionDone: {
    color: Colors.textMuted,
  },
  dueBadge: {
    alignItems: 'center',
    borderColor: Colors.border,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dueBadgeOverdue: {
    borderColor: Colors.accentOrange,
  },
  dueBadgeText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footerBar: {
    alignItems: 'center',
    borderTopColor: Colors.borderMuted,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
  },
  idContainer: {
    flexDirection: 'row',
  },
  idText: {
    color: Colors.textMuted,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '600',
  },
  monoPill: {
    borderColor: Colors.border,
    borderWidth: 1.5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  monoPillOutline: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1.5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  monoPillText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '800',
  },
  statusInProgressPill: {
    backgroundColor: Colors.accentBlue,
  },
  statusInProgressText: {
    color: '#FFFFFF',
  },
  statusText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '800',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  titleDone: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
