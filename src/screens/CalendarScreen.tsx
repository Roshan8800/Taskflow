import React from 'react';
import { View } from 'react-native';
import { CalendarView } from '../components/CalendarView';
import { useTaskManager } from '../hooks/useTaskManager';

export const CalendarScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { getTasks } = useTaskManager();
  const tasks = Array.from(getTasks()).filter(t => !t.isDeleted);

  return (
    <View style={{ flex: 1 }}>
      <CalendarView
        tasks={tasks}
        onTaskEdit={(task) => navigation.navigate('TaskForm', { task })}
      />
    </View>
  );
};