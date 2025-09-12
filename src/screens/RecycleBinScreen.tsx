import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTaskManager } from '../hooks/useTaskManager';
import { useTheme } from '../hooks/useTheme';
import { Todo } from '../models/Todo';

export const RecycleBinScreen: React.FC = () => {
  const { getDeletedTasksSync, recoverTask, deleteTask } = useTaskManager();
  const { theme } = useTheme();
  const deletedTasks = getDeletedTasksSync();

  const handleRecover = (taskId: string) => {
    Alert.alert(
      'Recover Task',
      'Are you sure you want to recover this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Recover', onPress: () => recoverTask(taskId) }
      ]
    );
  };

  const handlePermanentDelete = (taskId: string) => {
    Alert.alert(
      'Permanent Delete',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(taskId, true) }
      ]
    );
  };

  const renderTask = ({ item }: { item: Todo }) => (
    <View style={[styles.taskItem, { backgroundColor: '#FFFFFF', borderColor: '#CCCCCC' }]}>
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, { color: '#000000' }]}>{item.title}</Text>
        <Text style={[styles.deletedDate, { color: '#000000' }]}>
          Deleted: {item.deletedAt?.toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FFFFFF' }]}
          onPress={() => handleRecover(item._id.toString())}
        >
          <Text style={styles.actionText}>Recover</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FFFFFF' }]}
          onPress={() => handlePermanentDelete(item._id.toString())}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, { color: '#000000' }]}>Recycle Bin</Text>
      
      {deletedTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: '#000000' }]}>
            No deleted tasks
          </Text>
        </View>
      ) : (
        <FlatList
          data={deletedTasks}
          renderItem={renderTask}
          keyExtractor={item => item._id.toString()}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  list: { flex: 1 },
  taskItem: { padding: 16, marginBottom: 8, borderRadius: 8, borderWidth: 1 },
  taskContent: { flex: 1, marginBottom: 12 },
  taskTitle: { fontSize: 16, fontWeight: '600' },
  deletedDate: { fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8 },
  actionButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  actionText: { color: 'white', fontSize: 14, fontWeight: '600' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16 }
});

export default RecycleBinScreen;