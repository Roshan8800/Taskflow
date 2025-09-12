import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { FocusView } from '../components/FocusView';
import { useTaskManager } from '../hooks/useTaskManager';

export const FocusModeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { getTasks, toggleTask } = useTaskManager();
  const tasks = Array.from(getTasks()).filter(t => !t.deletedAt !== null);

  const handleTaskComplete = async (task: any) => {
    try {
      await toggleTask(task._id);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
          <Text style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Focus Mode</Text>
      </View>
      
      <FocusView tasks={tasks} onTaskComplete={handleTaskComplete} />
    </View>
  );
};

export default FocusModeScreen;