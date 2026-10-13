import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskPriority, TaskStatus } from '../types/task.types';
import { Colors, Spacing, Fonts, BrutalShadow } from '../styles/theme';
import { DATE_PRESETS, formatDueDateDisplay, getLocalDateString } from '../utils/dateUtils';

import { TeamMember, Team } from '../types/models.types';

interface TaskFormModalProps {
  visible: boolean;
  initialTask?: Task | null;
  teamMembers?: TeamMember[];
  teams?: Team[];
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
}

const STATUS_OPTIONS: { key: TaskStatus; label: string }[] = [
  { key: 'To Do', label: 'TODO' },
  { key: 'In Progress', label: 'IN_FLIGHT' },
  { key: 'Done', label: 'RESOLVED' },
];

const PRIORITY_OPTIONS: { key: TaskPriority; label: string }[] = [
  { key: 'Low', label: 'LOW' },
  { key: 'Medium', label: 'MED' },
  { key: 'High', label: 'HIGH' },
];

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  visible,
  initialTask,
  teamMembers,
  teams,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState<string | null>(null);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | null>(null);
  const [selectedAssigneeName, setSelectedAssigneeName] = useState<string | null>(null);

  const [titleError, setTitleError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setStatus(initialTask.status || 'To Do');
      setPriority(initialTask.priority || 'Medium');
      setDueDate(initialTask.dueDate || '');
      setSelectedTeamId(initialTask.teamId ?? null);
      setSelectedTeamName(initialTask.teamName ?? null);
      setSelectedAssigneeId(initialTask.assigneeId ?? null);
      setSelectedAssigneeName(initialTask.assigneeName ?? null);
    } else {
      resetForm();
    }
    setTitleError(null);
    setDateError(null);
  }, [initialTask, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('To Do');
    setPriority('Medium');
    setDueDate('');
    setSelectedTeamId(null);
    setSelectedTeamName(null);
    setSelectedAssigneeId(null);
    setSelectedAssigneeName(null);
    setTitleError(null);
    setDateError(null);
  };

  const handleSelectPreset = (dateStr: string) => {
    setDueDate(dateStr);
    setDateError(null);
  };

  const handleSave = async () => {
    let hasError = false;

    if (!title.trim()) {
      setTitleError('// ERROR: TITLE IS MANDATORY');
      hasError = true;
    }

    // Validate dueDate format if provided
    const trimmedDueDate = dueDate.trim();
    if (trimmedDueDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(trimmedDueDate)) {
        setDateError('// ERROR: INVALID FORMAT (USE YYYY-MM-DD)');
        hasError = true;
      } else {
        const parts = trimmedDueDate.split('-');
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        const dateObj = new Date(y, m - 1, d);
        if (
          dateObj.getFullYear() !== y ||
          dateObj.getMonth() !== m - 1 ||
          dateObj.getDate() !== d
        ) {
          setDateError('// ERROR: CALENDAR DATE DOES NOT EXIST');
          hasError = true;
        }
      }
    }

    if (hasError) return;

    try {
      setSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: trimmedDueDate,
        teamId: selectedTeamId,
        teamName: selectedTeamName,
        assigneeId: selectedAssigneeId,
        assigneeName: selectedAssigneeName,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(initialTask);
  const datePreview = formatDueDateDisplay(dueDate, false);

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerMonoTag}>
                {isEditing ? '[OPERATION // EDIT]' : '[OPERATION // CREATE]'}
              </Text>
              <Text style={styles.headerTitle}>
                {isEditing ? 'EDIT_TASK.' : 'NEW_TASK.'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              disabled={submitting}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formBody} showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>TITLE*</Text>
              <TextInput
                style={[styles.input, titleError ? styles.inputError : null]}
                placeholder="DEFINE ACTION ITEM..."
                placeholderTextColor={Colors.textMuted}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (titleError) setTitleError(null);
                }}
              />
              {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
            </View>

            {/* Description Input */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>NOTES / DETAILS</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="SPECIFY CONTEXT OR SUBTASKS..."
                placeholderTextColor={Colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Status Select */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>STATUS</Text>
              <View style={styles.segmentRow}>
                {STATUS_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    activeOpacity={0.8}
                    style={[
                      styles.segmentBtn,
                      status === opt.key && styles.segmentBtnActive,
                    ]}
                    onPress={() => setStatus(opt.key)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        status === opt.key && styles.segmentTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Team Workspace Selection (if teams list is provided) */}
            {teams && teams.length > 0 ? (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>WORKSPACE / TEAM</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.presetsRow}>
                    <TouchableOpacity
                      style={[
                        styles.presetChip,
                        selectedTeamId === null && styles.presetChipActive,
                      ]}
                      onPress={() => {
                        setSelectedTeamId(null);
                        setSelectedTeamName(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          selectedTeamId === null && styles.presetChipTextActive,
                        ]}
                      >
                        [PERSONAL / NO TEAM]
                      </Text>
                    </TouchableOpacity>
                    {teams.map((t) => (
                      <TouchableOpacity
                        key={t.id}
                        style={[
                          styles.presetChip,
                          selectedTeamId === t.id && styles.presetChipActive,
                        ]}
                        onPress={() => {
                          setSelectedTeamId(t.id);
                          setSelectedTeamName(t.name);
                        }}
                      >
                        <Text
                          style={[
                            styles.presetChipText,
                            selectedTeamId === t.id && styles.presetChipTextActive,
                          ]}
                        >
                          {t.name.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ) : null}

            {/* Assignee Selection (if teamMembers is available) */}
            {teamMembers && teamMembers.length > 0 ? (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>ASSIGN TO OPERATOR</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.presetsRow}>
                    <TouchableOpacity
                      style={[
                        styles.presetChip,
                        selectedAssigneeId === null && styles.presetChipActive,
                      ]}
                      onPress={() => {
                        setSelectedAssigneeId(null);
                        setSelectedAssigneeName(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          selectedAssigneeId === null && styles.presetChipTextActive,
                        ]}
                      >
                        [UNASSIGNED]
                      </Text>
                    </TouchableOpacity>
                    {teamMembers.map((m) => {
                      const isAssigned = selectedAssigneeId === m.userId;
                      const displayName = m.userName || m.userEmail || 'User';
                      return (
                        <TouchableOpacity
                          key={m.userId}
                          style={[
                            styles.presetChip,
                            isAssigned && styles.presetChipActive,
                          ]}
                          onPress={() => {
                            setSelectedAssigneeId(m.userId);
                            setSelectedAssigneeName(displayName);
                          }}
                        >
                          <Text
                            style={[
                              styles.presetChipText,
                              isAssigned && styles.presetChipTextActive,
                            ]}
                          >
                            @{displayName.toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            ) : null}

            {/* Due Date & Quick Presets */}
            <View style={styles.fieldContainer}>
              <View style={styles.labelWithPreview}>
                <Text style={styles.fieldLabel}>DEADLINE / SCHEDULE (YYYY-MM-DD)</Text>
                {datePreview ? (
                  <View
                    style={[
                      styles.previewBadge,
                      { backgroundColor: datePreview.badgeBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.previewBadgeText,
                        { color: datePreview.badgeText },
                      ]}
                    >
                      {datePreview.label}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Quick Preset Buttons */}
              <View style={styles.presetsRow}>
                {DATE_PRESETS.map((p) => {
                  const targetStr = p.getDateString();
                  const isPresetActive = dueDate === targetStr;
                  return (
                    <TouchableOpacity
                      key={p.key}
                      style={[
                        styles.presetChip,
                        isPresetActive && styles.presetChipActive,
                      ]}
                      onPress={() => handleSelectPreset(targetStr)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          isPresetActive && styles.presetChipTextActive,
                        ]}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {dueDate ? (
                  <TouchableOpacity
                    style={styles.presetClear}
                    onPress={() => {
                      setDueDate('');
                      setDateError(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.presetClearText}>CLEAR</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <TextInput
                style={[styles.input, dateError ? styles.inputError : null]}
                placeholder={`E.G. ${getLocalDateString()}`}
                placeholderTextColor={Colors.textMuted}
                value={dueDate}
                onChangeText={(text) => {
                  setDueDate(text);
                  if (dateError) setDateError(null);
                }}
              />
              {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
            </View>
          </ScrollView>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={submitting}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>DISCARD</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSave}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color={Colors.text} size="small" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {isEditing ? 'COMMIT CHANGES' : 'CREATE TASK +'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    borderTopColor: Colors.border,
    borderTopWidth: 2,
    flexDirection: 'row',
    gap: Spacing.md,
    paddingTop: Spacing.md,
  },
  cancelBtn: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  cancelBtnText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeBtn: {
    borderColor: Colors.border,
    borderWidth: 2,
    padding: 4,
  },
  errorText: {
    color: Colors.accentOrange,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  fieldContainer: {
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
  formBody: {
    maxHeight: 480,
  },
  header: {
    alignItems: 'flex-start',
    borderBottomColor: Colors.border,
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerMonoTag: {
    color: Colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    color: Colors.text,
    fontFamily: Fonts.display,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
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
  inputError: {
    backgroundColor: '#FFF5F2',
    borderColor: Colors.accentOrange,
  },
  labelWithPreview: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
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
    maxHeight: '94%',
    padding: Spacing.lg,
    width: '100%',
  },
  presetChip: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  presetChipActive: {
    backgroundColor: Colors.accentElectric,
  },
  presetChipText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '800',
  },
  presetChipTextActive: {
    color: Colors.text,
  },
  presetClear: {
    backgroundColor: Colors.surfaceSecondary,
    borderColor: Colors.borderMuted,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  presetClearText: {
    color: Colors.accentOrange,
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  previewBadge: {
    borderColor: Colors.border,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  previewBadgeText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '800',
  },
  segmentBtn: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1.5,
    flex: 1,
    paddingVertical: 10,
  },
  segmentBtnActive: {
    backgroundColor: Colors.text,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '800',
  },
  segmentTextActive: {
    color: Colors.accentElectric,
  },
  submitBtn: {
    alignItems: 'center',
    backgroundColor: Colors.accentElectric,
    borderColor: Colors.border,
    borderWidth: 2,
    flex: 2,
    justifyContent: 'center',
    paddingVertical: 14,
    ...BrutalShadow,
  },
  submitBtnText: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  textArea: {
    minHeight: 76,
  },
});
