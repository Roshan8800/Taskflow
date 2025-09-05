export const APP_CONFIG = {
  name: 'TaskFlow',
  version: '1.0.0',
  author: 'Roshan',
  maxTaskTitleLength: 200,
  maxUsernameLength: 50,
  minPasswordLength: 6,
  maxStreakDays: 365,
  defaultPriority: 'medium' as const,
  defaultStatus: 'todo' as const,
};

export const PRIORITIES = ['low', 'medium', 'high'] as const;
export const STATUSES = ['todo', 'inprogress', 'done'] as const;

export const COLORS = {
  priority: {
    low: '#10B981',
    medium: '#F59E0B', 
    high: '#EF4444',
  },
  status: {
    todo: '#EF4444',
    inprogress: '#F59E0B',
    done: '#10B981',
  },
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Please check your internet connection',
  STORAGE_ERROR: 'Unable to save data. Please try again',
  VALIDATION_ERROR: 'Please check your input and try again',
  PERMISSION_DENIED: 'Permission required to continue',
  UNKNOWN_ERROR: 'An unexpected error occurred',
};