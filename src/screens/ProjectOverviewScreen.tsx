import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { BSON } from 'realm';
import { useProjectManager } from '../hooks/useProjectManager';
import { TaskItem } from '../components/TaskItem';

interface ProjectOverviewScreenProps {
  route: { params: { projectId: BSON.ObjectId } };
  navigation: any;
}

export const ProjectOverviewScreen: React.FC<ProjectOverviewScreenProps> = ({ route, navigation }) => {
  const { projectId } = route.params;
  const { getProjects, getProjectStats, getProjectTasks } = useProjectManager();
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all');

  const [projectId, setProject] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, progress: 0, priorities: { urgent: 0, high: 0, medium: 0, low: 0 } });
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    loadProjectData();
  }, [projectId, statusFilter, priorityFilter]);

  const loadProjectData = async () => {
    try {
      const projects = await getProjects(true);
      const foundProject = Array.from(projects).find(p => p._id.equals(projectId));
      setProject(foundProject);
      
      if (foundProject) {
        const projectStats = await getProjectStats(projectId);
        setStats(projectStats);
        
        const projectTasks = await getProjectTasks(projectId, { status: statusFilter, priority: priorityFilter });
        setTasks(Array.from(projectTasks));
      }
    } catch (error) {
      console.error('Failed to load projectId data:', error);
    }
  };

  if (!projectId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Project not found</Text>
      </View>
    );
  }

  const StatusFilter = () => (
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
      {['all', 'pending', 'completed'].map(status => (
        <TouchableOpacity
          key={status}
          onPress={() => setStatusFilter(status as any)}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: statusFilter === status ? projectId.color : '#f0f0f0',
            borderRadius: 16,
          }}
        >
          <Text style={{ color: statusFilter === status ? 'white' : '#666', fontSize: 12, textTransform: 'capitalize' }}>
            {status}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const PriorityFilter = () => (
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
      {['all', 'urgent', 'high', 'medium', 'low'].map(priority => (
        <TouchableOpacity
          key={priority}
          onPress={() => setPriorityFilter(priority as any)}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: priorityFilter === priority ? projectId.color : '#f0f0f0',
            borderRadius: 16,
          }}
        >
          <Text style={{ color: priorityFilter === priority ? 'white' : '#666', fontSize: 12, textTransform: 'capitalize' }}>
            {priority}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {}
      <View style={{ backgroundColor: 'white', padding: 20, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 32, marginRight: 12 }}>{projectId.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{projectId.name}</Text>
            {projectId.description && (
              <Text style={{ color: '#666', marginTop: 4 }}>{projectId.description}</Text>
            )}
          </View>
        </View>

        {}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>Overall Progress</Text>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{Math.round(stats.progress)}%</Text>
          </View>
          <View style={{ height: 8, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
            <View style={{
              height: 8,
              backgroundColor: projectId.color,
              borderRadius: 4,
              width: `${stats.progress}%`,
            }} />
          </View>
        </View>

        {}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: projectId.color }}>{stats.total}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Total</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#50C878' }}>{stats.completed}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Completed</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FF6B6B' }}>{stats.pending}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Pending</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFD93D' }}>{stats.priorities.urgent}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Urgent</Text>
          </View>
        </View>
      </View>

      {}
      <View style={{ backgroundColor: 'white', padding: 16, marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Filter by Status</Text>
        <StatusFilter />
        
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Filter by Priority</Text>
        <PriorityFilter />
      </View>

      {}
      <View style={{ backgroundColor: 'white', marginBottom: 16 }}>
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Tasks ({tasks.length})</Text>
        </View>
        
        {tasks.length === 0 ? (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text style={{ color: '#666', fontSize: 16 }}>No tasks match the current filters</Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={item => item._id.toString()}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggle={() => {}}
                onEdit={() => navigation.navigate('TaskForm' as never, { task: item })}
                onDelete={() => {}}
                showProject={false}
              />
            )}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default ProjectOverviewScreen;