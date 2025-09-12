import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { BSON } from 'realm';
import { useProjectManager } from '../hooks/useProjectManager';

interface ProjectSelectorProps {
  selectedProjectId?: BSON.ObjectId;
  onSelect: (projectId?: BSON.ObjectId) => void;
  style?: any;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({ selectedProjectId, onSelect, style }) => {
  const { getProjects } = useProjectManager();
  const [showModal, setShowModal] = useState(false);
  
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectList = await getProjects(false);
      setProjects(Array.from(projectList));
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };
  const selectedProject = selectedProjectId ? projects.find(p => p._id.equals(selectedProjectId)) : null;

  return (
    <View style={style}>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          backgroundColor: '#f5f5f5',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ddd',
        }}
      >
        {selectedProject ? (
          <>
            <Text style={{ fontSize: 20, marginRight: 8 }}>{selectedProject.icon}</Text>
            <Text style={{ flex: 1, fontSize: 16 }}>{selectedProject.name}</Text>
          </>
        ) : (
          <Text style={{ flex: 1, fontSize: 16, color: '#666' }}>Select projectId (optional)</Text>
        )}
        <Text style={{ fontSize: 16, color: '#666' }}>▼</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select Project</Text>
          </View>
          
          <FlatList
            data={[null, ...projectIds]}
            keyExtractor={(item, index) => item?._id.toString() || 'none'}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item?._id);
                  setShowModal(false);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                  backgroundColor: selectedProjectId?.equals(item?._id) ? '#f0f8ff' : 'white',
                }}
              >
                {item ? (
                  <>
                    <Text style={{ fontSize: 24, marginRight: 12 }}>{item.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.name}</Text>
                      {item.description && (
                        <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>{item.description}</Text>
                      )}
                    </View>
                    <View style={{ width: 4, height: 20, backgroundColor: item.color, borderRadius: 2 }} />
                  </>
                ) : (
                  <Text style={{ fontSize: 16, color: '#666' }}>No Project</Text>
                )}
              </TouchableOpacity>
            )}
          />
          
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={{ padding: 16, backgroundColor: '#f5f5f5', alignItems: 'center' }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ProjectSelector;