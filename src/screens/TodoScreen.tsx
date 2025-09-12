import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useTodos } from '../hooks/useTodos';
import { SwipeableTodoItem } from '../components/SwipeableTodoItem';
import { KanbanBoard } from '../components/KanbanBoard';
import { AddTodoForm } from '../components/AddTodoForm';
import { ProgressBar } from '../components/ProgressBar';
import { ThemeToggle } from '../components/ThemeToggle';
import { Todo } from '../models/Todo';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

export const TodoScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodoStatus } = useTodos();
  const [isKanban, setIsKanban] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const renderTodo = ({ item }: { item: Todo }) => {
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

  const completedCount = filteredTodos.filter(todo => todo.completed).length;
  const totalCount = filteredTodos.length;

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <View>
              <Text style={[styles.title]}>Tasks</Text>
              <Text style={[styles.subtitle]}>{totalCount} tasks</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={[styles.toggleButton]}
                onPress={() => setIsKanban(!isKanban)}
              >
                <Text style={styles.toggleIcon}>{isKanban ? '📋' : '📊'}</Text>
              </TouchableOpacity>
              <ThemeToggle />
            </View>
          </View>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput]}
              placeholder="Search tasksall', 'high', 'medium', 'low'].map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.filterButton,
                    filterPriority === priority && styles.activeFilter
                  ]}
                  onPress={() => setFilterPriority(priority)}
                >
                  <Text style={[styles.filterText]}>
                    {priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        {totalCount > 0 && (
          <View style={[styles.statsContainer]}>
            <View style={styles.progressSection}>
              <Text style={[styles.progressText]}>
                {completedCount} of {totalCount} completed
              </Text>
              <ProgressBar progress={completedCount / totalCount} />
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber]}>{totalCount - completedCount}</Text>
                <Text style={[styles.statLabel]}>Active</Text>
              </View>
              <View style={[styles.statDivider]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber]}>{completedCount}</Text>
                <Text style={[styles.statLabel]}>Done</Text>
              </View>
            </View>
          </View>
        )}
      </Animated.View>

      <AddTodoForm onAdd={addTodo} />

      {isKanban ? (
        <KanbanBoard
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onLongPress={handleLongPress}
        />
      ) : (
        <FlatList
          data={filteredTodos}
          renderItem={renderTodo}
          keyExtractor={(item) => item._id.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={filteredTodos.length === 0 ? styles.emptyList : undefined}
          ListEmptyComponent={
            <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={[styles.emptyTitle]}>No tasks found</Text>
              <Text style={[styles.emptyText]}>Try adjusting your search or filters</Text>
            </Animated.View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#000000',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ,
  },
  headerContent: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  searchContainer: {
    gap: 12,
  },
  searchInput: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#000000',
  },
  activeFilter: {
    backgroundColor: '#000000',
  },
  filterText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    marginTop: 4,
  },
  statsContainer: {
    backgroundColor: '#000000',
    borderRadius: '#000000'.lg,
    padding: '#000000'.lg,
  },
  progressSection: {
    marginBottom: '',
  },
  progressText: {
    .caption,
    color: '#000000',
    marginBottom: '',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  statLabel: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#000000',
    marginHorizontal: 16,
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
});

export default TodoScreen;