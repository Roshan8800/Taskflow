import { Todo } from '../models/Todo';
import { getTaskStatus } from './taskFilters';

interface SortWeights {
  status: { [key: string]: number };
  priority: { [key: string]: number };
}

const SORT_WEIGHTS: SortWeights = {
  status: {
    overdue: 100,
    pending: 50,
    completed: 10,
    cancelled: 5
  },
  priority: {
    urgent: 40,
    high: 30,
    medium: 20,
    low: 10
  }
};

export const smartSort = (tasks: Todo[]): Todo[] => {
  return tasks.sort((a, b) => {
    // 1. Status weight (overdue tasks first)
    const statusA = getTaskStatus(a);
    const statusB = getTaskStatus(b);
    const statusWeightDiff = (SORT_WEIGHTS.status[statusB] || 0) - (SORT_WEIGHTS.status[statusA] || 0);
    if (statusWeightDiff !== 0) return statusWeightDiff;

    // 2. Due date (earlier dates first)
    if (a.dueAt && b.dueAt) {
      const dueDateDiff = a.dueAt.getTime() - b.dueAt.getTime();
      if (dueDateDiff !== 0) return dueDateDiff;
    }
    if (a.dueAt && !b.dueAt) return -1;
    if (!a.dueAt && b.dueAt) return 1;

    // 3. Priority weight (higher priority first)
    const priorityWeightDiff = (SORT_WEIGHTS.priority[b.priority] || 0) - (SORT_WEIGHTS.priority[a.priority] || 0);
    if (priorityWeightDiff !== 0) return priorityWeightDiff;

    // 4. Recency (newer tasks first)
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
};

export const getTodayTasks = (tasks: Todo[]): Todo[] => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  return tasks.filter(task => {
    // Exclude archived tasks
    if (task.archived || task.deletedAt) return false;

    // Include overdue tasks
    if (task.dueAt && task.dueAt < startOfDay && task.status !== 'completed') {
      return true;
    }

    // Include tasks due today
    if (task.dueAt && task.dueAt >= startOfDay && task.dueAt <= endOfDay) {
      return true;
    }

    return false;
  });
};

export const sortTasks = (tasks: Todo[], sortType: 'smart' | 'dueDate' | 'priority' | 'created'): Todo[] => {
  switch (sortType) {
    case 'smart':
      return smartSort(tasks);
    
    case 'dueDate':
      return tasks.sort((a, b) => {
        if (a.dueAt && b.dueAt) return a.dueAt.getTime() - b.dueAt.getTime();
        if (a.dueAt && !b.dueAt) return -1;
        if (!a.dueAt && b.dueAt) return 1;
        return 0;
      });
    
    case 'priority':
      return tasks.sort((a, b) => 
        (SORT_WEIGHTS.priority[b.priority] || 0) - (SORT_WEIGHTS.priority[a.priority] || 0)
      );
    
    case 'created':
      return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    default:
      return tasks;
  }
};