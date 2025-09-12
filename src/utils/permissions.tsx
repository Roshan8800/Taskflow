import { Platform, PermissionsAndroid, Alert } from 'react-native';

export const checkPermissions = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]);

      if (
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] !== PermissionsAndroid.RESULTS.GRANTED ||
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        Alert.alert(
          'Permissions Required',
          'TaskFlow needs storage permissions to backup your data locally.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.warn('Permission request failed:', error);
    }
  }
};