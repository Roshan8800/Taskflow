import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Todo } from '../models/Todo';
import { SubtasksScreen } from '../screens/SubtasksScreen';

interface TaskDetailModalProps {
  visible: boolean;
  task: Todo | null;
  onClose: () => void;
  onSave: (updates: Partial<Todo>) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  visible,
  task,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  if (!task) return null;

  if (showSubtasks) {
    return (
      <Modal visible={visible} animationType="slide">
        <SubtasksScreen
          taskId={task._id.toString()}
          taskTitle={task.title}
          subtasks={[]}
          onAddSubtask={() => {}}
          onToggleSubtask={() => {}}
          onDeleteSubtask={() => {}}
          onBack={() => setShowSubtasks(false)}
        />
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeBtn, { color: theme.primary }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Task Details</Text>
          <TouchableOpacity onPress={() => onSave({ title, description })}>
            <Text style={[styles.saveBtn, { color: theme.primary }]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Title</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Task title"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>Description</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Task description"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={[styles.subtasksBtn, { backgroundColor: theme.surface }]}
            onPress={() => setShowSubtasks(true)}
          >
            <Text style={[styles.subtasksBtnText, { color: theme.text }]}>
              📋 Manage Subtasks
            </Text>
            <Text style={[styles.arrow, { color: theme.textSecondary }]}>→</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  closeBtn: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveBtn: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  subtasksBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  subtasksBtnText: {
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
  },
});