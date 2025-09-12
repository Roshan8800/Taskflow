import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTodos } from '../hooks/useTodos';
import { Todo } from '../models/Todo';

interface MultiSelectScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const MultiSelectScreen: React.FC<MultiSelectScreenProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { todos, updateTodo, deleteTodo } = useTodos();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  if (!visible) return null;

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    setSelectedIds(new Set(todos.map(todo => todo._id.toString())));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const bulkComplete = () => {
    selectedIds.forEach(id => {
      updateTodo(id, { completed: true });
    });
    clearSelection();
    Alert.alert('Success', `${selectedIds.size} tasks marked as complete`);
  };

  const bulkDelete = () => {
    Alert.alert(
      'Delete Tasks',
      `Are you sure you want to delete ${selectedIds.size} tasks?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            selectedIds.forEach(id => deleteTodo(id));
            clearSelection();
          }
        }
      ]
    );
  };

  const bulkMove = () => {
    Alert.alert('Move Tasks', 'Move to projectId feature coming soon!');
  };

  const renderTodoItem = ({ item }: { item: Todo }) => {
    const isSelected = selectedIds.has(item._id.toString());
    
    return (
      <TouchableOpacity
        style={[
          styles.todoItem,
          { backgroundColor: '#FFFFFF' },
          isSelected && { backgroundColor: '#FFFFFF' + '20', borderColor: '#CCCCCC', borderWidth: 2 }
        ]}
        onPress={() => toggleSelection(item._id.toString())}
      >
        <View style={[
          styles.checkbox,
          { borderColor: '#CCCCCC' },
          isSelected && { backgroundColor: '#FFFFFF', borderColor: '#CCCCCC' }
        ]}>
          {isSelected && <Text style={[styles.checkmark, { color: '#000000' }]}>✓</Text>}
        </View>
        <View style={styles.todoContent}>
          <Text style={[styles.todoTitle, { color: '#000000' }]}>{item.title}</Text>
          {item.projectId && (
            <Text style={[styles.todoProject, { color: '#000000' }]}>{item.projectId}</Text>
          )}
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority.charAt(0).toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFD93D';
      case 'low': return '#6BCF7F';
      default: return '#A0A0A0';
    }
  };

  return (
    <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#000000' }]}>Multi-Select Mode</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeBtn, { color: '#000000' }]}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectionInfo}>
          <Text style={[styles.selectionText, { color: '#000000' }]}>
            {selectedIds.size} of {todos.length} selected
          </Text>
          <View style={styles.selectionActions}>
            <TouchableOpacity onPress={selectAll}>
              <Text style={[styles.actionText, { color: '#000000' }]}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearSelection}>
              <Text style={[styles.actionText, { color: '#000000' }]}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

        {selectedIds.size > 0 && (
          <View style={[styles.actionBar, { backgroundColor: '#FFFFFF' }]}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#6BCF7F' }]}
              onPress={bulkComplete}
            >
              <Text style={styles.actionBtnText}>Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#FFFFFF' }]}
              onPress={bulkMove}
            >
              <Text style={styles.actionBtnText}>Move</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#FF6B6B' }]}
              onPress={bulkDelete}
            >
              <Text style={styles.actionBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return '#FF6B6B';
    case 'medium': return '#FFD93D';
    case 'low': return '#6BCF7F';
    default: return '#A0A0A0';
  }
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  container: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeBtn: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  selectionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectionActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  todoProject: {
    fontSize: 14,
  },
  priorityBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MultiSelectScreen;