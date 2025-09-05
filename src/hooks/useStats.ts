import { useState, useEffect } from 'react';
import { BSON } from 'realm';
import { getRealm } from '../database/db';
import { UserStats } from '../models/UserStats';
import { Todo } from '../models/Todo';
import { useAuth } from './useAuth';
import { handleError } from '../utils/errorHandler';

export const useStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const realm = await getRealm();
      let userStats = realm.objects<UserStats>('UserStats')
        .filtered('userId == $0', user?.id || '')[0];
      
      if (!userStats) {
        realm.write(() => {
          userStats = realm.create<UserStats>('UserStats', {
            _id: new BSON.ObjectId(),
            userId: user?.id || '',
            totalTasks: 0,
            completedTasks: 0,
            currentStreak: 0,
            longestStreak: 0,
            totalFocusTime: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
      
      setStats(userStats);
      await updateStats();
    } catch (error) {
      handleError(error, 'Loading Stats');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async () => {
    try {
      const realm = await getRealm();
      const todos = realm.objects<Todo>('Todo')
        .filtered('userId == $0', user?.id || '');
      
      const totalTasks = todos.length;
      const completedTasks = todos.filtered('completed == true').length;
      
      const userStats = realm.objects<UserStats>('UserStats')
        .filtered('userId == $0', user?.id || '')[0];
      
      if (userStats) {
        realm.write(() => {
          userStats.totalTasks = totalTasks;
          userStats.completedTasks = completedTasks;
          userStats.updatedAt = new Date();
        });
        setStats(userStats);
      }
    } catch (error) {
      handleError(error, 'Updating Stats');
    }
  };

  const incrementStreak = async () => {
    try {
      const realm = await getRealm();
      const userStats = realm.objects<UserStats>('UserStats')
        .filtered('userId == $0', user?.id || '')[0];
      
      if (userStats) {
        realm.write(() => {
          userStats.currentStreak += 1;
          if (userStats.currentStreak > userStats.longestStreak) {
            userStats.longestStreak = userStats.currentStreak;
          }
          userStats.updatedAt = new Date();
        });
        setStats(userStats);
      }
    } catch (error) {
      handleError(error, 'Incrementing Streak');
    }
  };

  const addFocusTime = async (minutes: number) => {
    try {
      const realm = await getRealm();
      const userStats = realm.objects<UserStats>('UserStats')
        .filtered('userId == $0', user?.id || '')[0];
      
      if (userStats) {
        realm.write(() => {
          userStats.totalFocusTime += minutes;
          userStats.updatedAt = new Date();
        });
        setStats(userStats);
      }
    } catch (error) {
      handleError(error, 'Adding Focus Time');
    }
  };

  return {
    stats,
    loading,
    updateStats,
    incrementStreak,
    addFocusTime,
    loadStats,
  };
};