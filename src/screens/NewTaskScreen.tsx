import { useNavigation } from '@react-navigation/native';
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
      case 'high': return theme.error;
      case 'medium': return theme.warning;
      case 'low': return theme.success;
      default: return theme.textSecondary;
    }
  };

  return (
    <ScrollView style={[styles.container]}>
      <View style={[styles.form]}>
        <Text style={[styles.sectionTitle]}>Task Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label]}>Title</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Enter task titlelow', 'medium', 'high'].map(p => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityButton,
                  priority === p && { backgroundColor: getPriorityColor(p) }
                ]}
                onPress={() => setPriority(p)}
              >
                <Text style={[
                  styles.priorityText,
                  priority === p && { color: '#FFFFFF' }
                ]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label]}>Project</Text>
          <View style={styles.projectIdButtons}>
            <TouchableOpacity
              style={[
                styles.projectIdButton,
                selectedProjectId === '' && styles.activeProject
              ]}
              onPress={() => setSelectedProjectId('')}
            >
              <Text style={[
                styles.projectIdText,
                selectedProjectId === '' && { color: '#FFFFFF' }
              ]}>
                None
              </Text>
            </TouchableOpacity>
            {projects.map(projectId => (
              <TouchableOpacity
                key={projectId._id.toString()}
                style={[
                  styles.projectIdButton,
                  selectedProjectId === projectId._id.toString() && styles.activeProject
                ]}
                onPress={() => setSelectedProjectId(projectId._id.toString())}
              >
                <View style={[styles.projectIdColorDot, { backgroundColor: projectId.color }]} />
                <Text style={[
                  styles.projectIdText,
                  selectedProjectId === projectId._id.toString() && { color: '#FFFFFF' }
                ]} numberOfLines={1}>
                  {projectId.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Create Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  form: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  projectButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  projectButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 80,
  },
  activeProject: {
    backgroundColor: '#000000',
  },
  projectColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  projectText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  actions: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default NewTaskScreen;