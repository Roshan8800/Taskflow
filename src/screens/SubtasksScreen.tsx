import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Subtask } from '../models/Subtask';

interface SubtasksScreenProps {
  taskId: string;
  taskTitle: string;
  subtasks: Subtask[];
  onAddSubtask: (title: string) => void;
  onToggleSubtask: (subtaskId: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  onBack: () => void;
}

export const SubtasksScreen: React.FC<SubtasksScreenProps> = ({
  taskId,
  taskTitle,
  subtasks,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onBack,
}) => {
  const { theme } = useTheme();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) {
      Alert.alert('Error', 'Subtask title is required');
      return;
    }
    onAddSubtask(newSubtaskTitle.trim());
    setNewSubtaskTitle('');
    setShowAddForm(false);
  };

  const completedCount = subtasks.filter(s => s.completed).length;
  const progressPercentage = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  const renderSubtask = ({ item }: { item: Subtask }) => (
    <View style={[styles.subtaskItem, { backgroundColor: theme.surface }]}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          { borderColor: theme.border },
          item.completed && { backgroundColor: theme.primary, borderColor: theme.primary }
        ]}
        onPress={() => onToggleSubtask(item._id.toString())}
      >
        {item.completed && <Text style={[styles.checkmark, { color: theme.background }]}>✓</Text>}
      </TouchableOpacity>
      
      <Text style={[
        styles.subtaskTitle,
        { color: theme.text },
        item.completed && { textDecorationLine: 'line-through', color: theme.textSecondary }
      ]}>
        {item.title}
      </Text>
      
      <TouchableOpacity
        onPress={() => onDeleteSubtask(item._id.toString())}
        style={styles.deleteBtn}
      >
        <Text style={[styles.deleteText, { color: '#FF6B6B' }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={[styles.backBtn, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {taskTitle}
        </Text>
      </View>

      <View style={[styles.progressCard, { backgroundColor: theme.surface }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: theme.text }]}>Subtasks Progress</Text>
          <Text style={[styles.progressCount, { color: theme.textSecondary }]}>
            {completedCount} of {subtasks.length} completed
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%`, backgroundColor: theme.primary }
            ]} 
          />
        </View>
        <Text style={[styles.progressPercent, { color: theme.primary }]}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>

      <View style={styles.addSection}>
        {showAddForm ? (
          <View style={[styles.addForm, { backgroundColor: theme.surface }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Enter subtask title..."
              placeholderTextColor={theme.textSecondary}
              value={newSubtaskTitle}
              onChangeText={setNewSubtaskTitle}
              autoFocus
            />
            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: theme.primary }]}
                onPress={handleAddSubtask}
              >
                <Text style={[styles.addBtnText, { color: theme.background }]}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: theme.border }]}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={[styles.cancelBtnText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={[styles.addButtonText, { color: theme.background }]}>+ Add Subtask</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={subtasks}
        renderItem={renderSubtask}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No subtasks yet. Add one to break down this task!
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  progressCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressCount: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  addSection: {
    marginBottom: 16,
  },
  addButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addForm: {
    padding: 16,
    borderRadius: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  addBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  subtaskTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});