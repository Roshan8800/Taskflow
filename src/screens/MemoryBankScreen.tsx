import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { useMemoryBank } from '../hooks/useMemoryBank';
import { useTheme } from '../hooks/useTheme';
import { MemoryItem } from '../models/MemoryBank';

export const MemoryBankScreen: React.FC = () => {
  const { memories, loading, addMemory, deleteMemory, searchMemories } = useMemoryBank();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: [] as string[],
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const filteredMemories = searchQuery ? searchMemories(searchQuery) : memories;

  const handleAddMemory = async () => {
    if (!newMemory.title.trim() || !newMemory.content.trim()) {
      Alert.alert('Error', 'Title and content are required');
      return;
    }

    await addMemory(newMemory);
    setNewMemory({
      title: '',
      content: '',
      category: 'General',
      tags: [],
      priority: 'medium',
    });
    setShowAddForm(false);
  };

  const handleDeleteMemory = (id: string) => {
    Alert.alert(
      'Delete Memory',
      'Are you sure you want to delete this memory?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteMemory(id) },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFD93D';
      case 'low': return '#6BCF7F';
      default: return theme.textSecondary;
    }
  };

  const renderMemoryItem = ({ item }: { item: MemoryItem }) => (
    <View style={[styles.memoryCard, { backgroundColor: theme.surface }]}>
      <View style={styles.memoryHeader}>
        <Text style={[styles.memoryTitle, { color: theme.text }]}>{item.title}</Text>
        <View style={styles.memoryMeta}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDeleteMemory(item._id.toString())}>
            <Text style={[styles.deleteBtn, { color: '#FF6B6B' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={[styles.memoryContent, { color: theme.textSecondary }]} numberOfLines={3}>
        {item.content}
      </Text>
      
      <View style={styles.memoryFooter}>
        <Text style={[styles.category, { color: theme.primary }]}>{item.category}</Text>
        <Text style={[styles.date, { color: theme.textSecondary }]}>
          {item.updatedAt.toLocaleDateString()}
        </Text>
      </View>
      
      {item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '20' }]}>
              <Text style={[styles.tagText, { color: theme.primary }]}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading memories...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.surface, color: theme.text }]}
          placeholder="Search memories..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={() => setShowAddForm(true)}
        >
          <Text style={[styles.addBtnText, { color: theme.background }]}>+</Text>
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={[styles.addForm, { backgroundColor: theme.surface }]}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
            placeholder="Memory title..."
            placeholderTextColor={theme.textSecondary}
            value={newMemory.title}
            onChangeText={(text) => setNewMemory({ ...newMemory, title: text })}
          />
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.background, color: theme.text }]}
            placeholder="Memory content..."
            placeholderTextColor={theme.textSecondary}
            value={newMemory.content}
            onChangeText={(text) => setNewMemory({ ...newMemory, content: text })}
            multiline
            numberOfLines={4}
          />
          <View style={styles.formActions}>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              onPress={handleAddMemory}
            >
              <Text style={[styles.saveBtnText, { color: theme.background }]}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: theme.border }]}
              onPress={() => setShowAddForm(false)}
            >
              <Text style={[styles.cancelBtnText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={filteredMemories}
        renderItem={renderMemoryItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addForm: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  saveBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
  memoryCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  memoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  memoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  memoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  deleteBtn: {
    fontSize: 14,
    fontWeight: '500',
  },
  memoryContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  memoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
});