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
        { text: 'Cancel', style: 'cancel' },
      ]
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
    <View style={styles.container(theme)}>
      {/* Header */}
      <View style={styles.header(theme)}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title(theme)}>{projectName}</Text>
            <Text style={styles.subtitle(theme)}>{totalCount} tasks</Text>
          </View>
          <TouchableOpacity
            style={styles.toggleButton(theme)}
            onPress={() => setIsKanban(!isKanban)}
          >
            <Text style={styles.toggleIcon}>{isKanban ? '📋' : '📊'}</Text>
          </TouchableOpacity>
        </View>

        {totalCount > 0 && (
          <View style={styles.progressSection}>
            <Text style={styles.progressText(theme)}>
              {completedCount} of {totalCount} completed
            </Text>
            <ProgressBar progress={completedCount / totalCount} />
          </View>
        )}
      </View>

      {/* Tasks View */}
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
              <Text style={styles.emptyTitle(theme)}>No tasks in this project</Text>
              <Text style={styles.emptyText(theme)}>Add your first task to get started</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab(theme)} onPress={handleAddTask}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      
      {/* Settings FAB */}
      <TouchableOpacity 
        style={styles.settingsFab(theme)} 
        onPress={() => navigation.navigate('ProjectSettings' as never, { project: { _id: projectId, name: projectName } } as never)}
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: (theme: any) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
  header: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    padding: 20,
    ...theme.shadows.sm,
  }),
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: (theme: any) => ({
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  }),
  subtitle: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 4,
  }),
  toggleButton: (theme: any) => ({
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  toggleIcon: {
    fontSize: 20,
  },
  progressSection: {
    gap: 8,
  },
  progressText: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  }),
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
  emptyTitle: (theme: any) => ({
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  }),
  emptyText: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  }),
  fab: (theme: any) => ({
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  }),
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  settingsFab: (theme: any) => ({
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 48,
    height: 48,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  }),
  settingsIcon: {
    fontSize: 20,
  },
});