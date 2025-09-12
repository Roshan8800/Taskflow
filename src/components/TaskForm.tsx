import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Todo } from '../models/Todo';

interface TaskFormProps {
  task?: Todo;
  onSave: (taskData: any) => void;
  onCancel: () => void;
  projectId?: BSON.ObjectId;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel, projectId }) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>(task?.priority || 'medium');
  const [projectId, setProject] = useState(task?.projectId || '');
  const [labels, setLabels] = useState<string[]>(task?.labels || []);
  const [color, setColor] = useState(task?.color || '#4A90E2');
  const [notes, setNotes] = useState(task?.notes || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueAt);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(task?.reminderDate);
  const [isRecurring, setIsRecurring] = useState(task?.isRecurring || false);
  const [recurringType, setRecurringType] = useState<'daily' | 'weekly' | 'monthly'>(task?.recurringType || 'daily');
  const [recurringDays, setRecurringDays] = useState<number[]>(task?.recurringDays || []);
  const [newLabel, setNewLabel] = useState('');

  const priorities = [
    { value: 'low', label: 'Low', color: '#6BCF7F' },
    { value: 'medium', label: 'Medium', color: '#FFD93D' },
    { value: 'high', label: 'High', color: '#FF6B6B' },
    { value: 'urgent', label: 'Urgent', color: '#FF0000' }];

  const colors = ['#4A90E2', '#FF6B6B', '#4ECDC4', '#FFD93D', '#96CEB4', '#DDA0DD'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const addLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel('');
    }
  };

  const removeLabel = (label: string) => {
    setLabels(labels.filter(l => l !== label));
  };

  const toggleRecurringDay = (day: number) => {
    setRecurringDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      projectId: projectId.trim(),
      labels,
      color,
      notes: notes.trim(),
      dueDate,
      reminderDate,
      isRecurring,
      recurringType: isRecurring ? recurringType : undefined,
      recurringDays: isRecurring && recurringType === 'weekly' ? recurringDays : undefined,
      projectId,
    };

    onSave(taskData);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={[styles.cancelBtn, { color: '#000000' }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: '#000000' }]}>
          {task ? 'Edit Task' : 'New Task'}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveBtn, { color: '#000000' }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: '#000000' }]}>Title *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#FFFFFF', color: '#000000' }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: '#000000' }]}>Description</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: '#FFFFFF', color: '#000000' }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Task description"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: '#000000' }]}>Priority</Text>
          <View style={styles.priorityGrid}>
            {priorities.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.priorityBtn,
                  { backgroundColor: priority === p.value ? p.color : theme.surface }
                ]}
                onPress={() => setPriority(p.value as any)}
              >
                <Text style={[
                  styles.priorityText,
                  { color: priority === p.value ? 'white' : theme.text }
                ]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: '#000000' }]}>Color</Text>
          <View style={styles.colorGrid}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorBtn,
                  { backgroundColor: c },
                  color === c && styles.selectedColor
                ]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: '#000000' }]}>Project</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#FFFFFF', color: '#000000' }]}
            value={projectId}
            onChangeText={setProject}
            placeholder="Project name"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: '#000000' }]}>Labels</Text>
          <View style={styles.labelInput}>
            <TextInput
              style={[styles.input, { flex: 1, backgroundColor: '#FFFFFF', color: '#000000' }]}
              value={newLabel}
              onChangeText={setNewLabel}
              placeholder="Add label"
              placeholderTextColor={theme.textSecondary}
              onSubmitEditing={addLabel}
            />
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: '#FFFFFF' }]}
              onPress={addLabel}
            >
              <Text style={[styles.addBtnText, { color: '#000000' }]}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.labelsContainer}>
            {labels.map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.labelChip, { backgroundColor: '#FFFFFF' + '20' }]}
                onPress={() => removeLabel(label)}
              >
                <Text style={[styles.labelText, { color: '#000000' }]}>{label}</Text>
                <Text style={[styles.removeLabel, { color: '#000000' }]}>×</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: '#000000' }]}>Notes</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: '#FFFFFF', color: '#000000' }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: '#000000' }]}>Recurring Task</Text>
            <Switch
              value={isRecurring}
              onValueChange={setIsRecurring}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
          
          {isRecurring && (
            <>
              <View style={styles.recurringOptions}>
                {['daily', 'weekly', 'monthly'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.recurringBtn,
                      { backgroundColor: recurringType === type ? theme.primary : theme.surface }
                    ]}
                    onPress={() => setRecurringType(type as any)}
                  >
                    <Text style={[
                      styles.recurringText,
                      { color: recurringType === type ? theme.background : theme.text }
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {recurringType === 'weekly' && (
                <View style={styles.daysGrid}>
                  {weekDays.map((day, index) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayBtn,
                        { 
                          backgroundColor: recurringDays.includes(index) ? theme.primary : theme.surface,
                          borderColor: '#CCCCCC' 
                        }
                      ]}
                      onPress={() => toggleRecurringDay(index)}
                    >
                      <Text style={[
                        styles.dayText,
                        { color: recurringDays.includes(index) ? theme.background : theme.text }
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 50 },
  cancelBtn: { fontSize: 16 },
  title: { fontSize: 18, fontWeight: '600' },
  saveBtn: { fontSize: 16, fontWeight: '600' },
  form: { padding: 16 },
  section: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  input: { padding: 12, borderRadius: 8, fontSize: 16 },
  textArea: { padding: 12, borderRadius: 8, fontSize: 16, minHeight: 80, textAlignVertical: 'top' },
  priorityGrid: { flexDirection: 'row', gap: 8 },
  priorityBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  priorityText: { fontSize: 14, fontWeight: '500' },
  colorGrid: { flexDirection: 'row', gap: 12 },
  colorBtn: { width: 32, height: 32, borderRadius: 16 },
  selectedColor: { borderWidth: 3, borderColor: '#000' },
  labelInput: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  addBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  addBtnText: { fontSize: 14, fontWeight: '600' },
  labelsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  labelChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  labelText: { fontSize: 14, marginRight: 4 },
  removeLabel: { fontSize: 16, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  recurringOptions: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  recurringBtn: { flex: 1, padding: 8, borderRadius: 6, alignItems: 'center' },
  recurringText: { fontSize: 14, fontWeight: '500' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  dayText: { fontSize: 12, fontWeight: '500' },
});

export default TaskForm;