import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAnalytics } from '../hooks/useAnalytics';

interface OverdueWidgetProps {
  onPress?: () => void;
}

export const OverdueWidget: React.FC<OverdueWidgetProps> = ({ onPress }) => {
  const { taskStats } = useAnalytics();

  if (taskStats.overdue === 0) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#FF6B6B',
        margin: 8,
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 20, marginRight: 8 }}>⚠️</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
          {taskStats.overdue} Overdue Task{taskStats.overdue > 1 ? 's' : ''}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
          Tap to view overdue tasks
        </Text>
      </View>
      <Text style={{ color: 'white', fontSize: 16 }}>→</Text>
    </TouchableOpacity>
  );
};

export default OverdueWidget;