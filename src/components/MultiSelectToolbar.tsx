import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Todo } from '../models/Todo';

interface Props {
  selectedCount: number;
  tasks: Todo[];
  selectedTasks: string[];
  onComplete: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onMove: () => void;
  onClear: () => void;
  getAvailableActions: (tasks: Todo[]) => any;
}

export const MultiSelectToolbar: React.FC<Props> = ({
  selectedCount,
  tasks,
  selectedTasks,
  onComplete,
  onDelete,
  onArchive,
  onUnarchive,
  onMove,
  onClear,
  getAvailableActions
}) => {
  const { theme } = useTheme();
  const actions = getAvailableActions(tasks);

  if (selectedCount === 0) return null;

  return (
    <View style={[styles.toolbar, { backgroundColor: '#FFFFFF', borderColor: '#CCCCCC' }]}>
      <Text style={[styles.count, { color: '#000000' }]}>
        {selectedCount} selected
      </Text>
      
      <View style={styles.actions}>
        {actions.needsUnarchive && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FFFFFF' }]}
            onPress={onUnarchive}
          >
            <Text style={styles.actionText}>Unarchive First</Text>
          </TouchableOpacity>
        )}
        
        {actions.canComplete && !actions.needsUnarchive && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FFFFFF' }]}
            onPress={onComplete}
          >
            <Text style={styles.actionText}>Complete</Text>
          </TouchableOpacity>
        )}
        
        {actions.canArchive && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FFFFFF' }]}
            onPress={onArchive}
          >
            <Text style={styles.actionText}>Archive</Text>
          </TouchableOpacity>
        )}
        
        {actions.canMove && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FFFFFF' }]}
            onPress={onMove}
          >
            <Text style={styles.actionText}>Move</Text>
          </TouchableOpacity>
        )}
        
        {actions.canDelete && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FFFFFF' }]}
            onPress={onDelete}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#FFFFFF' }]}
          onPress={onClear}
        >
          <Text style={styles.actionText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  count: {
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MultiSelectToolbar;