import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { BSON } from 'realm';
import { Project } from '../models/Project';
import { useProjectManager } from '../hooks/useProjectManager';

const COLORS = ['#4A90E2', '#50C878', '#FF6B6B', '#FFD93D', '#9B59B6', '#FF8C00'];
const ICONS = ['📁', '💼', '🎯', '🚀', '💡', '🔥', '⭐', '🎨'];

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose, onSuccess }) => {
  const { createProject, updateProject, loading } = useProjectManager();
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [selectedColor, setSelectedColor] = useState(project?.color || COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(project?.icon || ICONS[0]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Project name is required');
      return;
    }

    try {
      if (project) {
        await updateProject(project._id, { name, description, color: selectedColor, icon: selectedIcon });
      } else {
        await createProject({ name, description, color: selectedColor, icon: selectedIcon });
      }
      onSuccess();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save project');
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        {project ? 'Edit Project' : 'New Project'}
      </Text>

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter project name"
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16 }}
      />

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter project description"
        multiline
        numberOfLines={3}
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16 }}
      />

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Color</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
        {COLORS.map(color => (
          <TouchableOpacity
            key={color}
            onPress={() => setSelectedColor(color)}
            style={{
              width: 40,
              height: 40,
              backgroundColor: color,
              borderRadius: 20,
              margin: 4,
              borderWidth: selectedColor === color ? 3 : 0,
              borderColor: '#333',
            }}
          />
        ))}
      </View>

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Icon</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 }}>
        {ICONS.map(icon => (
          <TouchableOpacity
            key={icon}
            onPress={() => setSelectedIcon(icon)}
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 4,
              borderRadius: 8,
              backgroundColor: selectedIcon === icon ? '#f0f0f0' : 'transparent',
              borderWidth: selectedIcon === icon ? 2 : 1,
              borderColor: selectedIcon === icon ? selectedColor : '#ddd',
            }}
          >
            <Text style={{ fontSize: 24 }}>{icon}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity
          onPress={onClose}
          style={{ flex: 1, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={{ flex: 1, padding: 16, backgroundColor: selectedColor, borderRadius: 8, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
            {loading ? 'Saving...' : project ? 'Update' : 'Create'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};