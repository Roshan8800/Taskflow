import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const StatisticsBreakdownScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedMetric, setSelectedMetric] = useState<'completion' | 'productivity' | 'time'>('completion');

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32;

  const data = {
    completion: {
      daily: [85, 92, 78, 95, 88, 90, 87],
      weekly: [88, 85, 92, 89],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    productivity: {
      categories: [
        { name: 'Work', value: 45, color: '#FF6B6B' },
        { name: 'Personal', value: 30, color: '#4ECDC4' },
        { name: 'Learning', value: 15, color: '#FFD93D' },
        { name: 'Health', value: 10, color: '#96CEB4' }]
    },
    time: {
      hours: [2.5, 3.2, 1.8, 4.1, 3.5, 2.9, 3.8],
      average: 3.1
    }
  };

  const BarChart = ({ data, labels }: { data: number[]; labels: string[] }) => (
    <View style={styles.chart}>
      <View style={styles.chartBars}>
        {data.map((value, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={[styles.bar, { 
              height: (value / Math.max(...data)) * 120,
              backgroundColor: '#FFFFFF' 
            }]} />
            <Text style={[styles.barLabel, { color: '#000000' }]}>
              {labels[index]}
            </Text>
            <Text style={[styles.barValue, { color: '#000000' }]}>
              {value}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const PieChart = ({ data }: { data: any[] }) => (
    <View style={styles.pieContainer}>
      <View style={styles.pieChart}>
        {data.map((item, index) => (
          <View key={index} style={[styles.pieSlice, { backgroundColor: item.color }]} />
        ))}
      </View>
      <View style={styles.pieLegend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={[styles.legendText, { color: '#000000' }]}>
              {item.name} ({item.value}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, { color: '#000000' }]}>Statistics Breakdown</Text>

      <View style={styles.metrics}>
        {['completion', 'productivity', 'time'].map((metric) => (
          <TouchableOpacity
            key={metric}
            style={[
              styles.metricBtn,
              { backgroundColor: selectedMetric === metric ? theme.primary : theme.surface }
            ]}
            onPress={() => setSelectedMetric(metric as any)}
          >
            <Text style={[
              styles.metricText,
              { color: selectedMetric === metric ? theme.background : theme.text }
            ]}>
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.chartContainer, { backgroundColor: '#FFFFFF' }]}>
        {selectedMetric === 'completion' && (
          <View>
            <Text style={[styles.chartTitle, { color: '#000000' }]}>
              Daily Completion Rate (%)
            </Text>
            <BarChart data={data.completion.daily} labels={data.completion.labels} />
          </View>
        )}

        {selectedMetric === 'productivity' && (
          <View>
            <Text style={[styles.chartTitle, { color: '#000000' }]}>
              Task Distribution by Category
            </Text>
            <PieChart data={data.productivity.categories} />
          </View>
        )}

        {selectedMetric === 'time' && (
          <View>
            <Text style={[styles.chartTitle, { color: '#000000' }]}>
              Daily Focus Time (Hours)
            </Text>
            <BarChart 
              data={data.time.hours} 
              labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} 
            />
            <Text style={[styles.average, { color: '#000000' }]}>
              Average: {data.time.average}h per day
            </Text>
          </View>
        )}
      </View>

      <View style={styles.insights}>
        <Text style={[styles.insightsTitle, { color: '#000000' }]}>Key Insights</Text>
        <View style={[styles.insightCard, { backgroundColor: '#FFFFFF' }]}>
          <Text style={[styles.insightText, { color: '#000000' }]}>
            📈 Your productivity peaks on Thursdays with 95% completion rate
          </Text>
        </View>
        <View style={[styles.insightCard, { backgroundColor: '#FFFFFF' }]}>
          <Text style={[styles.insightText, { color: '#000000' }]}>
            🎯 Work tasks make up 45% of your total activity
          </Text>
        </View>
        <View style={[styles.insightCard, { backgroundColor: '#FFFFFF' }]}>
          <Text style={[styles.insightText, { color: '#000000' }]}>
            ⏰ You maintain consistent focus time averaging 3.1 hours daily
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  metrics: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  metricBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  metricText: { fontSize: 14, fontWeight: '500' },
  chartContainer: { padding: 20, borderRadius: 12, marginBottom: 20 },
  chartTitle: { fontSize: 18, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  chart: { alignItems: 'center' },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 160 },
  barContainer: { flex: 1, alignItems: 'center' },
  bar: { width: 24, borderRadius: 4, marginBottom: 8 },
  barLabel: { fontSize: 12, marginBottom: 4 },
  barValue: { fontSize: 10, fontWeight: '500' },
  pieContainer: { alignItems: 'center' },
  pieChart: { width: 120, height: 120, borderRadius: 60, flexDirection: 'row', marginBottom: 20 },
  pieSlice: { flex: 1, height: '100%' },
  pieLegend: { gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendColor: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 14 },
  average: { textAlign: 'center', marginTop: 12, fontSize: 14 },
  insights: { marginBottom: 20 },
  insightsTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  insightCard: { padding: 16, borderRadius: 8, marginBottom: 8 },
  insightText: { fontSize: 14, lineHeight: 20 },
});

export default StatisticsBreakdownScreen;