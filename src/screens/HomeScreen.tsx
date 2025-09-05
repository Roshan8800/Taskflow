import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useTodos } from '../hooks/useTodos';
import { useStats } from '../hooks/useStats';
import { ProgressBar } from '../components/ProgressBar';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { getTodayTasks, getOverdueTasks, getCompletedTasks } = useTodos();
  const { stats } = useStats();
  const navigation = useNavigation();

  const todayTasks = getTodayTasks();
  const overdueTasks = getOverdueTasks();
  const completedTasks = getCompletedTasks();
  const streak = stats?.currentStreak || 0;

  const handleQuickAdd = () => {
    navigation.navigate('NewTask' as never);
  };

  const handleTaskTap = (taskId: string) => {
    navigation.navigate('TaskDetail' as never, { taskId } as never);
  };

  return (
    <ScrollView style={styles.container(theme)}>
      <View style={styles.greeting}>
        <Text style={styles.welcomeText(theme)}>Good morning,</Text>
        <Text style={styles.userName(theme)}>{user?.username}!</Text>
        <Text style={styles.focusText(theme)}>Let's make today productive</Text>
      </View>

      <TouchableOpacity style={styles.quickAddButton(theme)} onPress={handleQuickAdd}>
        <Text style={styles.quickAddIcon}>+</Text>
        <Text style={styles.quickAddText}>Quick Add Task</Text>
      </TouchableOpacity>

      <View style={styles.summaryCards}>
        <View style={styles.cardRow}>
          <View style={[styles.summaryCard(theme), styles.cardHalf]}>
            <Text style={styles.cardNumber(theme)}>{todayTasks.length}</Text>
            <Text style={styles.cardLabel(theme)}>Due Today</Text>
          </View>
          <View style={[styles.summaryCard(theme), styles.cardHalf]}>
            <Text style={[styles.cardNumber(theme), { color: theme.colors.error }]}>{overdueTasks.length}</Text>
            <Text style={styles.cardLabel(theme)}>Overdue</Text>
          </View>
        </View>
        
        <View style={styles.summaryCard(theme)}>
          <Text style={[styles.cardNumber(theme), { color: theme.colors.success }]}>{completedTasks.length}</Text>
          <Text style={styles.cardLabel(theme)}>Completed Tasks</Text>
        </View>
      </View>

      <View style={styles.streakCard(theme)}>
        <Text style={styles.streakTitle(theme)}>Productivity Streak</Text>
        <Text style={styles.streakDays(theme)}>{streak} days</Text>
        <ProgressBar progress={Math.min(streak / 7, 1)} />
        <Text style={styles.streakText(theme)}>Keep it up! 🔥</Text>
      </View>

      <View style={styles.focusSection(theme)}>
        <Text style={styles.sectionTitle(theme)}>Today's Focus</Text>
        {todayTasks.slice(0, 3).map(task => (
          <TouchableOpacity 
            key={task._id.toString()} 
            style={styles.focusTask(theme)}
            onPress={() => handleTaskTap(task._id.toString())}
          >
            <Text style={styles.taskIcon}>{task.completed ? '✅' : '⏳'}</Text>
            <Text style={styles.taskTitle(theme)}>{task.title}</Text>
          </TouchableOpacity>
        ))}
        {todayTasks.length === 0 && (
          <Text style={styles.emptyText(theme)}>No tasks for today. Add one above!</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: (theme: any) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
  greeting: {
    padding: 20,
    paddingBottom: 16,
  },
  welcomeText: (theme: any) => ({
    fontSize: 18,
    color: theme.colors.textSecondary,
  }),
  userName: (theme: any) => ({
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  }),
  focusText: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.textMuted,
  }),
  quickAddButton: (theme: any) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    ...theme.shadows.md,
  }),
  quickAddIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    marginRight: 12,
    fontWeight: '600',
  },
  quickAddText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  summaryCards: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...theme.shadows.sm,
  }),
  cardHalf: {
    flex: 1,
  },
  cardNumber: (theme: any) => ({
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary,
  }),
  cardLabel: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  }),
  streakCard: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...theme.shadows.sm,
  }),
  streakTitle: (theme: any) => ({
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  }),
  streakDays: (theme: any) => ({
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 12,
  }),
  streakText: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  }),
  focusSection: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...theme.shadows.sm,
  }),
  sectionTitle: (theme: any) => ({
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  }),
  focusTask: (theme: any) => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  }),
  taskIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  taskTitle: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  }),
  emptyText: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  }),
});