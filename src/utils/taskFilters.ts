import { Todo } from '../models/Todo';

export const filterTasks = {
  // Active tasks (not deleted, not archived)
  active: (tasks: Todo[]) => 
    tasks.filter(task => !task.deletedAt && !task.archived),

  // Deleted tasks (for Recycle Bin)
  deleted: (tasks: Todo[]) => 
    tasks.filter(task => task.deletedAt !== null),

  // Archived tasks
  archived: (tasks: Todo[]) => 
    tasks.filter(task => task.archived && !task.deletedAt),

  // Overdue tasks
  overdue: (tasks: Todo[]) => 
    tasks.filter(task => 
      !task.deletedAt && 
      !task.archived && 
      task.dueAt && 
      task.dueAt < new Date() && 
      task.status !== 'completed'
    ),

  // Completed tasks
  completed: (tasks: Todo[]) => 
    tasks.filter(task => 
      !task.deletedAt && 
      task.status === 'completed'
    ),
};

export const getTaskStatus = (task: Todo): 'overdue' | 'completed' | 'pending' | 'cancelled' => {
  if (task.status === 'completed') return 'completed';
  if (task.status === 'cancelled') return 'cancelled';
  
  if (task.dueAt && task.dueAt < new Date() && task.status !== 'completed') {
    return 'overdue';
  }
  
  return 'pending';
};