import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Todo } from '../models/Todo';

interface ChecklistViewProps {
  tasks: Todo[];
  onTaskToggle: (task: Todo) => void;
  onTaskEdit: (task: Todo) => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({ tasks, onTaskToggle, onTaskEdit }) => {
  const pendingTasks = tasks.filter(t => !t.completed && !t.deletedAt !== null);
  const completedTasks = tasks.filter(t => t.completed && !t.deletedAt !== null);
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  const ChecklistItem = ({ task }: { task: Todo }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: 'white',
      marginVertical: 1,
    }}>
      <TouchableOpacity
        onPress={() => onTaskToggle(task)}
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: task.color,
          backgroundColor: task.completed ? task.color : 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}
      >
        {task.completed && <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>✓</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onTaskEdit(task)} style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          textDecorationLine: task.completed ? 'line-through' : 'none',
          color: task.completed ? '#999' : '#333',
          opacity: task.completed ? 0.6 : 1,
        }}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={{
            fontSize: 14,
            color: '#666',
            marginTop: 2,
            textDecorationLine: task.completed ? 'line-through' : 'none',
            opacity: task.completed ? 0.6 : 1,
          }} numberOfLines={1}>
            {task.description}
          </Text>
        )}
      </TouchableOpacity>

      {task.priority === 'urgent' && (
        <View style={{
          backgroundColor: '#ff4444',
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 8,
          marginLeft: 8,
        }}>
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>!</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {}
      <View style={{ backgroundColor: 'white', padding: 20, marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Daily Checklist</Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A90E2' }}>
            {Math.round(completionRate)}%
          </Text>
        </View>
        
        <View style={{ height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, marginBottom: 8 }}>
          <View style={{
            height: 8,
            backgroundColor: '#4A90E2',
            borderRadius: 4,
            width: `${completionRate}%`,
          }} />
        </View>
        
        <Text style={{ fontSize: 14, color: '#666' }}>
          {completedTasks.length} of {tasks.length} tasks completed
        </Text>
      </View>

      {}
      {pendingTasks.length > 0 && (
        <View style={{ backgroundColor: 'white', marginBottom: 8 }}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
              To Do ({pendingTasks.length})
            </Text>
          </View>
          <FlatList
            data={pendingTasks}
            keyExtractor={item => item._id.toString()}
            renderItem={({ item }) => <ChecklistItem task={item} />}
            scrollEnabled={false}
          />
        </View>
      )}

      {}
      {completedTasks.length > 0 && (
        <View style={{ backgroundColor: 'white' }}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#50C878' }}>
              Completed ({completedTasks.length})
            </Text>
          </View>
          <FlatList
            data={completedTasks}
            keyExtractor={item => item._id.toString()}
            renderItem={({ item }) => <ChecklistItem task={item} />}
            scrollEnabled={false}
          />
        </View>
      )}

      {tasks.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: '#666', marginBottom: 8 }}>No tasks yet</Text>
          <Text style={{ fontSize: 14, color: '#999' }}>Add some tasks to get started</Text>
        </View>
      )}
    </View>
  );
};

export default ChecklistView;