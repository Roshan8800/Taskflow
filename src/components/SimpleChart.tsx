import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface SimpleChartProps {
  data: ChartData[];
  type: 'bar' | 'pie';
  title: string;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({ data, type, title }) => {
  const { theme } = useTheme();
  const maxValue = Math.max(...data.map(d => d.value));

  const renderBarChart = () => (
    <View style={styles.barChart}>
      {data.map((item, index) => (
        <View key={index} style={styles.barContainer}>
          <View style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  height: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%',
                  backgroundColor: item.color,
                }
              ]}
            />
          </View>
          <Text style={styles.barLabel(theme)}>{item.label}</Text>
          <Text style={styles.barValue(theme)}>{item.value}</Text>
        </View>
      ))}
    </View>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <View style={styles.pieChart}>
        <View style={styles.pieContainer}>
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            return (
              <View key={index} style={styles.pieItem}>
                <View style={[styles.pieDot, { backgroundColor: item.color }]} />
                <Text style={styles.pieLabel(theme)}>{item.label}</Text>
                <Text style={styles.pieValue(theme)}>{percentage.toFixed(1)}%</Text>
              </View>
            );
          })}
        </View>
        
        <View style={styles.pieVisual}>
          <View style={styles.pieCircle(theme)}>
            <Text style={styles.pieTotal(theme)}>{total}</Text>
            <Text style={styles.pieTotalLabel(theme)}>Total</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container(theme)}>
      <Text style={styles.title(theme)}>{title}</Text>
      {type === 'bar' ? renderBarChart() : renderPieChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.md,
  }),
  title: (theme: any) => ({
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  }),
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 80,
    width: 30,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: (theme: any) => ({
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  }),
  barValue: (theme: any) => ({
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  }),
  pieChart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieContainer: {
    flex: 1,
  },
  pieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pieDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  pieLabel: (theme: any) => ({
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
  }),
  pieValue: (theme: any) => ({
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  }),
  pieVisual: {
    alignItems: 'center',
    marginLeft: 20,
  },
  pieCircle: (theme: any) => ({
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  pieTotal: (theme: any) => ({
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  }),
  pieTotalLabel: (theme: any) => ({
    fontSize: 12,
    color: theme.colors.textSecondary,
  }),
});