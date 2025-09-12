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
    <ScrollView style={[styles.container]}>
      <View style={styles.greeting}>
        <Text style={[styles.welcomeText]}>Good morning,</Text>
        <Text style={[styles.userName]}>{user?.username}!</Text>
        <Text style={[styles.focusText]}>Let's make today productive</Text>
      </View>

      <TouchableOpacity style={[styles.quickAddButton]} onPress={handleQuickAdd}>
        <Text style={styles.quickAddIcon}>+</Text>
        <Text style={styles.quickAddText}>Quick Add Task</Text>
      </TouchableOpacity>

      <View style={styles.summaryCards}>
        <View style={styles.cardRow}>
          <View style={[styles.summaryCard, styles.cardHalf]}>
            <Text style={[styles.cardNumber]}>{todayTasks.length}</Text>
            <Text style={[styles.cardLabel]}>Due Today</Text>
          </View>
          <View style={[styles.summaryCard, styles.cardHalf]}>
            <Text style={[styles.cardNumber, { color: '#000000' }]}>{overdueTasks.length}</Text>
            <Text style={[styles.cardLabel]}>Overdue</Text>
          </View>
        </View>
        
        <View style={[styles.summaryCard]}>
          <Text style={[styles.cardNumber, { color: '#000000' }]}>{completedTasks.length}</Text>
          <Text style={[styles.cardLabel]}>Completed Tasks</Text>
        </View>
      </View>

      <View style={[styles.streakCard]}>
        <Text style={[styles.streakTitle]}>Productivity Streak</Text>
        <Text style={[styles.streakDays]}>{streak} days</Text>
        <ProgressBar progress={Math.min(streak / 7, 1)} />
        <Text style={[styles.streakText]}>Keep it up! 🔥</Text>
      </View>

      <View style={[styles.focusSection]}>
        <Text style={[styles.sectionTitle]}>Today's Focus</Text>
        {todayTasks.slice(0, 3).map(task => (
          <TouchableOpacity 
            key={task._id.toString()} 
            style={[styles.focusTask]}
            onPress={() => handleTaskTap(task._id.toString())}
          >
            <Text style={styles.taskIcon}>{task.completed ? '✅' : '⏳'}</Text>
            <Text style={[styles.taskTitle]}>{task.title}</Text>
          </TouchableOpacity>
        ))}
        {todayTasks.length === 0 && (
          <Text style={[styles.emptyText]}>No tasks for today. Add one above!</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  greeting: {
    padding: 20,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    color: '#000000',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  focusText: {
    fontSize: 16,
    color: '#000000',
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    ,
  },
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
  summaryCard: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ,
  },
  cardHalf: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
  },
  cardLabel: {
    fontSize: 14,
    color: '#000000',
    marginTop: 4,
  },
  streakCard: {
    backgroundColor: '#000000',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  streakDays: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  streakText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    marginTop: 8,
  },
  focusSection: {
    backgroundColor: '#000000',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  focusTask: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  taskIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HomeScreen;