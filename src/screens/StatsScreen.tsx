import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTodos } from '../hooks/useTodos';
import { useStats } from '../hooks/useStats';
import { SimpleChart } from '../components/SimpleChart';
import { ProgressBar } from '../components/ProgressBar';
import { calculateProductivityMetrics, generateWeeklyChartData } from '../utils/analytics';

export const StatsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { todos, getTodayTasks, getOverdueTasks, getCompletedTasks } = useTodos();
  const { stats } = useStats();

  const completedTasks = getCompletedTasks();
  const overdueTasks = getOverdueTasks();
  const todayTasks = getTodayTasks();
  const totalTasks = todos.length;
  const activeTasks = todos.filter(todo => !todo.completed).length;

  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  // Task Status Chart Data
  const taskStatusData = [
    { label: 'Completed', value: completedTasks.length, color: '#000000' },
    { label: 'Active', value: activeTasks, color: '#000000' },
    { label: 'Overdue', value: overdueTasks.length, color: '#000000' }];

  // Priority Distribution
  const priorityData = [
    { label: 'High', value: todos.filter(t => t.priority === 'high').length, color: '#000000' },
    { label: 'Medium', value: todos.filter(t => t.priority === 'medium').length, color: '#000000' },
    { label: 'Low', value: todos.filter(t => t.priority === 'low').length, color: '#000000' }];

  // Weekly Progress (real data)
  const weeklyData = generateWeeklyChartData(todos, theme);
  const productivityMetrics = calculateProductivityMetrics(todos);

  const getBadges = () => {
    const badges = [];
    const streak = stats?.currentStreak || 0;
    const totalCompleted = stats?.totalCompleted || 0;
    
    if (streak >= 7) badges.push({ icon: '🔥', name: 'Week Warrior', desc: '7+ day streak' });
    if (streak >= 30) badges.push({ icon: '🏆', name: 'Month Master', desc: '30+ day streak' });
    if (totalCompleted >= 50) badges.push({ icon: '⭐', name: 'Task Star', desc: '50+ completed' });
    if (totalCompleted >= 100) badges.push({ icon: '🎆', name: 'Century Club', desc: '100+ completed' });
    if (completionRate >= 80) badges.push({ icon: '🎨', name: 'Perfectionist', desc: '80%+ completion' });
    
    return badges;
  };

  const badges = getBadges();

  return (
    <ScrollView style={[styles.container]} showsVerticalScrollIndicator={false}>
      {}
      <View style={[styles.overviewCard]}>
        <Text style={[styles.cardTitle]}>Overview</Text>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statItem]}>
            <Text style={[styles.statNumber]}>{totalTasks}</Text>
            <Text style={[styles.statLabel]}>Total Tasks</Text>
          </View>
          <View style={[styles.statItem]}>
            <Text style={[styles.statNumber, { color: '#000000' }]}>{completedTasks.length}</Text>
            <Text style={[styles.statLabel]}>Completed</Text>
          </View>
          <View style={[styles.statItem]}>
            <Text style={[styles.statNumber, { color: '#000000' }]}>{overdueTasks.length}</Text>
            <Text style={[styles.statLabel]}>Overdue</Text>
          </View>
          <View style={[styles.statItem]}>
            <Text style={[styles.statNumber, { color: '#000000' }]}>{completionRate.toFixed(1)}%</Text>
            <Text style={[styles.statLabel]}>Completion Rate</Text>
          </View>
        </View>
        
        <View style={styles.progressSection}>
          <Text style={[styles.progressLabel]}>Overall Progress</Text>
          <ProgressBar progress={completionRate / 100} />
        </View>
      </View>

      {}
      <SimpleChart data={taskStatusData} type="pie" title="Task Status Distribution" />

      {}
      <SimpleChart data={priorityData} type="bar" title="Tasks by Priority" />

      {}
      <SimpleChart data={weeklyData} type="bar" title="Weekly Activity" />

      {}
      <View style={[styles.streaksCard]}>
        <Text style={[styles.cardTitle]}>Productivity Streaks</Text>
        
        <View style={styles.streakStats}>
          <View style={styles.streakItem}>
            <Text style={[styles.streakNumber]}>{stats?.currentStreak || 0}</Text>
            <Text style={[styles.streakLabel]}>Current Streak</Text>
            <Text style={[styles.streakUnit]}>days</Text>
          </View>
          
          <View style={[styles.streakDivider]} />
          
          <View style={styles.streakItem}>
            <Text style={[styles.streakNumber]}>{stats?.longestStreak || 0}</Text>
            <Text style={[styles.streakLabel]}>Best Streak</Text>
            <Text style={[styles.streakUnit]}>days</Text>
          </View>
        </View>
        
        <View style={styles.timeTracking}>
          <Text style={[styles.timeLabel]}>Time Tracking Summary</Text>
          <Text style={[styles.timeValue]}>Average: {productivityMetrics.dailyAverage} tasks/day</Text>
          <Text style={[styles.timeValue]}>Most productive: {productivityMetrics.mostProductiveDay}</Text>
          <Text style={[styles.timeValue]}>Weekly completion: {productivityMetrics.weekly.completionRate.toFixed(1)}%</Text>
        </View>
      </View>

      {}
      {badges.length > 0 && (
        <View style={[styles.badgesCard]}>
          <Text style={[styles.cardTitle]}>Achievements</Text>
          
          <View style={styles.badgesGrid}>
            {badges.map((badge, index) => (
              <View key={index} style={[styles.badge]}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={[styles.badgeName]}>{badge.name}</Text>
                <Text style={[styles.badgeDesc]}>{badge.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  overviewCard: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statItem: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  statLabel: {
    fontSize: 12,
    color: '#000000',
    marginTop: 4,
    textAlign: 'center',
  },
  progressSection: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  streaksCard: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ,
  },
  streakStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakItem: {
    flex: 1,
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
  },
  streakLabel: {
    fontSize: 14,
    color: '#000000',
    marginTop: 4,
  },
  streakUnit: {
    fontSize: 12,
    color: '#000000',
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#000000',
    marginHorizontal: 20,
  },
  timeTracking: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  timeValue: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
  },
  badgesCard: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDesc: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
  },
});

export default StatsScreen;