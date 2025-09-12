import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAnalytics } from '../hooks/useAnalytics';
import { useTaskManager } from '../hooks/useTaskManager';
import { StatsCard } from './StatsCard';
import { OverdueWidget } from './OverdueWidget';

interface Widget {
  id: string;
  type: 'stats' | 'overdue' | 'recent' | 'streak';
  title: string;
  enabled: boolean;
  position: number;
}

export const CustomDashboard: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { taskStats, streakData } = useAnalytics();
  const { getTasks } = useTaskManager();
  
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'stats', type: 'stats', title: 'Task Statistics', enabled: true, position: 0 },
    { id: 'overdue', type: 'overdue', title: 'Overdue Tasks', enabled: true, position: 1 },
    { id: 'streak', type: 'streak', title: 'Current Streak', enabled: true, position: 2 },
    { id: 'recent', type: 'recent', title: 'Recent Tasks', enabled: false, position: 3 }]);

  const recentTasks = getTasks().slice(0, 3);

  const renderWidget = (widget: Widget) => {
    if (!widget.enabled) return null;

    switch (widget.type) {
      case 'stats':
        return (
          <View key={widget.id} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <View style={{ width: '50%' }}>
              <StatsCard title="Total" value={taskStats.total} icon="📝" color="#4A90E2" />
            </View>
            <View style={{ width: '50%' }}>
              <StatsCard title="Completed" value={taskStats.completed} icon="✅" color="#50C878" />
            </View>
          </View>
        );
      
      case 'overdue':
        return <OverdueWidget key={widget.id} onPress={() => navigation.navigate('Tasks' as never, { filter: 'overdue' })} />;
      
      case 'streak':
        return (
          <StatsCard
            key={widget.id}
            title="Current Streak"
            value={`${streakData.current} days`}
            icon="🔥"
            color="#FF8C00"
          />
        );
      
      case 'recent':
        return (
          <View key={widget.id} style={{
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
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>Recent Tasks</Text>
            {recentTasks.map(task => (
              <Text key={task._id.toString()} style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
                • {task.title}
              </Text>
            ))}
          </View>
        );
      
      default:
        return null;
    }
  };

  const toggleWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, enabled: !w.enabled } : w
    ));
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Dashboard</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('DashboardSettings' as never, { widgets, toggleWidget })}
          style={{ padding: 8 }}
        >
          <Text style={{ fontSize: 16 }}>⚙️</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        {widgets
          .sort((a, b) => a.position - b.position)
          .map(renderWidget)
        }
      </ScrollView>
    </View>
  );
};

export default CustomDashboard;