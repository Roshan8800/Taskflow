import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Modal } from 'react-native';
import { useTaskManager } from '../hooks/useTaskManager';
import { useProjectManager } from '../hooks/useProjectManager';

interface GlobalSearchProps {
  visible: boolean;
  onClose: () => void;
  onTaskSelect: (taskId: any) => void;
  onProjectSelect: (projectId: any) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  visible,
  onClose,
  onTaskSelect,
  onProjectSelect,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const { getTasks } = useTaskManager();
  const { getProjects } = useProjectManager();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchTasks = () => {
      const tasks = Array.from(getTasks()).filter(task => 
        !task.isDeleted && (
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description?.toLowerCase().includes(query.toLowerCase()) ||
          task.labels.some(label => label.toLowerCase().includes(query.toLowerCase())) ||
          task.notes.toLowerCase().includes(query.toLowerCase())
        )
      );

      const projects = Array.from(getProjects()).filter(project =>
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description?.toLowerCase().includes(query.toLowerCase())
      );

      const taskResults = tasks.map(task => ({
        type: 'task',
        id: task._id,
        title: task.title,
        subtitle: task.description || 'No description',
        color: task.color,
        icon: '📝',
        priority: task.priority,
        completed: task.completed,
      }));

      const projectResults = projects.map(project => ({
        type: 'project',
        id: project._id,
        title: project.name,
        subtitle: project.description || 'No description',
        color: project.color,
        icon: project.icon,
      }));

      // Find matching labels
      const allLabels = Array.from(new Set(
        Array.from(getTasks()).flatMap(task => task.labels)
      ));
      const labelResults = allLabels
        .filter(label => label.toLowerCase().includes(query.toLowerCase()))
        .map(label => ({
          type: 'label',
          id: label,
          title: `#${label}`,
          subtitle: `Search tasks with label "${label}"`,
          color: '#9B59B6',
          icon: '🏷️',
        }));

      setResults([...taskResults, ...projectResults, ...labelResults]);
    };

    const debounceTimer = setTimeout(searchTasks, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleResultPress = (result: any) => {
    if (result.type === 'task') {
      onTaskSelect(result.id);
    } else if (result.type === 'project') {
      onProjectSelect(result.id);
    } else if (result.type === 'label') {
      // Handle label search - could navigate to filtered view
      console.log('Search by label:', result.id);
    }
    onClose();
    setQuery('');
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        `**${part}**` : part
    ).join('');
  };

  const ResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleResultPress(item)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: 'white',
      }}
    >
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: item.color + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      }}>
        <Text style={{ fontSize: 18 }}>{item.icon}</Text>
      </View>
      
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', flex: 1 }}>
            {item.title}
          </Text>
          {item.type === 'task' && (
            <View style={{
              paddingHorizontal: 6,
              paddingVertical: 2,
              backgroundColor: item.priority === 'urgent' ? '#ff4444' : '#f0f0f0',
              borderRadius: 8,
              marginLeft: 8,
            }}>
              <Text style={{
                fontSize: 10,
                color: item.priority === 'urgent' ? 'white' : '#666',
                textTransform: 'uppercase',
              }}>
                {item.priority}
              </Text>
            </View>
          )}
          {item.completed && (
            <Text style={{ fontSize: 16, color: '#50C878', marginLeft: 8 }}>✓</Text>
          )}
        </View>
        <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }} numberOfLines={1}>
          {item.subtitle}
        </Text>
        <View style={{
          paddingHorizontal: 6,
          paddingVertical: 2,
          backgroundColor: '#f0f0f0',
          borderRadius: 8,
          alignSelf: 'flex-start',
          marginTop: 4,
        }}>
          <Text style={{ fontSize: 10, color: '#666', textTransform: 'uppercase' }}>
            {item.type}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {/* Search Header */}
        <View style={{
          backgroundColor: 'white',
          paddingTop: 50,
          paddingHorizontal: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search tasks, projects, labels..."
              style={{
                flex: 1,
                fontSize: 18,
                padding: 12,
                backgroundColor: '#f8f9fa',
                borderRadius: 8,
                marginRight: 12,
              }}
              autoFocus
            />
            <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
              <Text style={{ fontSize: 16, color: '#4A90E2', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Results */}
        {query.length >= 2 ? (
          <FlatList
            data={results}
            keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
            renderItem={({ item }) => <ResultItem item={item} />}
            ListEmptyComponent={
              <View style={{ padding: 32, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>No results found</Text>
                <Text style={{ fontSize: 14, color: '#999', marginTop: 4 }}>
                  Try different keywords
                </Text>
              </View>
            }
          />
        ) : (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginBottom: 8 }}>🔍</Text>
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
              Search across all your tasks, projects, and labels
            </Text>
            <Text style={{ fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' }}>
              Type at least 2 characters to start searching
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};