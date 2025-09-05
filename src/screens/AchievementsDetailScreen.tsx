import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'productivity' | 'streak' | 'milestone' | 'special';
  unlocked: boolean;
  progress?: number;
  target?: number;
  unlockedAt?: Date;
  points: number;
}

export const AchievementsDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const achievements: Achievement[] = [
    { id: '1', name: 'First Steps', description: 'Complete your first task', icon: '👶', category: 'milestone', unlocked: true, unlockedAt: new Date(2024, 0, 1), points: 10 },
    { id: '2', name: 'Early Bird', description: 'Complete 5 tasks before 9 AM', icon: '🌅', category: 'productivity', unlocked: true, unlockedAt: new Date(2024, 0, 5), points: 25 },
    { id: '3', name: 'Streak Master', description: 'Maintain a 7-day streak', icon: '🔥', category: 'streak', unlocked: true, unlockedAt: new Date(2024, 0, 10), points: 50 },
    { id: '4', name: 'Century Club', description: 'Complete 100 tasks', icon: '💯', category: 'milestone', unlocked: false, progress: 67, target: 100, points: 100 },
    { id: '5', name: 'Speed Demon', description: 'Complete 20 tasks in one day', icon: '⚡', category: 'productivity', unlocked: false, progress: 8, target: 20, points: 75 },
    { id: '6', name: 'Project Master', description: 'Complete 10 projects', icon: '🎯', category: 'milestone', unlocked: false, progress: 3, target: 10, points: 150 },
    { id: '7', name: 'Night Owl', description: 'Complete tasks after 10 PM for 5 days', icon: '🦉', category: 'special', unlocked: false, progress: 2, target: 5, points: 30 },
    { id: '8', name: 'Perfectionist', description: 'Complete all tasks for 3 consecutive days', icon: '✨', category: 'streak', unlocked: false, progress: 1, target: 3, points: 60 },
  ];

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productivity': return '#4ECDC4';
      case 'streak': return '#FF6B6B';
      case 'milestone': return '#FFD93D';
      case 'special': return '#96CEB4';
      default: return theme.textSecondary;
    }
  };

  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const renderAchievement = (achievement: Achievement) => (
    <View 
      key={achievement.id} 
      style={[
        styles.achievementCard, 
        { backgroundColor: theme.surface },
        !achievement.unlocked && { opacity: 0.6 }
      ]}
    >
      <View style={styles.achievementHeader}>
        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        <View style={styles.achievementInfo}>
          <Text style={[styles.achievementName, { color: theme.text }]}>
            {achievement.name}
          </Text>
          <Text style={[styles.achievementDesc, { color: theme.textSecondary }]}>
            {achievement.description}
          </Text>
        </View>
        <View style={styles.achievementMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(achievement.category) }]}>
            <Text style={styles.categoryText}>
              {achievement.category.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.points, { color: theme.primary }]}>
            {achievement.points} pts
          </Text>
        </View>
      </View>

      {!achievement.unlocked && achievement.progress && achievement.target && (
        <View style={styles.progressSection}>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${(achievement.progress / achievement.target) * 100}%`,
                  backgroundColor: getCategoryColor(achievement.category)
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {achievement.progress} / {achievement.target}
          </Text>
        </View>
      )}

      {achievement.unlocked && achievement.unlockedAt && (
        <Text style={[styles.unlockedDate, { color: theme.textSecondary }]}>
          Unlocked {achievement.unlockedAt.toLocaleDateString()}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Achievements</Text>

      <View style={[styles.summary, { backgroundColor: theme.surface }]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: theme.primary }]}>
            {unlockedCount}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Unlocked
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: theme.primary }]}>
            {achievements.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Total
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: theme.primary }]}>
            {totalPoints}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Points
          </Text>
        </View>
      </View>

      <View style={styles.filters}>
        {['all', 'unlocked', 'locked'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterBtn,
              { backgroundColor: filter === f ? theme.primary : theme.surface }
            ]}
            onPress={() => setFilter(f as any)}
          >
            <Text style={[
              styles.filterText,
              { color: filter === f ? theme.background : theme.text }
            ]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.achievementsList}>
        {filteredAchievements.map(renderAchievement)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  summary: { flexDirection: 'row', padding: 16, borderRadius: 8, marginBottom: 20 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNumber: { fontSize: 24, fontWeight: 'bold' },
  summaryLabel: { fontSize: 14, marginTop: 4 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  filterBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  filterText: { fontSize: 14, fontWeight: '500' },
  achievementsList: { gap: 12, paddingBottom: 20 },
  achievementCard: { padding: 16, borderRadius: 8 },
  achievementHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  achievementIcon: { fontSize: 32, marginRight: 12 },
  achievementInfo: { flex: 1 },
  achievementName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  achievementDesc: { fontSize: 14, lineHeight: 20 },
  achievementMeta: { alignItems: 'flex-end' },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 4 },
  categoryText: { fontSize: 10, fontWeight: 'bold', color: 'white' },
  points: { fontSize: 14, fontWeight: '600' },
  progressSection: { marginBottom: 8 },
  progressBar: { height: 6, borderRadius: 3, marginBottom: 4 },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 12, textAlign: 'right' },
  unlockedDate: { fontSize: 12, fontStyle: 'italic' },
});