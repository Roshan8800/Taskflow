import RNFS from 'react-native-fs';
import { Alert } from 'react-native';

interface BackupData {
  version: string;
  timestamp: string;
  data: any;
}

interface ExportOptions {
  path: string;
  data: any;
  filename?: string;
}

interface ImportOptions {
  filePath: string;
  currentVersion: string;
}

export const exportBackup = async (options: ExportOptions): Promise<boolean> => {
  try {
    const { path, data, filename = 'taskflow_backup.json' } = options;
    const fullPath = `${path}/${filename}`;
    
    // Check if path is writable
    const pathExists = await RNFS.exists(path);
    if (!pathExists) {
      try {
        await RNFS.mkdir(path);
      } catch (error) {
        showPathError(path);
        return false;
      }
    }

    // Test write permission
    try {
      await RNFS.writeFile(`${path}/test_write.tmp`, 'test');
      await RNFS.unlink(`${path}/test_write.tmp`);
    } catch (error) {
      showPathError(path);
      return false;
    }

    const backup: BackupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      data
    };

    await RNFS.writeFile(fullPath, JSON.stringify(backup, null, 2));
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
};

const showPathError = (path: string) => {
  Alert.alert(
    'Export Error',
    `Cannot write to ${path}. Please choose a different location.`,
    [
      { text: 'OK' },
      { 
        text: 'Try Documents', 
        onPress: () => {
          // Suggest alternate path
          const documentsPath = RNFS.DocumentDirectoryPath;
          console.log('Suggested path:', documentsPath);
        }
      }
    ]
  );
};

export const importBackup = async (options: ImportOptions): Promise<any> => {
  try {
    const { filePath, currentVersion } = options;
    
    // Check if file exists
    const fileExists = await RNFS.exists(filePath);
    if (!fileExists) {
      throw new Error('Backup file not found');
    }

    // Read and parse backup file
    const fileContent = await RNFS.readFile(filePath);
    const backup: BackupData = JSON.parse(fileContent);
    
    // Check schema version
    if (backup.version !== currentVersion) {
      return await handleVersionMismatch(backup, currentVersion);
    }

    return backup.data;
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
};

const handleVersionMismatch = async (
  backup: BackupData, 
  currentVersion: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      'Version Mismatch',
      `Backup version (${backup.version}) differs from current version (${currentVersion}).`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => reject(new Error('Import cancelled')) },
        { 
          text: 'Safe Migration', 
          onPress: () => {
            try {
              const migratedData = performSafeMigration(backup, currentVersion);
              resolve(migratedData);
            } catch (error) {
              reject(error);
            }
          }
        },
        { 
          text: 'Preview Only', 
          onPress: () => {
            // Return read-only preview
            resolve({ ...backup.data, readOnly: true });
          }
        }
      ]
    );
  });
};

const performSafeMigration = (backup: BackupData, targetVersion: string): any => {
  const data = { ...backup.data };
  
  // Example migration logic
  if (backup.version === '0.9.0' && targetVersion === '1.0.0') {
    // Migrate from 0.9.0 to 1.0.0
    if (data.tasks) {
      data.tasks = data.tasks.map((task: any) => ({
        ...task,
        // Add new fields with defaults
        repeatRule: task.repeatRule || null,
        parentTaskId: task.parentTaskId || null
      }));
    }
  }
  
  return data;
};

export const validateBackupFile = async (filePath: string): Promise<boolean> => {
  try {
    const fileContent = await RNFS.readFile(filePath);
    const backup = JSON.parse(fileContent);
    
    // Basic validation
    return !!(backup.version && backup.timestamp && backup.data);
  } catch (error) {
    return false;
  }
};

export const getAlternatePaths = (): string[] => {
  return [
    RNFS.DocumentDirectoryPath,
    RNFS.DownloadDirectoryPath,
    RNFS.ExternalDirectoryPath
  ].filter(Boolean);
};