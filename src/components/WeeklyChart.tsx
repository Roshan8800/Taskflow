import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { WeeklyData } from '../hooks/useAnalytics';

interface WeeklyChartProps {
  data: WeeklyData[];
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.completed, d.created)), 1);

  return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      margin: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' }}>
        Weekly Productivity
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 120, paddingHorizontal: 8 }}>
          {data.map((item, index) => {
            const completedHeight = (item.completed / maxValue) * 80;
            const createdHeight = (item.created / maxValue) * 80;
            
            return (
              <View key={index} style={{ alignItems: 'center', marginHorizontal: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 80, marginBottom: 8 }}>
                  <View style={{
                    width: 12,
                    height: completedHeight,
                    backgroundColor: '#50C878',
                    borderRadius: 2,
                    marginRight: 2,
                  }} />
                  <View style={{
                    width: 12,
                    height: createdHeight,
                    backgroundColor: '#4A90E2',
                    borderRadius: 2,
                  }} />
                </View>
                <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
                  {item.date}
                </Text>
                <Text style={{ fontSize: 10, color: '#999', textAlign: 'center' }}>
                  {item.completed}/{item.created}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 12, height: 12, backgroundColor: '#50C878', borderRadius: 2, marginRight: 4 }} />
          <Text style={{ fontSize: 12, color: '#666' }}>Completed</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 12, height: 12, backgroundColor: '#4A90E2', borderRadius: 2, marginRight: 4 }} />
          <Text style={{ fontSize: 12, color: '#666' }}>Created</Text>
        </View>
      </View>
    </View>
  );
};