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
        { text: 'Cancel', style: 'cancel' },
      ]
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
    <SafeAreaView style={styles.container(theme)}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      
      <Animated.View style={[styles.header(theme), { opacity: fadeAnim }]}>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.title(theme)}>Tasks</Text>
              <Text style={styles.subtitle(theme)}>{totalCount} tasks</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.toggleButton(theme)}
                onPress={() => setIsKanban(!isKanban)}
              >
                <Text style={styles.toggleIcon}>{isKanban ? '📋' : '📊'}</Text>
              </TouchableOpacity>
              <ThemeToggle />
            </View>
          </View>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput(theme)}
              placeholder="Search tasks..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View style={styles.filterButtons}>
              {['all', 'high', 'medium', 'low'].map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.filterButton(theme),
                    filterPriority === priority && styles.activeFilter(theme)
                  ]}
                  onPress={() => setFilterPriority(priority)}
                >
                  <Text style={styles.filterText(theme)}>
                    {priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        {totalCount > 0 && (
          <View style={styles.statsContainer(theme)}>
            <View style={styles.progressSection}>
              <Text style={styles.progressText(theme)}>
                {completedCount} of {totalCount} completed
              </Text>
              <ProgressBar progress={completedCount / totalCount} />
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber(theme)}>{totalCount - completedCount}</Text>
                <Text style={styles.statLabel(theme)}>Active</Text>
              </View>
              <View style={styles.statDivider(theme)} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber(theme)}>{completedCount}</Text>
                <Text style={styles.statLabel(theme)}>Done</Text>
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
              <Text style={styles.emptyTitle(theme)}>No tasks found</Text>
              <Text style={styles.emptyText(theme)}>Try adjusting your search or filters</Text>
            </Animated.View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: (theme: any) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
  header: (theme: any) => ({
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...theme.shadows.md,
  }),
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
  searchContainer: {
    gap: 12,
  },
  searchInput: (theme: any) => ({
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
  }),
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: (theme: any) => ({
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceSecondary,
  }),
  activeFilter: (theme: any) => ({
    backgroundColor: theme.colors.primary,
  }),
  filterText: (theme: any) => ({
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: '500',
  }),

  title: (theme: any) => ({
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  }),
  subtitle: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  }),
  statsContainer: (theme: any) => ({
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  }),
  progressSection: {
    marginBottom: theme.spacing.md,
  },
  progressText: (theme: any) => ({
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  }),
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: (theme: any) => ({
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
  }),
  statLabel: (theme: any) => ({
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }),
  statDivider: (theme: any) => ({
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border,
    marginHorizontal: 16,
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
});