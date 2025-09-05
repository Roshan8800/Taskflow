import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BSON } from 'realm';
import { Project } from '../models/Project';
import { useProjectManager } from '../hooks/useProjectManager';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPress, onEdit, onDelete }) => {
  const { getProjectStats } = useProjectManager();
  const stats = getProjectStats(project._id);

  return (
    <TouchableOpacity onPress={onPress} style={{ margin: 8 }}>
      <View style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: project.color,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 24, marginRight: 8 }}>{project.icon}</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1 }}>{project.name}</Text>
          {project.isArchived && (
            <View style={{ backgroundColor: '#f0f0f0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ fontSize: 12, color: '#666' }}>Archived</Text>
            </View>
          )}
        </View>

        {project.description && (
          <Text style={{ color: '#666', marginBottom: 12, fontSize: 14 }}>{project.description}</Text>
        )}

        <View style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Progress</Text>
            <Text style={{ fontSize: 14, fontWeight: '600' }}>{Math.round(stats.progress)}%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: '#f0f0f0', borderRadius: 3 }}>
            <View style={{
              height: 6,
              backgroundColor: project.color,
              borderRadius: 3,
              width: `${stats.progress}%`,
            }} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#666' }}>
            {stats.completed}/{stats.total} tasks
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={onEdit} style={{ padding: 8 }}>
              <Text style={{ color: project.color, fontWeight: '600' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={{ padding: 8 }}>
              <Text style={{ color: '#ff4444', fontWeight: '600' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};