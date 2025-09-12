import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useTaskManager } from '../hooks/useTaskManager';
import { useMultiSelect } from '../hooks/useMultiSelect';
import { useTheme } from '../hooks/useTheme';
import { filterTasks } from '../utils/taskFilters';
import { MultiSelectToolbar } from '../components/MultiSelectToolbar';

export const ReviewWorkflow = () => {
  const { getActiveTasks, updateTask } = useTaskManager();
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  
  const allTasks = getActiveTasks();
  const overdueTasks = filterTasks.overdue(allTasks);
  const completedTasks = filterTasks.completed(allTasks);
  
  const {
    selectedTasks,
    toggleSelection,
    clearSelection,
    getAvailableActions,
    bulkCompleteSelected
  } = useMultiSelect();

  // Weekly/Monthly summary stats
  const getStats = () => {
    const now = new Date();
    const periodStart = new Date();
    
    if (selectedPeriod === 'week') {
      periodStart.setDate(now.getDate() - 7);
    } else {
      periodStart.setMonth(now.getMonth() - 1);
    }

    const periodTasks = allTasks.filter(task => 
      task.createdAt >= periodStart && task.createdAt <= now
    );
    
    const periodCompleted = completedTasks.filter(task =>
      task.updatedAt >= periodStart && task.updatedAt <= now
    );

    return {
      total: periodTasks.length,
      completed: periodCompleted.length,
      overdue: overdueTasks.length,
      completionRate: periodTasks.length > 0 ? Math.round((periodCompleted.length / periodTasks.length) * 100) : 0
    };
  };

  const stats = getStats();

  const bulkReschedule = async (days: number) => {
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + days);
    
    for (const taskId of selectedTasks) {
      await updateTask(taskId, { dueAt: newDueDate });
    }
    
    clearSelection();
  };

  const renderOverdueTask = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.taskItem,
        { backgroundColor: '#FFFFFF', borderColor: '#CCCCCC' },
        selectedTasks.includes(item._id.toString()) && { backgroundColor: '#FFFFFF' + '20' }
      ]}
      onPress={() => toggleSelection(item._id.toString())}
    >
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, { color: '#000000' }]}>{item.title}</Text>
        <Text style={[styles.overdueText, { color: '#000000' }]}>
          Overdue by {Math.ceil((Date.now() - item.dueAt.getTime()) / (1000 * 60 * 60 * 24))} days
        </Text>
      </View>
      
      <View style={[styles.checkbox, { borderColor: '#CCCCCC' }]}>
        {selectedTasks.includes(item._id.toString()) && (
          <Text style={[styles.checkmark, { color: '#000000' }]}>✓</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, { color: '#000000' }]}>Review & Analytics</Text>

      {}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            { backgroundColor: '#FFFFFF', borderColor: '#CCCCCC' },
            selectedPeriod === 'week' && { backgroundColor: '#FFFFFF' }
          ]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[
            styles.periodText,
            { color: selectedPeriod === 'week' ? 'white' : theme.text }
          ]}>
            This Week
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.periodButton,
            { backgroundColor: '#FFFFFF', borderColor: '#CCCCCC' },
            selectedPeriod === 'month' && { backgroundColor: '#FFFFFF' }
          ]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[
            styles.periodText,
            { color: selectedPeriod === 'month' ? 'white' : theme.text }
          ]}>
            This Month
          </Text>
        </TouchableOpacity>
      </View>

      {}
      <View style={[styles.statsContainer, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#000000' }]}>{stats.total}</Text>
          <Text style={[styles.statLabel, { color: '#000000' }]}>Total Tasks</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#000000' }]}>{stats.completed}</Text>
          <Text style={[styles.statLabel, { color: '#000000' }]}>Completed</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#000000' }]}>{stats.overdue}</Text>
          <Text style={[styles.statLabel, { color: '#000000' }]}>Overdue</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#000000' }]}>{stats.completionRate}%</Text>
          <Text style={[styles.statLabel, { color: '#000000' }]}>Completion</Text>
        </View>
      </View>

      {}
      <View style={styles.overdueSection}>
        <Text style={[styles.sectionTitle, { color: '#000000' }]}>
          Overdue Tasks ({overdueTasks.length})
        </Text>
        
        {overdueTasks.length > 0 && (
          <View style={styles.rescheduleActions}>
            <TouchableOpacity
              style={[styles.rescheduleButton, { backgroundColor: '#FFFFFF' }]}
              onPress={() => bulkReschedule(1)}
            >
              <Text style={styles.rescheduleText}>Reschedule +1 Day</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.rescheduleButton, { backgroundColor: '#FFFFFF' }]}
              onPress={() => bulkReschedule(7)}
            >
              <Text style={styles.rescheduleText}>Reschedule +1 Week</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={overdueTasks}
          renderItem={renderOverdueTask}
          keyExtractor={item => item._id.toString()}
          style={styles.taskList}
        />
      </View>

      <MultiSelectToolbar
        selectedCount={selectedTasks.length}
        tasks={overdueTasks}
        selectedTasks={selectedTasks}
        onComplete={() => bulkCompleteSelected(overdueTasks)}
        onDelete={() => {}}
        onArchive={() => {}}
        onUnarchive={() => {}}
        onMove={() => {}}
        onClear={clearSelection}
        getAvailableActions={getAvailableActions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  periodSelector: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  periodButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  periodText: { fontSize: 14, fontWeight: '500' },
  statsContainer: { flexDirection: 'row', padding: 16, borderRadius: 12, marginBottom: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 4 },
  overdueSection: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  rescheduleActions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  rescheduleButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  rescheduleText: { color: 'white', fontSize: 14, fontWeight: '500' },
  taskList: { flex: 1 },
  taskItem: { flexDirection: 'row', padding: 16, marginBottom: 8, borderRadius: 8, borderWidth: 1 },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '500' },
  overdueText: { fontSize: 12, marginTop: 4 },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  checkmark: { fontSize: 16, fontWeight: 'bold' }
});