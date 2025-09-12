import React from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Todo } from '../models/Todo';

interface KanbanViewProps {
  tasks: Todo[];
  onTaskToggle: (task: Todo) => void;
  onTaskEdit: (task: Todo) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({ tasks, onTaskToggle, onTaskEdit }) => {
  const columns = [
    { key: 'todo', title: 'To Do', filter: (t: Todo) => !t.completed && !t.snoozeUntil },
    { key: 'snoozed', title: 'Snoozed', filter: (t: Todo) => !t.completed && !!t.snoozeUntil },
    { key: 'completed', title: 'Completed', filter: (t: Todo) => t.completed }];

  const KanbanCard = ({ task }: { task: Todo }) => (
    <TouchableOpacity
      onPress={() => onTaskEdit(task)}
      style={{
        backgroundColor: 'white',
        margin: 4,
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: task.color,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 4 }}>{task.title}</Text>
      {task.description && (
        <Text style={{ fontSize: 12, color: '#666', marginBottom: 8 }} numberOfLines={2}>
          {task.description}
        </Text>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{
          paddingHorizontal: 6,
          paddingVertical: 2,
          backgroundColor: task.priority === 'urgent' ? '#ff4444' : task.priority === 'high' ? '#ff8800' : '#4A90E2',
          borderRadius: 8,
        }}>
          <Text style={{ fontSize: 10, color: 'white', textTransform: 'uppercase' }}>{task.priority}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onTaskToggle(task)}
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: task.color,
            backgroundColor: task.completed ? task.color : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {task.completed && <Text style={{ color: 'white', fontSize: 12 }}>✓</Text>}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 8 }}>
        {columns.map(column => {
          const columnTasks = tasks.filter(column.filter);
          return (
            <View key={column.key} style={{ width: 280, marginHorizontal: 4 }}>
              <View style={{
                backgroundColor: '#f8f9fa',
                padding: 12,
                borderRadius: 8,
                marginBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{column.title}</Text>
                <View style={{
                  backgroundColor: '#4A90E2',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                    {columnTasks.length}
                  </Text>
                </View>
              </View>
              <FlatList
                data={columnTasks}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item }) => <KanbanCard task={item} />}
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 600 }}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default KanbanView;