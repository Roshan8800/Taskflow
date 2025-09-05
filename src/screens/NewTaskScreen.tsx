import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTodos } from '../hooks/useTodos';
import { useProjects } from '../hooks/useProjects';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BSON } from 'realm';

export const NewTaskScreen: React.FC = () => {
  const { theme } = useTheme();
  const { addTodo } = useTodos();
  const { projects } = useProjects();
  const navigation = useNavigation();
  const route = useRoute();
  
  const { projectId } = (route.params as { projectId?: string }) || {};
  
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || '');

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (trimmedTitle.length > 200) {
      Alert.alert('Error', 'Task title must be less than 200 characters');
      return;
    }

    const dueDate = new Date(); // Default to today
    const projectObjectId = selectedProjectId && selectedProjectId !== 'unassigned' 
      ? new BSON.ObjectId(selectedProjectId) 
      : undefined;
    addTodo(trimmedTitle, dueDate, priority, projectObjectId);
    navigation.goBack();
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.success;
      default: return theme.colors.textMuted;
    }
  };

  return (
    <ScrollView style={styles.container(theme)}>
      <View style={styles.form(theme)}>
        <Text style={styles.sectionTitle(theme)}>Task Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label(theme)}>Title</Text>
          <TextInput
            style={styles.input(theme)}
            placeholder="Enter task title..."
            placeholderTextColor={theme.colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label(theme)}>Priority</Text>
          <View style={styles.priorityButtons}>
            {['low', 'medium', 'high'].map(p => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityButton(theme),
                  priority === p && { backgroundColor: getPriorityColor(p) }
                ]}
                onPress={() => setPriority(p)}
              >
                <Text style={[
                  styles.priorityText(theme),
                  priority === p && { color: '#FFFFFF' }
                ]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label(theme)}>Project</Text>
          <View style={styles.projectButtons}>
            <TouchableOpacity
              style={[
                styles.projectButton(theme),
                selectedProjectId === '' && styles.activeProject(theme)
              ]}
              onPress={() => setSelectedProjectId('')}
            >
              <Text style={[
                styles.projectText(theme),
                selectedProjectId === '' && { color: '#FFFFFF' }
              ]}>
                None
              </Text>
            </TouchableOpacity>
            {projects.map(project => (
              <TouchableOpacity
                key={project._id.toString()}
                style={[
                  styles.projectButton(theme),
                  selectedProjectId === project._id.toString() && styles.activeProject(theme)
                ]}
                onPress={() => setSelectedProjectId(project._id.toString())}
              >
                <View style={[styles.projectColorDot, { backgroundColor: project.color }]} />
                <Text style={[
                  styles.projectText(theme),
                  selectedProjectId === project._id.toString() && { color: '#FFFFFF' }
                ]} numberOfLines={1}>
                  {project.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.saveButton(theme)}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Create Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton(theme)}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText(theme)}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: (theme: any) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  }),
  form: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...theme.shadows.md,
  }),
  sectionTitle: (theme: any) => ({
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 20,
  }),
  inputGroup: {
    marginBottom: 20,
  },
  label: (theme: any) => ({
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  }),
  input: (theme: any) => ({
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }),
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: (theme: any) => ({
    flex: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  }),
  priorityText: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  }),
  projectButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  projectButton: (theme: any) => ({
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 80,
  }),
  activeProject: (theme: any) => ({
    backgroundColor: theme.colors.primary,
  }),
  projectColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  projectText: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  }),
  actions: {
    gap: 12,
  },
  saveButton: (theme: any) => ({
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  }),
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: (theme: any) => ({
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  }),
  cancelText: (theme: any) => ({
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  }),
});