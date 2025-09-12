import { useState } from 'react';
import { Alert, Share } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import CryptoJS from 'crypto-js';
import { getRealm } from '../database/db';
import { useAuth } from './useAuth';
import { handleError } from '../utils/errorHandler';

export const useBackup = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const ENCRYPTION_KEY = 'TaskFlow_Secure_Key_2024';

  const exportBackup = async (format: 'json' | 'csv', encrypted: boolean = true) => {
    try {
      setLoading(true);
      const realm = await getRealm();
      
      const tasks = Array.from(realm.objects('Todo').filtered('userId == $0', user?.id || ''));
      const projects = Array.from(realm.objects('Project'));
      
      const backupData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        user: user?.email || 'unknown',
        tasks: tasks.map(task => ({
          id: task._id.toString(),
          title: task.title,
          description: task.description,
          completed: task.completed,
          priority: task.priority,
          projectId: task.project,
          labels: task.labels,
          color: task.color,
          dueAt: task.dueAt?.toISOString(),
          reminderDate: task.reminderDate?.toISOString(),
          notes: task.notes,
          isRecurring: task.isRecurring,
          recurringType: task.recurringType,
          createdAt: task.createdAt instanceof Date ? task.createdAt.toISOString() : '',
          updatedAt: task.updatedAt instanceof Date ? task.updatedAt.toISOString() : '',
        })),
        projects: projects.map(projectId => ({
          id: projectId._id.toString(),
          name: projectId.name,
          description: projectId.description,
          color: projectId.color,
          icon: projectId.icon,
          createdAt: projectId.createdAt instanceof Date ? projectId.createdAt.toISOString() : '',
        })),
      };

      let exportContent = '';
      
      if (format === 'csv') {
        exportContent = convertToCSV(backupData.tasks);
      } else {
        exportContent = JSON.stringify(backupData, null, 2);
      }

      if (encrypted && format === 'json') {
        exportContent = CryptoJS.AES.encrypt(exportContent, ENCRYPTION_KEY).toString();
      }

      await Share.share({
        message: exportContent,
        title: `TaskFlow Backup ${format.toUpperCase()} - ${new Date().toLocaleDateString()}`,
      });

    } catch (error) {
      handleError(error, 'Export Backup');
    } finally {
      setLoading(false);
    }
  };

  const importBackup = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const fileContent = await RNFS.readFile(result[0].uri, 'utf8');
      let backupData;

      try {
        // Try to decrypt if encrypted
        const decrypted = CryptoJS.AES.decrypt(fileContent, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        backupData = JSON.parse(decrypted);
      } catch {
        // If decryption fails, try parsing as plain JSON
        backupData = JSON.parse(fileContent);
      }

      if (!backupData.tasks || !Array.isArray(backupData.tasks)) {
        throw new Error('Invalid backup file format');
      }

      Alert.alert(
        'Import Backup',
        `Found ${backupData.tasks.length} tasks and ${backupData.projectIds?.length || 0} projects. This will replace your current data.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Import', onPress: () => performImport(backupData) }]
      );

    } catch (error) {
      handleError(error, 'Import Backup');
    } finally {
      setLoading(false);
    }
  };

  const performImport = async (backupData: any) => {
    try {
      const realm = await getRealm();
      
      realm.write(() => {
        // Clear existing data
        const existingTasks = realm.objects('Todo').filtered('userId == $0', user?.id || '');
        const existingProjects = realm.objects('Project');
        realm.delete(existingTasks);
        realm.delete(existingProjects);

        // Import projects
        if (backupData.projectIds) {
          backupData.projectIds.forEach((projectId: any) => {
            realm.create('Project', {
              _id: new realm.BSON.ObjectId(),
              name: projectId.name,
              description: projectId.description || '',
              color: projectId.color,
              icon: projectId.icon,
              isArchived: false,
              createdAt: new Date(projectId.createdAt),
              updatedAt: new Date(),
            });
          });
        }

        // Import tasks
        backupData.tasks.forEach((task: any) => {
          realm.create('Todo', {
            _id: new realm.BSON.ObjectId(),
            title: task.title,
            description: task.description || '',
            completed: task.completed,
            priority: task.priority || 'medium',
            projectId: task.project || '',
            labels: task.labels || [],
            color: task.color || '#4A90E2',
            dueAt: task.dueAt ? new Date(task.dueAt) : null,
            reminderDate: task.reminderDate ? new Date(task.reminderDate) : null,
            notes: task.notes || '',
            isRecurring: task.isRecurring || false,
            recurringType: task.recurringType,
            attachments: [],
            isArchived: false,
            isDeleted: false,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            userId: user?.id || '',
          });
        });
      });

      Alert.alert('Success', 'Backup imported successfully');
    } catch (error) {
      handleError(error, 'Importing Data');
    }
  };

  const convertToCSV = (tasks: any[]) => {
    const headers = ['Title', 'Description', 'Completed', 'Priority', 'Project', 'Labels', 'Due Date', 'Created'];
    const rows = tasks.map(task => [
      `"${task.title}"`,
      `"${task.description || ''}"`,
      task.completed,
      task.priority,
      task.project || '',
      `"${task.labels?.join(', ') || ''}"`,
      task.dueAt || '',
      task.createdAt]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const syncData = async () => {
    try {
      setLoading(true);
      // Mock sync - in real app would sync with cloud service
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Sync Complete', 'Data synchronized successfully');
    } catch (error) {
      handleError(error, 'Data Sync');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    exportBackup,
    importBackup,
    syncData,
  };
};