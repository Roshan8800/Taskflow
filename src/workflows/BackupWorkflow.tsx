import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { exportBackup, importBackup, getAlternatePaths } from '../utils/backupImport';
import { useTaskManager } from '../hooks/useTaskManager';
import { useProjectManager } from '../hooks/useProjectManager';
import RNFS from 'react-native-fs';

export const BackupWorkflow = () => {
  const { theme } = useTheme();
  const { getTasks } = useTaskManager();
  const { projects } = useProjectManager();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportData = async (format: 'json' | 'csv') => {
    setIsExporting(true);
    
    try {
      const tasks = getTasks();
      const exportData = {
        tasks,
        projects,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      let content: string;
      let filename: string;

      if (format === 'json') {
        content = JSON.stringify(exportData, null, 2);
        filename = `taskflow_backup_${new Date().toISOString().split('T')[0]}.json`;
      } else {
        // CSV format
        const csvHeaders = 'Title,Description,Priority,Status,Due Date,Project,Labels,Created At\n';
        const csvRows = tasks.map(task => [
          task.title,
          task.description || '',
          task.priority,
          task.status,
          task.dueAt?.toISOString() || '',
          task.projectId?.toString() || '',
          task.labels.join(';'),
          task.createdAt.toISOString()
        ].map(field => `"${field}"`).join(',')).join('\n');
        
        content = csvHeaders + csvRows;
        filename = `taskflow_export_${new Date().toISOString().split('T')[0]}.csv`;
      }

      const documentsPath = RNFS.DocumentDirectoryPath;
      const success = await exportBackup({
        path: documentsPath,
        data: exportData,
        filename
      });

      if (success) {
        Alert.alert(
          'Export Successful',
          `File saved to: ${documentsPath}/${filename}`,
          [
            { text: 'OK' },
            { text: 'Share', onPress: () => shareFile(`${documentsPath}/${filename}`) }
          ]
        );
      } else {
        // Try alternate paths
        const alternatePaths = getAlternatePaths();
        showPathSelector(alternatePaths, content, filename);
      }
    } catch (error) {
      Alert.alert('Export Failed', 'Unable to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const showPathSelector = (paths: string[], content: string, filename: string) => {
    const buttons = paths.map(path => ({
      text: path.split('/').pop() || 'Folder',
      onPress: () => exportBackup({ path, data: content, filename })
    }));
    
    buttons.push({ text: 'Cancel', onPress: () => {} });
    
    Alert.alert('Choose Export Location', 'Select where to save the backup:', buttons);
  };

  const shareFile = async (filePath: string) => {
    // Placeholder for sharing functionality
    console.log('Share file:', filePath);
  };

  const importData = async () => {
    setIsImporting(true);
    
    try {
      // Placeholder for file picker
      const filePath = `${RNFS.DocumentDirectoryPath}/taskflow_backup.json`;
      
      const importedData = await importBackup({
        filePath,
        currentVersion: '1.0.0'
      });

      if (importedData.readOnly) {
        Alert.alert(
          'Preview Mode',
          'Data loaded in read-only mode due to version mismatch. No changes will be saved.'
        );
      } else {
        Alert.alert(
          'Import Successful',
          `Imported ${importedData.tasks?.length || 0} tasks and ${importedData.projects?.length || 0} projects.`
        );
      }
    } catch (error) {
      Alert.alert('Import Failed', 'Unable to import data. Please check the file and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Backup & Export</Text>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Export Data</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Save your tasks and projects to device storage
        </Text>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: theme.primary }]}
            onPress={() => exportData('json')}
            disabled={isExporting}
          >
            <Text style={styles.buttonText}>
              {isExporting ? 'Exporting...' : 'Export JSON'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: theme.success }]}
            onPress={() => exportData('csv')}
            disabled={isExporting}
          >
            <Text style={styles.buttonText}>
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Import Data</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Restore tasks and projects from a backup file
        </Text>
        
        <TouchableOpacity
          style={[styles.importButton, { backgroundColor: theme.warning }]}
          onPress={importData}
          disabled={isImporting}
        >
          <Text style={styles.buttonText}>
            {isImporting ? 'Importing...' : 'Import Backup'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.infoBox, { backgroundColor: theme.surface }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>Backup Information</Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          • JSON format preserves all data and relationships{'\n'}
          • CSV format is compatible with spreadsheet applications{'\n'}
          • Backups are saved to your device's Documents folder{'\n'}
          • Import supports automatic data migration between versions
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  description: { fontSize: 14, marginBottom: 16, lineHeight: 20 },
  buttonGroup: { flexDirection: 'row', gap: 12 },
  exportButton: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center' },
  importButton: { padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  infoBox: { padding: 16, borderRadius: 8 },
  infoTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  infoText: { fontSize: 14, lineHeight: 20 }
});