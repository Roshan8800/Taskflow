import { Share, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRealm } from '../database/db';
import { checkStoragePermissions } from './permissions';
import { handleError } from './errorHandler';

export interface BackupData {
  version: string;
  timestamp: string;
  user: any;
  todos: any[];
  projects: any[];
  stats: any;
  settings: any;
}

export const createBackup = async (): Promise<string | null> => {
  try {
    const permissionResult = await checkStoragePermissions();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', permissionResult.message || 'Storage permission needed');
      return null;
    }

    const realm = await getRealm();
    
    // Collect all data
    const todos = Array.from(realm.objects('Todo')).map(todo => ({
      id: todo._id.toString(),
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      priority: todo.priority,
      project: todo.project,
      dueDate: todo.dueDate?.toISOString(),
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
      userId: todo.userId,
    }));

    const projects = Array.from(realm.objects('Project')).map(project => ({
      id: project._id.toString(),
      name: project.name,
      description: project.description,
      color: project.color,
      createdAt: project.createdAt.toISOString(),
      userId: project.userId,
    }));

    const stats = Array.from(realm.objects('UserStats')).map(stat => ({
      id: stat._id.toString(),
      userId: stat.userId,
      totalTasks: stat.totalTasks,
      completedTasks: stat.completedTasks,
      currentStreak: stat.currentStreak,
      longestStreak: stat.longestStreak,
      totalFocusTime: stat.totalFocusTime,
    }));

    const settings = await AsyncStorage.getItem('app_settings') || '{}';

    const backupData: BackupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      user: null, // Add user data if needed
      todos,
      projects,
      stats: stats[0] || null,
      settings: JSON.parse(settings),
    };

    const backupString = JSON.stringify(backupData, null, 2);
    
    // Store locally
    await AsyncStorage.setItem('latest_backup', backupString);
    
    return backupString;
  } catch (error) {
    handleError(error, 'Creating Backup');
    return null;
  }
};

export const shareBackup = async (): Promise<void> => {
  try {
    const backupString = await createBackup();
    if (!backupString) return;

    await Share.share({
      message: backupString,
      title: 'TaskFlow Backup',
    });
  } catch (error) {
    handleError(error, 'Sharing Backup');
  }
};

export const restoreFromBackup = async (backupString: string): Promise<boolean> => {
  try {
    const backupData: BackupData = JSON.parse(backupString);
    
    if (!backupData.version || !backupData.todos) {
      throw new Error('Invalid backup format');
    }

    const realm = await getRealm();
    
    // Clear existing data (with confirmation)
    return new Promise((resolve) => {
      Alert.alert(
        'Restore Backup',
        'This will replace all current data. Are you sure?',
        [
          { text: 'Cancel', onPress: () => resolve(false) },
          {
            text: 'Restore',
            style: 'destructive',
            onPress: async () => {
              try {
                realm.write(() => {
                  realm.deleteAll();
                });

                // Restore data
                // Implementation would recreate all objects from backup
                
                await AsyncStorage.setItem('app_settings', JSON.stringify(backupData.settings));
                resolve(true);
              } catch (error) {
                handleError(error, 'Restoring Backup');
                resolve(false);
              }
            }
          }
        ]
      );
    });
  } catch (error) {
    handleError(error, 'Parsing Backup');
    return false;
  }
};

export const exportToCSV = async (): Promise<void> => {
  try {
    const realm = await getRealm();
    const todos = Array.from(realm.objects('Todo'));
    
    const csvHeader = 'Title,Description,Completed,Priority,Project,Due Date,Created Date\n';
    const csvRows = todos.map(todo => 
      `"${todo.title}","${todo.description || ''}","${todo.completed}","${todo.priority}","${todo.project || ''}","${todo.dueDate?.toLocaleDateString() || ''}","${todo.createdAt.toLocaleDateString()}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    
    await Share.share({
      message: csvContent,
      title: 'TaskFlow Tasks (CSV)',
    });
  } catch (error) {
    handleError(error, 'Exporting CSV');
  }
};