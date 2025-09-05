import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useProjects } from '../hooks/useProjects';
import { useRoute, useNavigation } from '@react-navigation/native';

export const ProjectSettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { updateProject, deleteProject } = useProjects();
  const route = useRoute();
  const navigation = useNavigation();
  
  const { project } = route.params as { project: any };
  
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [selectedColor, setSelectedColor] = useState(project.color);

  const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Project name is required');
      return;
    }
    
    updateProject(project._id, name.trim(), description.trim(), selectedColor);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.name}"? All tasks will be moved to unassigned.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProject(project._id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container(theme)}>
      <View style={styles.form(theme)}>
        <Text style={styles.title(theme)}>Project Settings</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label(theme)}>Name</Text>
          <TextInput
            style={styles.input(theme)}
            value={name}
            onChangeText={setName}
            placeholder="Project name"
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label(theme)}>Description</Text>
          <TextInput
            style={styles.textArea(theme)}
            value={description}
            onChangeText={setDescription}
            placeholder="Project description (optional)"
            placeholderTextColor={theme.colors.textMuted}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label(theme)}>Color</Text>
          <View style={styles.colorGrid}>
            {colors.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor(theme)
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveButton(theme)} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton(theme)} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Project</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton(theme)} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText(theme)}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  title: (theme: any) => ({
    fontSize: 24,
    fontWeight: '700',
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
  textArea: (theme: any) => ({
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    textAlignVertical: 'top',
  }),
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColor: (theme: any) => ({
    borderWidth: 3,
    borderColor: theme.colors.text,
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
  deleteButton: (theme: any) => ({
    backgroundColor: theme.colors.error,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  }),
  deleteText: {
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