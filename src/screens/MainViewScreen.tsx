import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTaskManager } from '../hooks/useTaskManager';
import { ViewToggle } from '../components/ViewToggle';
import { ListView } from '../components/ListView';
import { KanbanView } from '../components/KanbanView';
import { CalendarView } from '../components/CalendarView';
import { ChecklistView } from '../components/ChecklistView';
import { FocusView } from '../components/FocusView';
import { GlobalSearch } from '../components/GlobalSearch';

type ViewType = 'list' | 'kanban' | 'calendar' | 'checklist' | 'focus';

export const MainViewScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [showSearch, setShowSearch] = useState(false);
  const { getTasks, toggleTask, deleteTask, snoozeTask, archiveTask } = useTaskManager();
  
  const tasks = Array.from(getTasks()).filter(t => !t.deletedAt !== null);

  const handleTaskEdit = (task: any) => {
    navigation.navigate('TaskForm' as never, { task });
  };

  const handleTaskToggle = async (task: any) => {
    try {
      await toggleTask(task._id);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleTaskSnooze = async (taskId: string, date: Date) => {
    try {
      await snoozeTask(taskId, date);
    } catch (error) {
      console.error('Failed to snooze task:', error);
    }
  };

  const handleTaskArchive = async (taskId: string) => {
    try {
      await archiveTask(taskId);
    } catch (error) {
      console.error('Failed to archive task:', error);
    }
  };

  const handleTaskDelete = async (task: any) => {
    try {
      await deleteTask(task._id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleTaskComplete = async (task: any) => {
    try {
      await toggleTask(task._id);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return (
          <ListView
            tasks={tasks}
            onTaskToggle={handleTaskToggle}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            onTaskSnooze={handleTaskSnooze}
            onTaskArchive={handleTaskArchive}
          />
        );
      case 'kanban':
        return (
          <KanbanView
            tasks={tasks}
            onTaskToggle={handleTaskToggle}
            onTaskEdit={handleTaskEdit}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            tasks={tasks}
            onTaskEdit={handleTaskEdit}
          />
        );
      case 'checklist':
        return (
          <ChecklistView
            tasks={tasks}
            onTaskToggle={handleTaskToggle}
            onTaskEdit={handleTaskEdit}
          />
        );
      case 'focus':
        return (
          <FocusView
            tasks={tasks}
            onTaskComplete={handleTaskComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {}
      <View style={{
        backgroundColor: 'white',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Text style={{ fontSize: 24 }}>☰</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>TaskFlow</Text>
          <TouchableOpacity onPress={() => setShowSearch(true)}>
            <Text style={{ fontSize: 20 }}>🔍</Text>
          </TouchableOpacity>
        </View>
        
        <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
      </View>

      {}
      {renderCurrentView()}

      {}
      <GlobalSearch
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        onTaskSelect={(taskId) => {
          const task = tasks.find(t => t._id.equals(taskId));
          if (task) handleTaskEdit(task);
        }}
        onProjectSelect={(projectId) => {
          navigation.navigate('ProjectOverview' as never, { projectId });
        }}
      />
    </View>
  );
};

export default MainViewScreen;