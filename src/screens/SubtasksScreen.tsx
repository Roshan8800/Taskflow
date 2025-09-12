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
    <View style={[styles.subtaskItem, { backgroundColor: '#FFFFFF' }]}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          { borderColor: '#CCCCCC' },
          item.completed && { backgroundColor: '#FFFFFF', borderColor: '#CCCCCC' }
        ]}
        onPress={() => onToggleSubtask(item._id.toString())}
      >
        {item.completed && <Text style={[styles.checkmark, { color: '#000000' }]}>✓</Text>}
      </TouchableOpacity>
      
      <Text style={[
        styles.subtaskTitle,
        { color: '#000000' },
        item.completed && { textDecorationLine: 'line-through', color: '#000000' }
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
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={[styles.backBtn, { color: '#000000' }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: '#000000' }]} numberOfLines={1}>
          {taskTitle}
        </Text>
      </View>

      <View style={[styles.progressCard, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: '#000000' }]}>Subtasks Progress</Text>
          <Text style={[styles.progressCount, { color: '#000000' }]}>
            {completedCount} of {subtasks.length} completed
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: '#FFFFFF' }]}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%`, backgroundColor: '#FFFFFF' }
            ]} 
          />
        </View>
        <Text style={[styles.progressPercent, { color: '#000000' }]}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>

      <View style={styles.addSection}>
        {showAddForm ? (
          <View style={[styles.addForm, { backgroundColor: '#FFFFFF' }]}>
            <TextInput
              style={[styles.input, { backgroundColor: '#FFFFFF', color: '#000000' }]}
              placeholder="Enter subtask title#FFFFFF' }]}
                onPress={handleAddSubtask}
              >
                <Text style={[styles.addBtnText, { color: '#000000' }]}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: '#FFFFFF' }]}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={[styles.cancelBtnText, { color: '#000000' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: '#FFFFFF' }]}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={[styles.addButtonText, { color: '#000000' }]}>+ Add Subtask</Text>
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
            <Text style={[styles.emptyText, { color: '#000000' }]}>
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

export default SubtasksScreen;