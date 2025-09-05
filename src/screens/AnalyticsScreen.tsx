import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { useAnalytics } from '../hooks/useAnalytics';
import { StatsCard } from '../components/StatsCard';
import { WeeklyChart } from '../components/WeeklyChart';
import { AchievementCard } from '../components/AchievementCard';

export const AnalyticsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { loading, taskStats, weeklyData, streakData, achievements, exportReport } = useAnalytics();
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      setExporting(true);
      const report = await exportReport(format);
      
      if (report) {
        await Share.share({
          message: report,
          title: `TaskFlow Report (${format.toUpperCase()})`,
        });
      }
    } catch (error) {
      Alert.alert('Export Failed', 'Could not export report');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 18, color: '#666' }}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{
        backgroundColor: 'white',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Analytics</Text>
          <TouchableOpacity
            onPress={() => Alert.alert(
              'Export Report',
              'Choose format',
              [
                { text: 'JSON', onPress: () => handleExport('json') },
                { text: 'CSV', onPress: () => handleExport('csv') },
                { text: 'Cancel', style: 'cancel' },
              ]
            )}
            disabled={exporting}
          >
            <Text style={{ fontSize: 16, color: '#4A90E2' }}>
              {exporting ? 'Exporting...' : 'Export'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Task Completion Stats */}
      <View style={{ padding: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 8, marginBottom: 8, color: '#333' }}>
          Task Statistics
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <View style={{ width: '50%' }}>
            <StatsCard
              title="Total Tasks"
              value={taskStats.total}
              icon="📝"
              color="#4A90E2"
            />
          </View>
          <View style={{ width: '50%' }}>
            <StatsCard
              title="Completed"
              value={taskStats.completed}
              icon="✅"
              color="#50C878"
            />
          </View>
          <View style={{ width: '50%' }}>
            <StatsCard
              title="Pending"
              value={taskStats.pending}
              icon="⏳"
              color="#FFD93D"
            />
          </View>
          <View style={{ width: '50%' }}>
            <StatsCard
              title="Overdue"
              value={taskStats.overdue}
              icon="⚠️"
              color="#FF6B6B"
            />
          </View>
        </View>
        
        <StatsCard
          title="Completion Rate"
          value={`${Math.round(taskStats.completionRate)}%`}
          subtitle={`${taskStats.completed} out of ${taskStats.total} tasks completed`}
          icon="📊"
          color="#9B59B6"
        />
      </View>

      {/* Streak Tracking */}
      <View style={{ padding: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 8, marginBottom: 8, color: '#333' }}>
          Streak Tracking
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%' }}>
            <StatsCard
              title="Current Streak"
              value={`${streakData.current} days`}
              icon="🔥"
              color="#FF8C00"
            />
          </View>
          <View style={{ width: '50%' }}>
            <StatsCard
              title="Longest Streak"
              value={`${streakData.longest} days`}
              icon="⚡"
              color="#FFD700"
            />
          </View>
        </View>
      </View>

      {/* Weekly Productivity Graph */}
      <WeeklyChart data={weeklyData} />

      {/* Achievements & Badges */}
      <View style={{ padding: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 8, marginBottom: 8, color: '#333' }}>
          Achievements
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {achievements.map(achievement => (
            <View key={achievement.id} style={{ width: '50%' }}>
              <AchievementCard achievement={achievement} />
            </View>
          ))}
        </View>
      </View>

      {/* Summary */}
      <View style={{
        backgroundColor: 'white',
        margin: 8,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' }}>
          Quick Summary
        </Text>
        <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>
          You've completed {taskStats.completed} tasks with a {Math.round(taskStats.completionRate)}% completion rate. 
          Your current streak is {streakData.current} days, and your longest streak was {streakData.longest} days. 
          {taskStats.overdue > 0 && ` You have ${taskStats.overdue} overdue tasks that need attention.`}
        </Text>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};