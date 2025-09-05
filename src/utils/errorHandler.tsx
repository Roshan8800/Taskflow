import { Alert } from 'react-native';

export const handleError = (error: any, context: string = 'Application'): void => {
  console.error(`${context} Error:`, error);
  
  const errorMessage = error?.message || 'An unexpected error occurred';
  
  Alert.alert(
    'Error',
    `${context}: ${errorMessage}`,
    [{ text: 'OK' }]
  );
};