import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { Todo } from '../models/Todo';
import { TaskItem } from './TaskItem';

interface ListViewProps {
  tasks: Todo[];
  onTaskToggle: (task: Todo) => void;
  onTaskEdit: (task: Todo) => void;
  onTaskDelete: (task: Todo) => void;
  onTaskSnooze?: (taskId: string, date: Date) => void;
  onTaskArchive?: (taskId: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({ tasks, onTaskToggle, onTaskEdit, onTaskDelete, onTaskSnooze, onTaskArchive }) => {
  const [isCompact, setIsCompact] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Tasks ({tasks.length})</Text>
        <TouchableOpacity
          onPress={() => setIsCompact(!isCompact)}
          style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f0f0f0', borderRadius: 16 }}
        >
          <Text style={{ fontSize: 12, color: '#666' }}>
            {isCompact ? 'Expanded' : 'Compact'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={(id) => onTaskToggle(item)}
            onEdit={() => onTaskEdit(item)}
            onDelete={(id) => onTaskDelete(item)}
            onSnooze={onTaskSnooze}
            onArchive={onTaskArchive}
            compact={isCompact}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ListView;