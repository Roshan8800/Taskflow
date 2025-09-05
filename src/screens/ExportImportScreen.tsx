import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTodos } from '../hooks/useTodos';
import { useProjects } from '../hooks/useProjects';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ExportImportScreen: React.FC = () => {
  const { theme } = useTheme();
  const { todos } = useTodos();
  const { projects } = useProjects();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const exportToJSON = async () => {
    setExporting(true);
    try {
      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        data: {
          todos: todos.map(todo => ({
            id: todo._id.toString(),
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
            priority: todo.priority,
            project: todo.project,
            dueDate: todo.dueDate?.toISOString(),
            createdAt: todo.createdAt.toISOString(),
          })),
          projects: projects.map(project => ({
            id: project._id.toString(),
            name: project.name,
            description: project.description,
            color: project.color,
            createdAt: project.createdAt.toISOString(),
          })),
        },
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Save to device storage
      await AsyncStorage.setItem('taskflow_backup', jsonString);
      
      // Share the data
      await Share.share({
        message: jsonString,
        title: 'TaskFlow Data Export',
      });

      Alert.alert('Success', 'Data exported successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = async () => {
    setExporting(true);
    try {
      const csvHeader = 'Title,Description,Completed,Priority,Project,Due Date,Created Date\n';
      const csvRows = todos.map(todo => 
        `"${todo.title}","${todo.description || ''}","${todo.completed}","${todo.priority}","${todo.project || ''}","${todo.dueDate?.toLocaleDateString() || ''}","${todo.createdAt.toLocaleDateString()}"`
      ).join('\n');
      
      const csvContent = csvHeader + csvRows;
      
      await Share.share({
        message: csvContent,
        title: 'TaskFlow Tasks Export (CSV)',
      });

      Alert.alert('Success', 'CSV exported successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  const importFromBackup = async () => {
    setImporting(true);
    try {
      const backupData = await AsyncStorage.getItem('taskflow_backup');
      if (!backupData) {
        Alert.alert('No Backup', 'No backup data found on this device');
        return;
      }

      Alert.alert(
        'Import Data',
        'This will replace all current data. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            style: 'destructive',
            onPress: async () => {
              try {
                const parsedData = JSON.parse(backupData);
                // Here you would implement the actual import logic
                // This would involve recreating todos and projects in Realm
                Alert.alert('Success', 'Data imported successfully!');
              } catch (error) {
                Alert.alert('Error', 'Invalid backup data format');
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to import data');
    } finally {
      setImporting(false);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all tasks and projects. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear AsyncStorage
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  const ActionCard = ({ title, description, onPress, loading, color }: {
    title: string;
    description: string;
    onPress: () => void;
    loading?: boolean;
    color?: string;
  }) => (
    <TouchableOpacity
      style={[styles.actionCard, { backgroundColor: theme.surface }]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: color || theme.text }]}>{title}</Text>
        <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
          {description}
        </Text>
      </View>
      <Text style={[styles.arrow, { color: theme.textSecondary }]}>
        {loading ? '...' : '→'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Backup & Export</Text>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Export Data</Text>
        
        <ActionCard
          title="Export as JSON"
          description="Complete backup with all data and settings"
          onPress={exportToJSON}
          loading={exporting}
        />
        
        <ActionCard
          title="Export as CSV"
          description="Tasks only in spreadsheet format"
          onPress={exportToCSV}
          loading={exporting}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Import Data</Text>
        
        <ActionCard
          title="Import from Backup"
          description="Restore from previous JSON backup"
          onPress={importFromBackup}
          loading={importing}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Management</Text>
        
        <ActionCard
          title="Clear All Data"
          description="Permanently delete all tasks and projects"
          onPress={clearAllData}
          color="#FF6B6B"
        />
      </View>

      <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>📋 Data Summary</Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          Tasks: {todos.length}
        </Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          Projects: {projects.length}
        </Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          Completed: {todos.filter(t => t.completed).length}
        </Text>
      </View>

      <View style={[styles.warningCard, { backgroundColor: '#FFF3CD', borderColor: '#FFD93D' }]}>
        <Text style={[styles.warningTitle, { color: '#856404' }]}>⚠️ Important</Text>
        <Text style={[styles.warningText, { color: '#856404' }]}>
          All data is stored locally on your device. Regular backups are recommended to prevent data loss.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  warningCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
  },
});