import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import { useProjectManager } from '../hooks/useProjectManager';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectForm } from '../components/ProjectForm';
import { Project } from '../models/Project';

export const ProjectsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { getProjects, deleteProject, archiveProject } = useProjectManager();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [showArchived, setShowArchived] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    loadProjects();
  }, [showArchived, refreshKey]);

  const loadProjects = async () => {
    try {
      const projectList = await getProjects(showArchived);
      setProjects(Array.from(projectList));
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleDelete = (project: Project) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.name}"? All tasks will be unassigned.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProject(project._id);
              setRefreshKey(prev => prev + 1);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete project');
            }
          },
        },
      ]
    );
  };

  const handleArchive = async (project: Project) => {
    try {
      await archiveProject(project._id, !project.isArchived);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      Alert.alert('Error', 'Failed to archive project');
    }
  };

  const handleSuccess = () => {
    loadProjects();
    setRefreshKey(prev => prev + 1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Projects</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => setShowArchived(!showArchived)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: showArchived ? '#4A90E2' : '#f0f0f0',
              borderRadius: 16,
            }}
          >
            <Text style={{ color: showArchived ? 'white' : '#666', fontSize: 12 }}>
              {showArchived ? 'Hide Archived' : 'Show Archived'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowForm(true)}
            style={{ backgroundColor: '#4A90E2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>+ New</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={projects}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => navigation.navigate('ProjectOverview', { projectId: item._id })}
            onEdit={() => {
              setEditingProject(item);
              setShowForm(true);
            }}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 18, color: '#666' }}>No projects yet</Text>
            <Text style={{ color: '#999', marginTop: 8 }}>Create your first project to get started</Text>
          </View>
        }
      />

      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet">
        <ProjectForm
          project={editingProject}
          onClose={() => {
            setShowForm(false);
            setEditingProject(undefined);
          }}
          onSuccess={handleSuccess}
        />
      </Modal>
    </View>
  );
};