import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTaskManager } from '../hooks/useTaskManager';

export const TaskDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { getTasks, toggleTask, deleteTask } = useTaskManager();
  const tasks = getTasks();
  
  const taskId = 'sample-id';
  const task = tasks.find(t => t._id.toString() === taskId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.title || '');
  const [newSubtask, setNewSubtask] = useState('');

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Task not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteTask(task._id.toString());
          }
        }]
    );
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFD93D';
      case 'low': return '#50C878';
      default: return '#999';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor() }]} />
        
        {isEditing ? (
          <TextInput
            style={styles.titleInput}
            value={editTitle}
            onChangeText={setEditTitle}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.title}>
              {task.title}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{task.status || 'PENDING'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Priority:</Text>
          <Text style={[styles.value, { color: getPriorityColor() }]}>
            {task.priority.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Created:</Text>
          <Text style={styles.value}>
            {new Date(task.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleTask(task._id.toString())}
        >
          <Text style={styles.actionText}>
            {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF6B6B' }]}
          onPress={handleDelete}
        >
          <Text style={styles.actionText}>Delete Task</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 6,
    height: 60,
    borderRadius: 3,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#4A90E2',
  },
  details: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  actions: {
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 100,
  },
});

export default TaskDetailScreen;