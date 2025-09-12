import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTodos } from '../hooks/useTodos';
import { useProjects } from '../hooks/useProjects';

interface SearchResult {
  id: string;
  type: 'task' | 'projectId' | 'label';
  title: string;
  subtitle?: string;
  color?: string;
}

export const GlobalSearchScreen: React.FC = () => {
  const { theme } = useTheme();
  const { todos } = useTodos();
  const { projects } = useProjects();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filter, setFilter] = useState<'all' | 'tasks' | 'projects' | 'labels'>('all');

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search tasks
    if (filter === 'all' || filter === 'tasks') {
      todos.forEach(todo => {
        if (todo.title.toLowerCase().includes(lowerQuery) || 
            todo.description?.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            id: todo._id.toString(),
            type: 'task',
            title: todo.title,
            subtitle: todo.projectId || 'No projectId',
          });
        }
      });
    }

    // Search projects
    if (filter === 'all' || filter === 'projects') {
      projects.forEach(projectId => {
        if (projectId.name.toLowerCase().includes(lowerQuery) || 
            projectId.description?.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            id: projectId._id.toString(),
            type: 'projectId',
            title: projectId.name,
            subtitle: projectId.description,
            color: projectId.color,
          });
        }
      });
    }

    // Search labels
    if (filter === 'all' || filter === 'labels') {
      const labels = ['Work', 'Personal', 'Urgent', 'Learning'];
      labels.forEach(label => {
        if (label.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            id: label,
            type: 'label',
            title: label,
            subtitle: 'Label',
          });
        }
      });
    }

    setResults(searchResults);
  }, [query, filter, todos, projects]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return '✓';
      case 'projectId': return '📁';
      case 'label': return '🏷️';
      default: return '•';
    }
  };

  const renderResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity style={[styles.resultItem, { backgroundColor: '#FFFFFF' }]}>
      <View style={styles.resultIcon}>
        <Text style={styles.iconText}>{getTypeIcon(item.type)}</Text>
      </View>
      <View style={styles.resultContent}>
        <Text style={[styles.resultTitle, { color: '#000000' }]}>{item.title}</Text>
        {item.subtitle && (
          <Text style={[styles.resultSubtitle, { color: '#000000' }]}>
            {item.subtitle}
          </Text>
        )}
      </View>
      <View style={[styles.typeBadge, { backgroundColor: '#FFFFFF' + '20' }]}>
        <Text style={[styles.typeText, { color: '#000000' }]}>
          {item.type.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <TextInput
        style={[styles.searchInput, { backgroundColor: '#FFFFFF', color: '#000000' }]}
        placeholder="Search tasks, projects, labelsall', 'tasks', 'projects', 'labels'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterBtn,
              { backgroundColor: filter === f ? theme.primary : theme.surface }
            ]}
            onPress={() => setFilter(f as any)}
          >
            <Text style={[
              styles.filterText,
              { color: filter === f ? theme.background : theme.text }
            ]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={results}
        renderItem={renderResult}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={styles.results}
        showsVerticalScrollIndicator={false}
      />

      {query.length >= 2 && results.length === 0 && (
        <View style={styles.noResults}>
          <Text style={[styles.noResultsText, { color: '#000000' }]}>
            No results found for "{query}"
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  results: {
    paddingBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: 14,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
  },
});

export default GlobalSearchScreen;