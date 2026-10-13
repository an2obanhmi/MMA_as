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

interface TaskFormModalProps {
  visible: boolean;
  initialTask?: Task | null;
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
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');

  const [titleError, setTitleError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setStatus(initialTask.status || 'To Do');
      setPriority(initialTask.priority || 'Medium');
      setDueDate(initialTask.dueDate || '');
    } else {
      resetForm();
    }
    setTitleError(null);
  }, [initialTask, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('To Do');
    setPriority('Medium');
    setDueDate('');
    setTitleError(null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError('// ERROR: TITLE IS MANDATORY');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate.trim(),
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

            {/* Priority Select */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>PRIORITY</Text>
              <View style={styles.segmentRow}>
                {PRIORITY_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    activeOpacity={0.8}
                    style={[
                      styles.segmentBtn,
                      priority === opt.key && styles.segmentBtnActive,
                    ]}
                    onPress={() => setPriority(opt.key)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        priority === opt.key && styles.segmentTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Due Date */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>DEADLINE / SCHEDULE</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD (E.G. 2026-10-25)"
                placeholderTextColor={Colors.textMuted}
                value={dueDate}
                onChangeText={setDueDate}
              />
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
    maxHeight: 460,
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
    borderColor: Colors.accentOrange,
    backgroundColor: '#FFF5F2',
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
    maxHeight: '92%',
    padding: Spacing.lg,
    width: '100%',
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
