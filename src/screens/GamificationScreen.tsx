import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useStats } from '../hooks/useStats';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  target?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  date: string;
}

export const GamificationScreen: React.FC = () => {
  const { theme } = useTheme();
  const { stats } = useStats();

  const badges: Badge[] = [
    { id: '1', name: 'Early Bird', description: 'Complete 5 tasks before 9 AM', icon: '🌅', earned: true },
    { id: '2', name: 'Streak Master', description: 'Maintain a 7-day streak', icon: '🔥', earned: true },
    { id: '3', name: 'Task Crusher', description: 'Complete 100 tasks', icon: '💪', earned: false, progress: 67, target: 100 },
    { id: '4', name: 'Project Pro', description: 'Complete 10 projects', icon: '🎯', earned: false, progress: 3, target: 10 },
    { id: '5', name: 'Speed Demon', description: 'Complete 20 tasks in one day', icon: '⚡', earned: false, progress: 8, target: 20 },
    { id: '6', name: 'Organizer', description: 'Create 50 projects', icon: '📋', earned: true }];

  const recentAchievements: Achievement[] = [
    { id: '1', title: 'Streak Master', description: 'Completed 7 days in a row', points: 100, date: '2024-01-15' },
    { id: '2', title: 'Early Bird', description: 'Completed morning tasks', points: 50, date: '2024-01-14' },
    { id: '3', title: 'Task Warrior', description: 'Completed 50 tasks', points: 75, date: '2024-01-12' }];

  const leaderboard = [
    { rank: 1, name: 'You', points: 1250, streak: 7 },
    { rank: 2, name: 'Alex', points: 1180, streak: 5 },
    { rank: 3, name: 'Sarah', points: 1050, streak: 3 },
    { rank: 4, name: 'Mike', points: 980, streak: 2 },
    { rank: 5, name: 'Emma', points: 920, streak: 4 }];

  const BadgeCard = ({ badge }: { badge: Badge }) => (
    <View style={[
      styles.badgeCard,
      { backgroundColor: '#FFFFFF' },
      badge.earned && { borderColor: '#CCCCCC', borderWidth: 2 }
    ]}>
      <Text style={styles.badgeIcon}>{badge.icon}</Text>
      <Text style={[styles.badgeName, { color: '#000000' }]}>{badge.name}</Text>
      <Text style={[styles.badgeDesc, { color: '#000000' }]} numberOfLines={2}>
        {badge.description}
      </Text>
      {!badge.earned && badge.progress && badge.target && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBg, { backgroundColor: '#FFFFFF' }]}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${(badge.progress / badge.target) * 100}%`,
                  backgroundColor: '#FFFFFF' 
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: '#000000' }]}>
            {badge.progress}/{badge.target}
          </Text>
        </View>
      )}
      {badge.earned && (
        <View style={[styles.earnedBadge, { backgroundColor: '#FFFFFF' }]}>
          <Text style={[styles.earnedText, { color: '#000000' }]}>Earned!</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: '#000000' }]}>Achievements</Text>
        <View style={[styles.pointsCard, { backgroundColor: '#FFFFFF' }]}>
          <Text style={[styles.pointsLabel, { color: '#000000' }]}>Total Points</Text>
          <Text style={[styles.pointsValue, { color: '#000000' }]}>1,250</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#000000' }]}>Badges</Text>
        <View style={styles.badgesGrid}>
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#000000' }]}>Recent Achievements</Text>
        <View style={styles.achievementsList}>
          {recentAchievements.map((achievement) => (
            <View key={achievement.id} style={[styles.achievementCard, { backgroundColor: '#FFFFFF' }]}>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementTitle, { color: '#000000' }]}>
                  {achievement.title}
                </Text>
                <Text style={[styles.achievementDesc, { color: '#000000' }]}>
                  {achievement.description}
                </Text>
                <Text style={[styles.achievementDate, { color: '#000000' }]}>
                  {new Date(achievement.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={[styles.pointsBadge, { backgroundColor: '#FFFFFF' }]}>
                <Text style={[styles.pointsBadgeText, { color: '#000000' }]}>
                  +{achievement.points}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#000000' }]}>Leaderboard</Text>
        <View style={styles.leaderboardList}>
          {leaderboard.map((user) => (
            <View key={user.rank} style={[
              styles.leaderboardItem,
              { backgroundColor: '#FFFFFF' },
              user.rank === 1 && { borderColor: '#FFD700', borderWidth: 2 }
            ]}>
              <View style={styles.rankContainer}>
                <Text style={[styles.rank, { color: '#000000' }]}>#{user.rank}</Text>
                {user.rank === 1 && <Text style={styles.crown}>👑</Text>}
              </View>
              <Text style={[styles.userName, { color: '#000000' }]}>{user.name}</Text>
              <View style={styles.userStats}>
                <Text style={[styles.userPoints, { color: '#000000' }]}>
                  {user.points} pts
                </Text>
                <Text style={[styles.userStreak, { color: '#000000' }]}>
                  🔥 {user.streak}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.motivationCard, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.motivationTitle, { color: '#000000' }]}>
          Keep Going! 🚀
        </Text>
        <Text style={[styles.motivationText, { color: '#000000' }]}>
          You're only 3 tasks away from earning the "Task Crusher" badge!
        </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pointsCard: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 140,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDesc: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBg: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
  },
  earnedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  earnedText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  achievementsList: {
    gap: 8,
  },
  achievementCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 14,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
  },
  pointsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pointsBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  leaderboardList: {
    gap: 8,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  crown: {
    fontSize: 16,
    marginLeft: 4,
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  userStats: {
    alignItems: 'flex-end',
  },
  userPoints: {
    fontSize: 14,
    fontWeight: '600',
  },
  userStreak: {
    fontSize: 12,
  },
  motivationCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default GamificationScreen;