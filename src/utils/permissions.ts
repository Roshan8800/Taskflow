import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

export interface PermissionResult {
  granted: boolean;
  message?: string;
}

export const checkStoragePermissions = async (): Promise<PermissionResult> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);

      const writeGranted = granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;
      const readGranted = granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;

      if (!writeGranted || !readGranted) {
        return {
          granted: false,
          message: 'Storage permissions are required for backup functionality'
        };
      }

      return { granted: true };
    } catch (error) {
      return {
        granted: false,
        message: 'Failed to request storage permissions'
      };
    }
  }
  
  return { granted: true };
};

export const checkNotificationPermissions = async (): Promise<PermissionResult> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return {
          granted: false,
          message: 'Notification permissions are required for task reminders'
        };
      }

      return { granted: true };
    } catch (error) {
      return {
        granted: false,
        message: 'Failed to request notification permissions'
      };
    }
  }
  
  return { granted: true };
};

export const checkPermissions = async (): Promise<void> => {
  const storageResult = await checkStoragePermissions();
  const notificationResult = await checkNotificationPermissions();

  if (!storageResult.granted || !notificationResult.granted) {
    Alert.alert(
      'Permissions Required',
      'TaskFlow needs certain permissions to function properly. Please grant them in settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() }
      ]
    );
  }
};

export const requestPermissionWithRationale = async (
  permission: string,
  rationale: string
): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) return true;

      const shouldShow = await PermissionsAndroid.shouldShowRequestPermissionRationale(permission);
      
      if (shouldShow) {
        return new Promise((resolve) => {
          Alert.alert(
            'Permission Required',
            rationale,
            [
              { text: 'Cancel', onPress: () => resolve(false) },
              {
                text: 'Grant Permission',
                onPress: async () => {
                  const result = await PermissionsAndroid.request(permission);
                  resolve(result === PermissionsAndroid.RESULTS.GRANTED);
                }
              }
            ]
          );
        });
      } else {
        const result = await PermissionsAndroid.request(permission);
        return result === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }
  
  return true;
};