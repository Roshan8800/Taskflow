import { useState, useEffect, useCallback } from 'react';
import { getRealm } from '../database/db';
import { Todo } from '../models/Todo';
import { useAuth } from './useAuth';
import { handleError } from '../utils/errorHandler';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

export interface WeeklyData {
  date: string;
  completed: number;
  created: number;
}

export interface StreakData {
  current: number;
  longest: number;
  lastCompletionDate?: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  target: number;
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState<TaskStats>({ total: 0, completed: 0, pending: 0, overdue: 0, completionRate: 0 });
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [streakData, setStreakData] = useState<StreakData>({ current: 0, longest: 0 });
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTaskStats(),
        loadWeeklyData(),
        loadStreakData(),
        loadAchievements(),
      ]);
    } catch (error) {
      handleError(error, 'Loading Analytics');
    } finally {
      setLoading(false);
    }
  };

  // 31. Task completion stats
  const loadTaskStats = async () => {
    try {
      const realm = await getRealm();
      const allTasks = realm.objects<Todo>('Todo').filtered('userId == $0 AND isDeleted == false', user?.id || '');
      const completedTasks = allTasks.filtered('completed == true');
      const pendingTasks = allTasks.filtered('completed == false');
      
      const now = new Date();
      const overdueTasks = pendingTasks.filtered('dueDate != null AND dueDate < $0', now);
      
      const total = allTasks.length;
      const completed = completedTasks.length;
      const pending = pendingTasks.length;
      const overdue = overdueTasks.length;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      setTaskStats({ total, completed, pending, overdue, completionRate });
    } catch (error) {
      handleError(error, 'Loading Task Stats');
    }
  };

  // 33. Weekly productivity graph
  const loadWeeklyData = async () => {
    try {
      const realm = await getRealm();
      const weekData: WeeklyData[] = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        
        const completedCount = realm.objects<Todo>('Todo').filtered(
          'userId == $0 AND completed == true AND updatedAt >= $1 AND updatedAt <= $2',
          user?.id || '', startOfDay, endOfDay
        ).length;
        
        const createdCount = realm.objects<Todo>('Todo').filtered(
          'userId == $0 AND createdAt >= $1 AND createdAt <= $2',
          user?.id || '', startOfDay, endOfDay
        ).length;
        
        weekData.push({
          date: startOfDay.toLocaleDateString('en', { weekday: 'short' }),
          completed: completedCount,
          created: createdCount,
        });
      }
      
      setWeeklyData(weekData);
    } catch (error) {
      handleError(error, 'Loading Weekly Data');
    }
  };

  // 34. Streak tracking
  const loadStreakData = async () => {
    try {
      const realm = await getRealm();
      const completedTasks = realm.objects<Todo>('Todo')
        .filtered('userId == $0 AND completed == true', user?.id || '')
        .sorted('updatedAt', true);
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      let lastDate: Date | null = null;
      let lastCompletionDate: Date | undefined;
      
      const tasksByDate = new Map<string, number>();
      
      Array.from(completedTasks).forEach(task => {
        const dateKey = task.updatedAt.toDateString();
        tasksByDate.set(dateKey, (tasksByDate.get(dateKey) || 0) + 1);
        if (!lastCompletionDate) lastCompletionDate = task.updatedAt;
      });
      
      const sortedDates = Array.from(tasksByDate.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      for (let i = 0; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]);
        
        if (!lastDate) {
          tempStreak = 1;
          if (i === 0) currentStreak = 1;
        } else {
          const dayDiff = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (dayDiff === 1) {
            tempStreak++;
            if (i === 0 || (i === 1 && dayDiff === 1)) currentStreak = tempStreak;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
            if (i === 0) currentStreak = 1;
          }
        }
        
        lastDate = currentDate;
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
      
      // Check if current streak is still valid (completed task today or yesterday)
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastCompletionDate) {
        const lastCompletionDateStr = lastCompletionDate.toDateString();
        const todayStr = today.toDateString();
        const yesterdayStr = yesterday.toDateString();
        
        if (lastCompletionDateStr !== todayStr && lastCompletionDateStr !== yesterdayStr) {
          currentStreak = 0;
        }
      }
      
      setStreakData({ current: currentStreak, longest: longestStreak, lastCompletionDate });
    } catch (error) {
      handleError(error, 'Loading Streak Data');
    }
  };

  // 35. Achievements & badges
  const loadAchievements = async () => {
    try {
      const realm = await getRealm();
      const allTasks = realm.objects<Todo>('Todo').filtered('userId == $0', user?.id || '');
      const completedTasks = allTasks.filtered('completed == true');
      
      const achievementList: Achievement[] = [
        {
          id: 'first_task',
          title: 'Getting Started',
          description: 'Complete your first task',
          icon: '🎯',
          unlocked: completedTasks.length >= 1,
          progress: Math.min(completedTasks.length, 1),
          target: 1,
        },
        {
          id: 'task_master',
          title: 'Task Master',
          description: 'Complete 10 tasks',
          icon: '🏆',
          unlocked: completedTasks.length >= 10,
          progress: Math.min(completedTasks.length, 10),
          target: 10,
        },
        {
          id: 'productivity_king',
          title: 'Productivity King',
          description: 'Complete 50 tasks',
          icon: '👑',
          unlocked: completedTasks.length >= 50,
          progress: Math.min(completedTasks.length, 50),
          target: 50,
        },
        {
          id: 'streak_starter',
          title: 'Streak Starter',
          description: 'Maintain a 3-day streak',
          icon: '🔥',
          unlocked: streakData.longest >= 3,
          progress: Math.min(streakData.longest, 3),
          target: 3,
        },
        {
          id: 'streak_master',
          title: 'Streak Master',
          description: 'Maintain a 7-day streak',
          icon: '⚡',
          unlocked: streakData.longest >= 7,
          progress: Math.min(streakData.longest, 7),
          target: 7,
        },
        {
          id: 'organizer',
          title: 'Organizer',
          description: 'Create 5 projects',
          icon: '📁',
          unlocked: false, // Would need project count
          progress: 0,
          target: 5,
        },
      ];
      
      setAchievements(achievementList);
    } catch (error) {
      handleError(error, 'Loading Achievements');
    }
  };

  // 32. Overdue task count (already included in taskStats)
  const getOverdueCount = useCallback(() => taskStats.overdue, [taskStats]);

  // 36. Export custom reports
  const exportReport = useCallback(async (type: 'csv' | 'json' = 'json') => {
    try {
      const realm = await getRealm();
      const tasks = realm.objects<Todo>('Todo').filtered('userId == $0', user?.id || '');
      
      const reportData = {
        generatedAt: new Date().toISOString(),
        user: user?.email || 'Unknown',
        summary: taskStats,
        weeklyProductivity: weeklyData,
        streak: streakData,
        achievements: achievements.filter(a => a.unlocked),
        tasks: Array.from(tasks).map(task => ({
          id: task._id.toString(),
          title: task.title,
          completed: task.completed,
          priority: task.priority,
          createdAt: task.createdAt.toISOString(),
          completedAt: task.completed ? task.updatedAt.toISOString() : null,
          dueDate: task.dueDate?.toISOString() || null,
          project: task.project,
          labels: task.labels,
        })),
      };
      
      if (type === 'csv') {
        return convertToCSV(reportData.tasks);
      }
      
      return JSON.stringify(reportData, null, 2);
    } catch (error) {
      handleError(error, 'Exporting Report');
      return null;
    }
  }, [taskStats, weeklyData, streakData, achievements, user]);

  const convertToCSV = (tasks: any[]) => {
    const headers = ['ID', 'Title', 'Completed', 'Priority', 'Created', 'Completed At', 'Due Date', 'Project', 'Labels'];
    const rows = tasks.map(task => [
      task.id,
      `"${task.title}"`,
      task.completed,
      task.priority,
      task.createdAt,
      task.completedAt || '',
      task.dueDate || '',
      task.project || '',
      `"${task.labels.join(', ')}"`,
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  return {
    loading,
    taskStats,
    weeklyData,
    streakData,
    achievements,
    getOverdueCount,
    exportReport,
    loadAnalytics,
  };
};