import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const hashPassword = (password: string): string => {
  // Simple hash for demo - use proper hashing in production
  return btoa(password + 'salt');
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export const storeCredentials = async (email: string, password: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('credentials', JSON.stringify({ email, password }));
  } catch (error) {
    console.error('Failed to store credentials:', error);
  }
};

export const getStoredCredentials = async (): Promise<{ email: string; password: string } | null> => {
  try {
    const stored = await AsyncStorage.getItem('credentials');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get credentials:', error);
    return null;
  }
};

export const clearStoredCredentials = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('credentials');
  } catch (error) {
    console.error('Failed to clear credentials:', error);
  }
};

export const setCurrentUser = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('currentUserId', userId);
  } catch (error) {
    console.error('Failed to set current user:', error);
  }
};

export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('currentUserId');
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

export const clearCurrentUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('currentUserId');
  } catch (error) {
    console.error('Failed to clear current user:', error);
  }
};

export const isBiometricSupported = async (): Promise<boolean> => {
  // Mock implementation - would use react-native-biometrics in real app
  return false;
};

export const authenticateWithBiometric = async (): Promise<boolean> => {
  // Mock implementation
  return new Promise((resolve) => {
    Alert.alert(
      'Biometric Authentication',
      'Biometric authentication not implemented in demo',
      [{ text: 'OK', onPress: () => resolve(false) }]
    );
  });
};