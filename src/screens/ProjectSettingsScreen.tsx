import { useNavigation } from '@react-navigation/native';
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
  
  const { projectId } = route.params as { projectId: any };
  
  const [name, setName] = useState(projectId.name);
  const [description, setDescription] = useState(projectId.description || '');
  const [selectedColor, setSelectedColor] = useState(projectId.color);

  const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Project name is required');
      return;
    }
    
    updateProject(projectId._id, name.trim(), description.trim(), selectedColor);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${projectId.name}"? All tasks will be moved to unassigned.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProject(projectId._id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.form]}>
        <Text style={[styles.title]}>Project Settings</Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label]}>Name</Text>
          <TextInput
            style={[styles.input]}
            value={name}
            onChangeText={setName}
            placeholder="Project name"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label]}>Description</Text>
          <TextInput
            style={[styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Project description (optional)"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label]}>Color</Text>
          <View style={styles.colorGrid}>
            {colors.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.saveButton]} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Project</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={[styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
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
  textArea: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
    textAlignVertical: 'top',
  },
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
  selectedColor: {
    borderWidth: 3,
    borderColor: '#000000',
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
  deleteButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  deleteText: {
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

export default ProjectSettingsScreen;