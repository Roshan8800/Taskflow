import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTaskManager } from '../hooks/useTaskManager';
import { useTheme } from '../hooks/useTheme';
import { getTodayTasks } from '../utils/smartSort';
import { scheduleNotification } from '../utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DailyUseWorkflow = () => {
  const { getActiveTasks, addTask, toggleTask } = useTaskManager();
  const { theme } = useTheme();
  const allTasks = getActiveTasks();
  const todayTasks = getTodayTasks(allTasks);

  const quickAdd = async (title: string, dueTime?: Date) => {
    const taskData = {
      title,
      priority: 'medium' as const,
      dueDate: dueTime || new Date()
    };

    await addTask(taskData);

    // Schedule reminder if due time set
    if (dueTime) {
      await scheduleNotification({
        id: `task_${Date.now()}`,
        title: 'Task Reminder',
        body: title,
        scheduledTime: dueTime
      });
    }
  };

  const completeTask = async (taskId: string) => {
    await toggleTask(taskId);
    await updateStreak();
    await checkAchievements();
  };

  const updateStreak = async () => {
    const today = new Date().toDateString();
    const lastStreakDate = await AsyncStorage.getItem('lastStreakDate');
    const currentStreak = parseInt(await AsyncStorage.getItem('currentStreak') || '0');

    if (lastStreakDate !== today) {
      const newStreak = currentStreak + 1;
      await AsyncStorage.setItem('currentStreak', newStreak.toString());
      await AsyncStorage.setItem('lastStreakDate', today);
    }
  };

  const checkAchievements = async () => {
    const completedCount = parseInt(await AsyncStorage.getItem('totalCompleted') || '0') + 1;
    await AsyncStorage.setItem('totalCompleted', completedCount.toString());

    // Check for achievement milestones
    if (completedCount === 10) {
      Alert.alert('Achievement Unlocked!', 'First 10 tasks completed! 🎉');
    } else if (completedCount === 50) {
      Alert.alert('Achievement Unlocked!', 'Task Master - 50 tasks completed! 🏆');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Today's Tasks</Text>
      
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.quickButton, { backgroundColor: theme.primary }]}
          onPress={() => quickAdd('Quick task')}
        >
          <Text style={styles.buttonText}>Quick Add</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.quickButton, { backgroundColor: theme.success }]}
          onPress={() => {
            const dueTime = new Date();
            dueTime.setHours(dueTime.getHours() + 1);
            quickAdd('Task with reminder', dueTime);
          }}
        >
          <Text style={styles.buttonText}>Add with Reminder</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.taskList}>
        {todayTasks.map(task => (
          <TouchableOpacity
            key={task._id.toString()}
            style={[styles.taskItem, { backgroundColor: theme.surface }]}
            onPress={() => completeTask(task._id.toString())}
          >
            <Text style={[styles.taskTitle, { color: theme.text }]}>{task.title}</Text>
            <Text style={[styles.taskTime, { color: theme.textSecondary }]}>
              {task.dueAt?.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  quickActions: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  quickButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '600' },
  taskList: { flex: 1 },
  taskItem: { padding: 16, marginBottom: 8, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between' },
  taskTitle: { fontSize: 16, fontWeight: '500' },
  taskTime: { fontSize: 14 }
});