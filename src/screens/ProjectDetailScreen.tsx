import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTodos } from '../hooks/useTodos';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SwipeableTodoItem } from '../components/SwipeableTodoItem';
import { KanbanBoard } from '../components/KanbanBoard';
import { ProgressBar } from '../components/ProgressBar';

export const ProjectDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { todos, toggleTodo, deleteTodo, updateTodoStatus } = useTodos();
  const route = useRoute();
  const navigation = useNavigation();
  const [isKanban, setIsKanban] = useState(false);
  
  const { projectId, projectName } = route.params as { projectId: string; projectName: string };
  
  const projectTasks = projectId === 'unassigned' 
    ? todos.filter(todo => !todo.projectId)
    : todos.filter(todo => todo.projectId?.toString() === projectId);

  const completedCount = projectTasks.filter(todo => todo.completed).length;
  const totalCount = projectTasks.length;

  const handleLongPress = (id: any) => {
    Alert.alert(
      'Move Task',
      'Change task status:',
      [
        { text: 'To-Do', onPress: () => updateTodoStatus(id, 'todo') },
        { text: 'In Progress', onPress: () => updateTodoStatus(id, 'inprogress') },
        { text: 'Done', onPress: () => updateTodoStatus(id, 'done') },
        { text: 'Cancel', style: 'cancel' }]
    );
  };

  const handleAddTask = () => {
    navigation.navigate('NewTask' as never, { projectId } as never);
  };

  const renderTodo = ({ item }: { item: any }) => {
    return (
      <SwipeableTodoItem
        id={item._id}
        title={item.title}
        completed={item.completed}
        priority={item.priority}
        status={item.status}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onLongPress={handleLongPress}
      />
    );
  };

  return (
    <View style={[styles.container]}>
      {}
      <View style={[styles.header]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title]}>{projectName}</Text>
            <Text style={[styles.subtitle]}>{totalCount} tasks</Text>
          </View>
          <TouchableOpacity
            style={[styles.toggleButton]}
            onPress={() => setIsKanban(!isKanban)}
          >
            <Text style={styles.toggleIcon}>{isKanban ? '📋' : '📊'}</Text>
          </TouchableOpacity>
        </View>

        {totalCount > 0 && (
          <View style={styles.progressSection}>
            <Text style={[styles.progressText]}>
              {completedCount} of {totalCount} completed
            </Text>
            <ProgressBar progress={completedCount / totalCount} />
          </View>
        )}
      </View>

      {}
      {isKanban ? (
        <KanbanBoard
          todos={projectTasks}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onLongPress={handleLongPress}
        />
      ) : (
        <FlatList
          data={projectTasks}
          renderItem={renderTodo}
          keyExtractor={(item) => item._id.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={projectTasks.length === 0 ? styles.emptyList : undefined}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={[styles.emptyTitle]}>No tasks in this projectId</Text>
              <Text style={[styles.emptyText]}>Add your first task to get started</Text>
            </View>
          }
        />
      )}

      {}
      <TouchableOpacity style={[styles.fab]} onPress={handleAddTask}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      
      {}
      <TouchableOpacity 
        style={[styles.settingsFab]} 
        onPress={() => navigation.navigate('ProjectSettings' as never, { projectId: { _id: projectId, name: projectName } } as never)}
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: '#000000',
    padding: 20,
    ,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    marginTop: 4,
  },
  toggleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIcon: {
    fontSize: 20,
  },
  progressSection: {
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
  list: {
    flex: 1,
    paddingTop: 8,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: '#000000',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    .lg,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  settingsFab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 48,
    height: 48,
    backgroundColor: '#000000',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ,
  },
  settingsIcon: {
    fontSize: 20,
  },
});

export default ProjectDetailScreen;