import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Todo } from '../models/Todo';
import { SwipeableTodoItem } from './SwipeableTodoItem';
import { BSON } from 'realm';

interface KanbanBoardProps {
  todos: Todo[];
  onToggle: (id: BSON.ObjectId) => void;
  onDelete: (id: BSON.ObjectId) => void;
  onLongPress: (id: BSON.ObjectId) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  todos,
  onToggle,
  onDelete,
  onLongPress,
}) => {
  const { theme } = useTheme();

  const todoTasks = todos.filter(todo => todo.status === 'todo');
  const inProgressTasks = todos.filter(todo => todo.status === 'inprogress');
  const doneTasks = todos.filter(todo => todo.status === 'done' || todo.completed);

  const renderColumn = (title: string, tasks: Todo[], color: string) => (
    <View style={[styles.column]}>
      <View style={[styles.columnHeader, { backgroundColor: color }]}>
        <Text style={styles.columnTitle}>{title}</Text>
        <Text style={styles.columnCount}>{tasks.length}</Text>
      </View>
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <SwipeableTodoItem
            id={item._id}
            title={item.title}
            completed={item.completed}
            priority={item.priority}
            status={item.status}
            onToggle={onToggle}
            onDelete={onDelete}
            onLongPress={onLongPress}
          />
        )}
        style={styles.columnList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  return (
    <ScrollView horizontal style={[styles.container]} showsHorizontalScrollIndicator={false}>
      {renderColumn('To-Do', todoTasks, theme.error)}
      {renderColumn('In Progress', inProgressTasks, theme.warning)}
      {renderColumn('Done', doneTasks, theme.success)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  column: {
    width: 280,
    marginHorizontal: 8,
    backgroundColor: '#000000',
    borderRadius: 12,
    marginVertical: 8,
    ,
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  columnCount: {
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  columnList: {
    flex: 1,
    padding: 8,
  },
});

export default KanbanBoard;