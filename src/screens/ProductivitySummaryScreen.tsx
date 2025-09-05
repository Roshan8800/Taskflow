import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useStats } from '../hooks/useStats';

export const ProductivitySummaryScreen: React.FC = () => {
  const { theme } = useTheme();
  const { stats } = useStats();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly'>('daily');

  const dailyData = {
    tasksCompleted: 8,
    tasksCreated: 12,
    focusTime: 240, // minutes
    productivity: 85,
    streakDays: 5,
    topCategory: 'Work',
    completionRate: 67,
  };

  const weeklyData = {
    tasksCompleted: 45,
    tasksCreated: 68,
    focusTime: 1680, // minutes
    productivity: 78,
    streakDays: 5,
    topCategory: 'Work',
    completionRate: 66,
  };

  const currentData = selectedPeriod === 'daily' ? dailyData : weeklyData;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const StatCard = ({ title, value, subtitle, color }: {
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
      <Text style={[styles.statTitle, { color: theme.textSecondary }]}>{title}</Text>
      <Text style={[styles.statValue, { color: color || theme.text }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );

  const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => (
    <View style={[styles.progressContainer, { backgroundColor: theme.border }]}>
      <View 
        style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} 
      />
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Productivity Summary</Text>
        
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodBtn,
              { backgroundColor: selectedPeriod === 'daily' ? theme.primary : theme.surface }
            ]}
            onPress={() => setSelectedPeriod('daily')}
          >
            <Text style={[
              styles.periodText,
              { color: selectedPeriod === 'daily' ? theme.background : theme.text }
            ]}>
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodBtn,
              { backgroundColor: selectedPeriod === 'weekly' ? theme.primary : theme.surface }
            ]}
            onPress={() => setSelectedPeriod('weekly')}
          >
            <Text style={[
              styles.periodText,
              { color: selectedPeriod === 'weekly' ? theme.background : theme.text }
            ]}>
              Weekly
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Tasks Completed"
          value={currentData.tasksCompleted}
          subtitle={`of ${currentData.tasksCreated} created`}
          color="#6BCF7F"
        />
        <StatCard
          title="Focus Time"
          value={formatTime(currentData.focusTime)}
          subtitle={selectedPeriod === 'daily' ? 'today' : 'this week'}
          color="#45B7D1"
        />
        <StatCard
          title="Productivity Score"
          value={`${currentData.productivity}%`}
          color="#FFD93D"
        />
        <StatCard
          title="Current Streak"
          value={`${currentData.streakDays} days`}
          color="#FF6B6B"
        />
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Completion Rate</Text>
        <View style={styles.progressSection}>
          <Text style={[styles.progressLabel, { color: theme.text }]}>
            {currentData.completionRate}% Complete
          </Text>
          <ProgressBar percentage={currentData.completionRate} color="#6BCF7F" />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Categories</Text>
        <View style={styles.categoryList}>
          <View style={styles.categoryItem}>
            <View style={[styles.categoryColor, { backgroundColor: '#FF6B6B' }]} />
            <Text style={[styles.categoryName, { color: theme.text }]}>Work</Text>
            <Text style={[styles.categoryCount, { color: theme.textSecondary }]}>15 tasks</Text>
          </View>
          <View style={styles.categoryItem}>
            <View style={[styles.categoryColor, { backgroundColor: '#4ECDC4' }]} />
            <Text style={[styles.categoryName, { color: theme.text }]}>Personal</Text>
            <Text style={[styles.categoryCount, { color: theme.textSecondary }]}>8 tasks</Text>
          </View>
          <View style={styles.categoryItem}>
            <View style={[styles.categoryColor, { backgroundColor: '#FFD93D' }]} />
            <Text style={[styles.categoryName, { color: theme.text }]}>Learning</Text>
            <Text style={[styles.categoryCount, { color: theme.textSecondary }]}>5 tasks</Text>
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Insights</Text>
        <View style={styles.insightsList}>
          <Text style={[styles.insight, { color: theme.text }]}>
            🎯 You're most productive in the morning hours
          </Text>
          <Text style={[styles.insight, { color: theme.text }]}>
            📈 Your completion rate improved by 12% this week
          </Text>
          <Text style={[styles.insight, { color: theme.text }]}>
            🔥 You're on a 5-day completion streak!
          </Text>
          <Text style={[styles.insight, { color: theme.text }]}>
            💡 Consider breaking down large tasks for better completion
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  periodBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressSection: {
    gap: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  categoryList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  categoryCount: {
    fontSize: 14,
  },
  insightsList: {
    gap: 12,
  },
  insight: {
    fontSize: 16,
    lineHeight: 24,
  },
});