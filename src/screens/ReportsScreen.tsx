import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const ReportsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedType, setSelectedType] = useState<'productivity' | 'tasks' | 'projects'>('productivity');

  const reportData = {
    productivity: {
      tasksCompleted: 45,
      averageDaily: 6.4,
      streakDays: 12,
      focusHours: 28.5,
    },
    tasks: {
      created: 68,
      completed: 45,
      overdue: 3,
      completionRate: 66,
    },
    projects: {
      active: 5,
      completed: 2,
      onTrack: 4,
      delayed: 1,
    }
  };

  const ReportCard = ({ title, value, subtitle, color }: {
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
  }) => (
    <View style={[styles.reportCard, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.cardTitle, { color: '#000000' }]}>{title}</Text>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      <Text style={[styles.cardSubtitle, { color: '#000000' }]}>{subtitle}</Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, { color: '#000000' }]}>Reports</Text>

      <View style={styles.filters}>
        <View style={styles.filterGroup}>
          <Text style={[styles.filterLabel, { color: '#000000' }]}>Period</Text>
          <View style={styles.filterButtons}>
            {['week', 'month', 'quarter'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.filterBtn,
                  { backgroundColor: selectedPeriod === period ? theme.primary : theme.surface }
                ]}
                onPress={() => setSelectedPeriod(period as any)}
              >
                <Text style={[
                  styles.filterText,
                  { color: selectedPeriod === period ? theme.background : theme.text }
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterGroup}>
          <Text style={[styles.filterLabel, { color: '#000000' }]}>Report Type</Text>
          <View style={styles.filterButtons}>
            {['productivity', 'tasks', 'projects'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterBtn,
                  { backgroundColor: selectedType === type ? theme.primary : theme.surface }
                ]}
                onPress={() => setSelectedType(type as any)}
              >
                <Text style={[
                  styles.filterText,
                  { color: selectedType === type ? theme.background : theme.text }
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.reportGrid}>
        {selectedType === 'productivity' && (
          <>
            <ReportCard
              title="Tasks Completed"
              value={reportData.productivity.tasksCompleted}
              subtitle="This month"
              color="#6BCF7F"
            />
            <ReportCard
              title="Daily Average"
              value={reportData.productivity.averageDaily}
              subtitle="Tasks per day"
              color="#45B7D1"
            />
            <ReportCard
              title="Current Streak"
              value={`${reportData.productivity.streakDays} days`}
              subtitle="Consecutive days"
              color="#FFD93D"
            />
            <ReportCard
              title="Focus Time"
              value={`${reportData.productivity.focusHours}h`}
              subtitle="Total hours"
              color="#FF6B6B"
            />
          </>
        )}

        {selectedType === 'tasks' && (
          <>
            <ReportCard
              title="Created"
              value={reportData.tasks.created}
              subtitle="New tasks"
              color="#4ECDC4"
            />
            <ReportCard
              title="Completed"
              value={reportData.tasks.completed}
              subtitle="Finished tasks"
              color="#6BCF7F"
            />
            <ReportCard
              title="Completion Rate"
              value={`${reportData.tasks.completionRate}%`}
              subtitle="Success rate"
              color="#45B7D1"
            />
            <ReportCard
              title="Overdue"
              value={reportData.tasks.overdue}
              subtitle="Past deadline"
              color="#FF6B6B"
            />
          </>
        )}

        {selectedType === 'projects' && (
          <>
            <ReportCard
              title="Active Projects"
              value={reportData.projectIds.active}
              subtitle="In progress"
              color="#4ECDC4"
            />
            <ReportCard
              title="Completed"
              value={reportData.projectIds.completed}
              subtitle="Finished projects"
              color="#6BCF7F"
            />
            <ReportCard
              title="On Track"
              value={reportData.projectIds.onTrack}
              subtitle="Meeting deadlines"
              color="#45B7D1"
            />
            <ReportCard
              title="Delayed"
              value={reportData.projectIds.delayed}
              subtitle="Behind schedule"
              color="#FF6B6B"
            />
          </>
        )}
      </View>

      <TouchableOpacity style={[styles.exportBtn, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.exportBtnText, { color: '#000000' }]}>
          📊 Export Report
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  filters: { marginBottom: 24 },
  filterGroup: { marginBottom: 16 },
  filterLabel: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  filterButtons: { flexDirection: 'row', gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  filterText: { fontSize: 14, fontWeight: '500' },
  reportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  reportCard: { width: '48%', padding: 16, borderRadius: 8, alignItems: 'center' },
  cardTitle: { fontSize: 14, marginBottom: 8 },
  cardValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, textAlign: 'center' },
  exportBtn: { padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  exportBtnText: { fontSize: 16, fontWeight: '600' },
});

export default ReportsScreen;