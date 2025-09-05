import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useProjectManager } from '../hooks/useProjectManager';
import { useTaskManager } from '../hooks/useTaskManager';
import { useTheme } from '../hooks/useTheme';
import { RepeatRuleSelector } from '../components/RepeatRuleSelector';
import { RepeatRule } from '../utils/repeatLogic';

export const PlanningWorkflow = () => {
  const { projects, createProject } = useProjectManager();
  const { addTask } = useTaskManager();
  const { theme } = useTheme();
  
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [repeatRule, setRepeatRule] = useState<RepeatRule | undefined>();

  const availableLabels = ['urgent', 'work', 'personal', 'shopping', 'health'];

  const createNewProject = async (name: string) => {
    const project = await createProject({
      name,
      description: `Project created for planning`,
      color: theme.primary
    });
    setSelectedProject(project._id.toString());
  };

  const addTaskToProject = async () => {
    if (!newTaskTitle.trim()) return;

    await addTask({
      title: newTaskTitle,
      project: selectedProject,
      labels: selectedLabels,
      priority: 'medium',
      dueDate: new Date(),
      repeatRule: repeatRule ? JSON.stringify(repeatRule) : undefined
    });

    setNewTaskTitle('');
    setSelectedLabels([]);
    setRepeatRule(undefined);
  };

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Project Planning</Text>

      {/* Project Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Project</Text>
        <View style={styles.projectGrid}>
          {projects.map(project => (
            <TouchableOpacity
              key={project._id.toString()}
              style={[
                styles.projectCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
                selectedProject === project._id.toString() && { borderColor: theme.primary, borderWidth: 2 }
              ]}
              onPress={() => setSelectedProject(project._id.toString())}
            >
              <Text style={[styles.projectName, { color: theme.text }]}>{project.name}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={[styles.projectCard, styles.newProject, { backgroundColor: theme.primary }]}
            onPress={() => createNewProject(`Project ${projects.length + 1}`)}
          >
            <Text style={styles.newProjectText}>+ New Project</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Task Creation */}
      {selectedProject && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Add Task</Text>
          
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="Task title"
            placeholderTextColor={theme.textSecondary}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />

          {/* Labels */}
          <View style={styles.labelSection}>
            <Text style={[styles.labelTitle, { color: theme.text }]}>Labels</Text>
            <View style={styles.labelGrid}>
              {availableLabels.map(label => (
                <TouchableOpacity
                  key={label}
                  style={[
                    styles.labelChip,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                    selectedLabels.includes(label) && { backgroundColor: theme.primary }
                  ]}
                  onPress={() => toggleLabel(label)}
                >
                  <Text style={[
                    styles.labelText,
                    { color: selectedLabels.includes(label) ? 'white' : theme.text }
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Repeat Rule */}
          <RepeatRuleSelector value={repeatRule} onChange={setRepeatRule} />

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={addTaskToProject}
          >
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  projectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  projectCard: { padding: 16, borderRadius: 8, borderWidth: 1, minWidth: 120 },
  projectName: { fontSize: 14, fontWeight: '500' },
  newProject: { alignItems: 'center', justifyContent: 'center' },
  newProjectText: { color: 'white', fontWeight: '600' },
  input: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 16 },
  labelSection: { marginBottom: 16 },
  labelTitle: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  labelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  labelChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  labelText: { fontSize: 12, fontWeight: '500' },
  addButton: { padding: 16, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: '600' }
});