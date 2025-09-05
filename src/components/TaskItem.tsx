import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Todo } from '../models/Todo';

interface TaskItemProps {
  task: Todo;
  onToggle: (id: string) => void;
  onEdit: (task: Todo) => void;
  onDelete: (id: string) => void;
  onSnooze?: (id: string, date: Date) => void;
  onArchive?: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
  compact?: boolean;
  showProject?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  onSnooze,
  onArchive,
  selectable = false,
  selected = false,
  onSelect,
  compact = false,
  showProject = true,
}) => {
  const { theme } = useTheme();
  const [showActions, setShowActions] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#FF0000';
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFD93D';
      case 'low': return '#6BCF7F';
      default: return theme.textSecondary;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `${diffDays} days left`;
  };

  const handleSnooze = () => {
    const snoozeOptions = [
      { label: '1 hour', hours: 1 },
      { label: '3 hours', hours: 3 },
      { label: 'Tomorrow', hours: 24 },
      { label: '1 week', hours: 168 },
    ];

    Alert.alert(
      'Snooze Task',
      'Choose snooze duration',
      [
        ...snoozeOptions.map(option => ({
          text: option.label,
          onPress: () => {
            const snoozeDate = new Date();
            snoozeDate.setHours(snoozeDate.getHours() + option.hours);
            onSnooze(task._id.toString(), snoozeDate);
          }
        })),
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(task._id.toString()) }
      ]
    );
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && !task.completed;
  const isSnoozed = task.snoozeUntil && task.snoozeUntil > new Date();

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.surface },
      selected && { borderColor: theme.primary, borderWidth: 2 },
      task.completed && { opacity: 0.7 }
    ]}>
      <View style={styles.mainContent}>
        {selectable && (
          <TouchableOpacity
            style={[
              styles.checkbox,
              { borderColor: theme.border },
              selected && { backgroundColor: theme.primary, borderColor: theme.primary }
            ]}
            onPress={() => onSelect?.(task._id.toString())}
          >
            {selected && <Text style={[styles.checkmark, { color: theme.background }]}>✓</Text>}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.taskCheckbox,
            { borderColor: getPriorityColor(task.priority) },
            task.completed && { backgroundColor: getPriorityColor(task.priority) }
          ]}
          onPress={() => onToggle(task._id.toString())}
        >
          {task.completed && <Text style={styles.taskCheckmark}>✓</Text>}
        </TouchableOpacity>

        <View style={styles.taskContent}>
          <View style={styles.taskHeader}>
            <Text style={[
              styles.taskTitle,
              { color: theme.text },
              task.completed && { textDecorationLine: 'line-through', color: theme.textSecondary }
            ]}>
              {task.title}
            </Text>
            
            <View style={styles.taskMeta}>
              {task.isRecurring && <Text style={styles.recurringIcon}>🔁</Text>}
              {task.attachments.length > 0 && <Text style={styles.attachmentIcon}>📎</Text>}
              {isSnoozed && <Text style={styles.snoozeIcon}>😴</Text>}
              <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
            </View>
          </View>

          {task.description && !compact && (
            <Text style={[styles.taskDescription, { color: theme.textSecondary }]} numberOfLines={2}>
              {task.description}
            </Text>
          )}

          {task.project && showProject && (
            <Text style={[styles.taskProject, { color: theme.primary }]}>
              📁 {task.project}
            </Text>
          )}

          {task.labels.length > 0 && (
            <View style={styles.labelsContainer}>
              {task.labels.slice(0, 3).map((label, index) => (
                <View key={index} style={[styles.labelChip, { backgroundColor: task.color + '20' }]}>
                  <Text style={[styles.labelText, { color: task.color }]}>#{label}</Text>
                </View>
              ))}
              {task.labels.length > 3 && (
                <Text style={[styles.moreLabels, { color: theme.textSecondary }]}>
                  +{task.labels.length - 3}
                </Text>
              )}
            </View>
          )}

          {task.dueDate && (
            <Text style={[
              styles.dueDate,
              { color: isOverdue ? '#FF6B6B' : theme.textSecondary }
            ]}>
              📅 {formatDate(task.dueDate)}
            </Text>
          )}

          {task.notes && !compact && (
            <Text style={[styles.notes, { color: theme.textSecondary }]} numberOfLines={1}>
              📝 {task.notes}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setShowActions(!showActions)}
        >
          <Text style={[styles.moreIcon, { color: theme.textSecondary }]}>⋮</Text>
        </TouchableOpacity>
      </View>

      {showActions && (
        <View style={[styles.actionsContainer, { backgroundColor: theme.background }]}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(task)}>
            <Text style={[styles.actionText, { color: theme.primary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleSnooze}>
            <Text style={[styles.actionText, { color: theme.primary }]}>Snooze</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onArchive(task._id.toString())}>
            <Text style={[styles.actionText, { color: theme.primary }]}>Archive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleDelete}>
            <Text style={[styles.actionText, { color: '#FF6B6B' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 8, borderRadius: 8, overflow: 'hidden' },
  mainContent: { flexDirection: 'row', alignItems: 'flex-start', padding: 16 },
  checkbox: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkmark: { fontSize: 12, fontWeight: 'bold' },
  taskCheckbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  taskCheckmark: { fontSize: 14, fontWeight: 'bold', color: 'white' },
  taskContent: { flex: 1 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  taskTitle: { fontSize: 16, fontWeight: '500', flex: 1, marginRight: 8 },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  recurringIcon: { fontSize: 12 },
  attachmentIcon: { fontSize: 12 },
  snoozeIcon: { fontSize: 12 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  taskDescription: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  taskProject: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  labelsContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  labelChip: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  labelText: { fontSize: 12, fontWeight: '500' },
  moreLabels: { fontSize: 12 },
  dueDate: { fontSize: 14, marginBottom: 2 },
  notes: { fontSize: 14 },
  moreButton: { padding: 4 },
  moreIcon: { fontSize: 16, fontWeight: 'bold' },
  actionsContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 12, gap: 16 },
  actionBtn: { paddingVertical: 4 },
  actionText: { fontSize: 14, fontWeight: '500' },
});