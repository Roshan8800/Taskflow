import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAnalytics } from '../hooks/useAnalytics';
import { StatsCard } from '../components/StatsCard';
import { WeeklyChart } from '../components/WeeklyChart';

export const ProductivityScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { loading, taskStats, weeklyData, streakData } = useAnalytics();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 18, color: '#666' }}>Loading productivity data...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
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
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Productivity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
            <Text style={{ fontSize: 16, color: '#4A90E2' }}>Full Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Key Metrics */}
        <View style={{ padding: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 8, marginBottom: 8, color: '#333' }}>
            Today's Overview
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '50%' }}>
              <StatsCard
                title="Completion Rate"
                value={`${Math.round(taskStats.completionRate)}%`}
                icon="📊"
                color="#4A90E2"
              />
            </View>
            <View style={{ width: '50%' }}>
              <StatsCard
                title="Current Streak"
                value={`${streakData.current} days`}
                icon="🔥"
                color="#FF8C00"
              />
            </View>
          </View>
        </View>

        {/* Weekly Chart */}
        <WeeklyChart data={weeklyData} />

        {/* Quick Actions */}
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
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#333' }}>
            Quick Actions
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('FocusMode')}
            style={{
              backgroundColor: '#4A90E2',
              padding: 12,
              borderRadius: 8,
              marginBottom: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              🎯 Start Focus Session
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Analytics')}
            style={{
              backgroundColor: '#50C878',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              📈 View Full Analytics
            </Text>
          </TouchableOpacity>
        </View>

        {/* Productivity Tips */}
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
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#333' }}>
            💡 Productivity Tips
          </Text>
          <Text style={{ fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 8 }}>
            • Break large tasks into smaller, manageable chunks
          </Text>
          <Text style={{ fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 8 }}>
            • Use the Pomodoro technique for focused work sessions
          </Text>
          <Text style={{ fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 8 }}>
            • Set realistic deadlines and priorities
          </Text>
          <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>
            • Review and celebrate your completed tasks regularly
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};