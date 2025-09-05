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
    { label: 'Completed', value: completedTasks.length, color: theme.colors.success },
    { label: 'Active', value: activeTasks, color: theme.colors.primary },
    { label: 'Overdue', value: overdueTasks.length, color: theme.colors.error },
  ];

  // Priority Distribution
  const priorityData = [
    { label: 'High', value: todos.filter(t => t.priority === 'high').length, color: theme.colors.error },
    { label: 'Medium', value: todos.filter(t => t.priority === 'medium').length, color: theme.colors.warning },
    { label: 'Low', value: todos.filter(t => t.priority === 'low').length, color: theme.colors.success },
  ];

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
    <ScrollView style={styles.container(theme)} showsVerticalScrollIndicator={false}>
      {/* Overview Stats */}
      <View style={styles.overviewCard(theme)}>
        <Text style={styles.cardTitle(theme)}>Overview</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem(theme)}>
            <Text style={styles.statNumber(theme)}>{totalTasks}</Text>
            <Text style={styles.statLabel(theme)}>Total Tasks</Text>
          </View>
          <View style={styles.statItem(theme)}>
            <Text style={[styles.statNumber(theme), { color: theme.colors.success }]}>{completedTasks.length}</Text>
            <Text style={styles.statLabel(theme)}>Completed</Text>
          </View>
          <View style={styles.statItem(theme)}>
            <Text style={[styles.statNumber(theme), { color: theme.colors.error }]}>{overdueTasks.length}</Text>
            <Text style={styles.statLabel(theme)}>Overdue</Text>
          </View>
          <View style={styles.statItem(theme)}>
            <Text style={[styles.statNumber(theme), { color: theme.colors.primary }]}>{completionRate.toFixed(1)}%</Text>
            <Text style={styles.statLabel(theme)}>Completion Rate</Text>
          </View>
        </View>
        
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel(theme)}>Overall Progress</Text>
          <ProgressBar progress={completionRate / 100} />
        </View>
      </View>

      {/* Task Status Chart */}
      <SimpleChart data={taskStatusData} type="pie" title="Task Status Distribution" />

      {/* Priority Distribution */}
      <SimpleChart data={priorityData} type="bar" title="Tasks by Priority" />

      {/* Weekly Activity */}
      <SimpleChart data={weeklyData} type="bar" title="Weekly Activity" />

      {/* Streaks & Time Tracking */}
      <View style={styles.streaksCard(theme)}>
        <Text style={styles.cardTitle(theme)}>Productivity Streaks</Text>
        
        <View style={styles.streakStats}>
          <View style={styles.streakItem}>
            <Text style={styles.streakNumber(theme)}>{stats?.currentStreak || 0}</Text>
            <Text style={styles.streakLabel(theme)}>Current Streak</Text>
            <Text style={styles.streakUnit(theme)}>days</Text>
          </View>
          
          <View style={styles.streakDivider(theme)} />
          
          <View style={styles.streakItem}>
            <Text style={styles.streakNumber(theme)}>{stats?.longestStreak || 0}</Text>
            <Text style={styles.streakLabel(theme)}>Best Streak</Text>
            <Text style={styles.streakUnit(theme)}>days</Text>
          </View>
        </View>
        
        <View style={styles.timeTracking}>
          <Text style={styles.timeLabel(theme)}>Time Tracking Summary</Text>
          <Text style={styles.timeValue(theme)}>Average: {productivityMetrics.dailyAverage} tasks/day</Text>
          <Text style={styles.timeValue(theme)}>Most productive: {productivityMetrics.mostProductiveDay}</Text>
          <Text style={styles.timeValue(theme)}>Weekly completion: {productivityMetrics.weekly.completionRate.toFixed(1)}%</Text>
        </View>
      </View>

      {/* Badges */}
      {badges.length > 0 && (
        <View style={styles.badgesCard(theme)}>
          <Text style={styles.cardTitle(theme)}>Achievements</Text>
          
          <View style={styles.badgesGrid}>
            {badges.map((badge, index) => (
              <View key={index} style={styles.badge(theme)}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName(theme)}>{badge.name}</Text>
                <Text style={styles.badgeDesc(theme)}>{badge.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: (theme: any) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  }),
  overviewCard: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.md,
  }),
  cardTitle: (theme: any) => ({
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  }),
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statItem: (theme: any) => ({
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  }),
  statNumber: (theme: any) => ({
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
  }),
  statLabel: (theme: any) => ({
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  }),
  progressSection: {
    marginTop: 8,
  },
  progressLabel: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  }),
  streaksCard: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.md,
  }),
  streakStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakItem: {
    flex: 1,
    alignItems: 'center',
  },
  streakNumber: (theme: any) => ({
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary,
  }),
  streakLabel: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  }),
  streakUnit: (theme: any) => ({
    fontSize: 12,
    color: theme.colors.textMuted,
  }),
  streakDivider: (theme: any) => ({
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
    marginHorizontal: 20,
  }),
  timeTracking: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
  },
  timeLabel: (theme: any) => ({
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  }),
  timeValue: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  }),
  badgesCard: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.md,
  }),
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: (theme: any) => ({
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  }),
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: (theme: any) => ({
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  }),
  badgeDesc: (theme: any) => ({
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  }),
});