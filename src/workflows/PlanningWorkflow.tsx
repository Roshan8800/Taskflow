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
    const projectId = await createProject({
      name,
      description: `Project created for planning`,
      color: '#000000'
    });
    setSelectedProject(projectId._id.toString());
  };

  const addTaskToProject = async () => {
    if (!newTaskTitle.trim()) return;

    await addTask({
      title: newTaskTitle,
      projectId: selectedProject,
      labels: selectedLabels,
      priority: 'medium',
      dueAt: new Date(),
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
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, { color: '#000000' }]}>Project Planning</Text>

      {}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#000000' }]}>Select Project</Text>
        <View style={styles.projectIdGrid}>
          {projects.map(projectId => (
            <TouchableOpacity
              key={projectId._id.toString()}
              style={[
                styles.projectIdCard,
                { backgroundColor: '#FFFFFF', borderColor: '#CCCCCC' },
                selectedProject === projectId._id.toString() && { borderColor: '#CCCCCC', borderWidth: 2 }
              ]}
              onPress={() => setSelectedProject(projectId._id.toString())}
            >
              <Text style={[styles.projectIdName, { color: '#000000' }]}>{projectId.name}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={[styles.projectIdCard, styles.newProject, { backgroundColor: '#FFFFFF' }]}
            onPress={() => createNewProject(`Project ${projects.length + 1}`)}
          >
            <Text style={styles.newProjectText}>+ New Project</Text>
          </TouchableOpacity>
        </View>
      </View>

      {}
      {selectedProject && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#000000' }]}>Add Task</Text>
          
          <TextInput
            style={[styles.input, { backgroundColor: '#FFFFFF', color: '#000000', borderColor: '#CCCCCC' }]}
            placeholder="Task title"
            placeholderTextColor={theme.textSecondary}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />

          {}
          <View style={styles.labelSection}>
            <Text style={[styles.labelTitle, { color: '#000000' }]}>Labels</Text>
            <View style={styles.labelGrid}>
              {availableLabels.map(label => (
                <TouchableOpacity
                  key={label}
                  style={[
                    styles.labelChip,
                    { backgroundColor: '#FFFFFF', borderColor: '#CCCCCC' },
                    selectedLabels.includes(label) && { backgroundColor: '#FFFFFF' }
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

          {}
          <RepeatRuleSelector value={repeatRule} onChange={setRepeatRule} />

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: '#FFFFFF' }]}
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