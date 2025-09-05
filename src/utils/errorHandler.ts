import { Alert } from 'react-native';

export const handleError = (error: any, context: string = 'Operation') => {
  console.error(`${context} Error:`, error);
  
  let message = 'An unexpected error occurred';
  
  if (error?.message) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  Alert.alert(`${context} Failed`, message, [{ text: 'OK' }]);
};