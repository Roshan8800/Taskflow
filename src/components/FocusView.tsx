import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Todo } from '../models/Todo';

interface FocusViewProps {
  tasks: Todo[];
  onTaskComplete: (task: Todo) => void;
}

export const FocusView: React.FC<FocusViewProps> = ({ tasks, onTaskComplete }) => {
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  const focusTasks = tasks.filter(t => !t.completed && !t.deletedAt !== null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (isBreak) {
      Alert.alert('Break Complete!', 'Ready to start another focus session?', [
        { text: 'Start Session', onPress: startFocusSession }]);
    } else {
      setSessions(prev => prev + 1);
      Alert.alert(
        'Focus Session Complete!',
        selectedTask ? `Great work on "${selectedTask.title}"!` : 'Great focus session!',
        [
          { text: 'Take Break', onPress: startBreak },
          { text: 'Another Session', onPress: startFocusSession },
          selectedTask && { text: 'Mark Complete', onPress: () => completeTask() }].filter(Boolean) as any
      );
    }
  };

  const startFocusSession = () => {
    setTimeLeft(25 * 60);
    setIsBreak(false);
    setIsRunning(true);
  };

  const startBreak = () => {
    setTimeLeft(5 * 60); // 5 minute break
    setIsBreak(true);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const completeTask = () => {
    if (selectedTask) {
      onTaskComplete(selectedTask);
      setSelectedTask(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (isBreak) return '#50C878';
    if (timeLeft < 300) return '#FF6B6B'; // Last 5 minutes
    return '#4A90E2';
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 20 }}>
      {}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}>
        <Text style={{ fontSize: 16, color: '#666', marginBottom: 10 }}>
          {isBreak ? 'Break Time' : 'Focus Session'}
        </Text>
        
        <Text style={{
          fontSize: 64,
          fontWeight: 'bold',
          color: getTimerColor(),
          fontFamily: 'monospace',
        }}>
          {formatTime(timeLeft)}
        </Text>
        
        <Text style={{ fontSize: 14, color: '#999', marginTop: 10 }}>
          Sessions completed: {sessions}
        </Text>
      </View>

      {}
      {selectedTask && (
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          borderLeftWidth: 4,
          borderLeftColor: selectedTask.color,
        }}>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Focusing on:</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
            {selectedTask.title}
          </Text>
          {selectedTask.description && (
            <Text style={{ fontSize: 14, color: '#666' }}>{selectedTask.description}</Text>
          )}
        </View>
      )}

      {}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 30 }}>
        <TouchableOpacity
          onPress={isRunning ? pauseTimer : startFocusSession}
          style={{
            backgroundColor: getTimerColor(),
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 25,
            minWidth: 100,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            {isRunning ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={resetTimer}
          style={{
            backgroundColor: '#f0f0f0',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 25,
            minWidth: 100,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#666', fontSize: 16, fontWeight: '600' }}>Reset</Text>
        </TouchableOpacity>
      </View>

      {}
      {!selectedTask && focusTasks.length > 0 && (
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
            Choose a task to focus on:
          </Text>
          {focusTasks.slice(0, 5).map(task => (
            <TouchableOpacity
              key={task._id.toString()}
              onPress={() => setSelectedTask(task)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0',
              }}
            >
              <View style={{
                width: 4,
                height: 20,
                backgroundColor: task.color,
                borderRadius: 2,
                marginRight: 12,
              }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>{task.title}</Text>
                {task.priority === 'urgent' && (
                  <Text style={{ fontSize: 12, color: '#ff4444', marginTop: 2 }}>URGENT</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedTask && (
        <TouchableOpacity
          onPress={() => setSelectedTask(null)}
          style={{
            backgroundColor: '#f0f0f0',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#666', fontSize: 14 }}>Change Task</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FocusView;