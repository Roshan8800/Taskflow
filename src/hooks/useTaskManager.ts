import { useState, useEffect } from 'react';
import { BSON } from 'realm';
import { getRealm } from '../database/db';
import { Todo } from '../models/Todo';
import { useAuth } from './useAuth';
import { handleError } from '../utils/errorHandler';
import { scheduleNotification, cancelNotification } from '../utils/notifications';
import { filterTasks, getTaskStatus } from '../utils/taskFilters';
import { createNextOccurrence, RepeatRule } from '../utils/repeatLogic';

export interface TaskFilters {
  priority?: string[];
  labels?: string[];
  project?: string;
  dueDateRange?: { start: Date; end: Date };
  completed?: boolean;
  archived?: boolean;
}

export interface TaskSort {
  field: 'dueDate' | 'priority' | 'createdAt' | 'title';
  direction: 'asc' | 'desc';
}

export const useTaskManager = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sort, setSort] = useState<TaskSort>({ field: 'dueDate', direction: 'asc' });

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, filters, sort]);

  const loadTasks = async () => {
    try {
      const realm = await getRealm();
      let query = 'userId == $0 AND isDeleted == false';
      const params: any[] = [user?.id || ''];

      if (filters.completed !== undefined) {
        query += ' AND completed == $' + params.length;
        params.push(filters.completed);
      }

      if (filters.archived !== undefined) {
        query += ' AND isArchived == $' + params.length;
        params.push(filters.archived);
      }

      if (filters.project) {
        query += ' AND project == $' + params.length;
        params.push(filters.project);
      }

      if (filters.priority?.length) {
        query += ' AND priority IN {' + filters.priority.map(p => `"${p}"`).join(',') + '}';
      }

      const userTasks = realm.objects<Todo>('Todo')
        .filtered(query, ...params)
        .sorted(sort.field, sort.direction === 'desc');
      
      let filteredTasks = Array.from(userTasks);

      // Filter by labels
      if (filters.labels?.length) {
        filteredTasks = filteredTasks.filter(task => 
          filters.labels!.some(label => task.labels.includes(label))
        );
      }

      // Filter by due date range
      if (filters.dueDateRange) {
        filteredTasks = filteredTasks.filter(task => 
          task.dueDate && 
          task.dueDate >= filters.dueDateRange!.start && 
          task.dueDate <= filters.dueDateRange!.end
        );
      }

      setTasks(filteredTasks);
    } catch (error) {
      handleError(error, 'Loading Tasks');
    } finally {
      setLoading(false);
    }
  };

  // 1. Add/Edit/Delete tasks
  const addTask = async (taskData: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    project?: string;
    labels?: string[];
    color?: string;
    dueDate?: Date;
    reminderDate?: Date;
    notes?: string;
    isRecurring?: boolean;
    recurringType?: 'daily' | 'weekly' | 'monthly' | 'custom';
    recurringDays?: number[];
    recurringInterval?: number;
  }) => {
    try {
      const realm = await getRealm();
      
      realm.write(() => {
        const task = realm.create<Todo>('Todo', {
          _id: new BSON.ObjectId(),
          title: taskData.title,
          description: taskData.description || '',
          priority: taskData.priority || 'medium',
          project: taskData.project || '',
          labels: taskData.labels || [],
          color: taskData.color || getPriorityColor(taskData.priority || 'medium'),
          dueDate: taskData.dueDate,
          reminderDate: taskData.reminderDate,
          notes: taskData.notes || '',
          isRecurring: taskData.isRecurring || false,
          recurringType: taskData.recurringType,
          recurringDays: taskData.recurringDays || [],
          recurringInterval: taskData.recurringInterval,
          attachments: [],
          completed: false,
          isArchived: false,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user?.id || '',
        });

        // Schedule reminder if set
        if (taskData.reminderDate) {
          scheduleNotification({
            id: `task_${task._id.toString()}`,
            title: 'Task Reminder',
            body: taskData.title,
            scheduledTime: taskData.reminderDate,
          });
        }

        // Create recurring instances if needed
        if (taskData.isRecurring) {
          createRecurringInstances(task);
        }
      });

      await loadTasks();
    } catch (error) {
      handleError(error, 'Adding Task');
    }
  };

  const updateTask = async (id: string, updates: Partial<Todo>) => {
    try {
      const realm = await getRealm();
      const task = realm.objectForPrimaryKey<Todo>('Todo', new BSON.ObjectId(id));
      
      if (task) {
        realm.write(() => {
          Object.assign(task, { ...updates, updatedAt: new Date() });
        });

        // Update reminder if changed
        if (updates.reminderDate) {
          await cancelNotification(`task_${id}`);
          await scheduleNotification({
            id: `task_${id}`,
            title: 'Task Reminder',
            body: task.title,
            scheduledTime: updates.reminderDate,
          });
        }

        await loadTasks();
      }
    } catch (error) {
      handleError(error, 'Updating Task');
    }
  };

  const deleteTask = async (id: string, permanent = false) => {
    try {
      const realm = await getRealm();
      const task = realm.objectForPrimaryKey<Todo>('Todo', new BSON.ObjectId(id));
      
      if (task) {
        realm.write(() => {
          if (permanent) {
            realm.delete(task);
          } else {
            task.isDeleted = true;
            task.deletedAt = new Date();
          }
        });

        await cancelNotification(`task_${id}`);
        await loadTasks();
      }
    } catch (error) {
      handleError(error, 'Deleting Task');
    }
  };

  // 2. Recurring tasks
  const createRecurringInstances = (baseTask: Todo) => {
    if (!baseTask.isRecurring || !baseTask.recurringType) return;

    const realm = getRealm();
    const instances = generateRecurringDates(baseTask);
    
    instances.forEach(date => {
      realm.then(r => r.write(() => {
        r.create<Todo>('Todo', {
          _id: new BSON.ObjectId(),
          title: baseTask.title,
          description: baseTask.description,
          priority: baseTask.priority,
          project: baseTask.project,
          labels: baseTask.labels,
          color: baseTask.color,
          dueDate: date,
          notes: baseTask.notes,
          isRecurring: false,
          completed: false,
          isArchived: false,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: baseTask.userId,
        });
      }));
    });
  };

  const generateRecurringDates = (task: Todo): Date[] => {
    const dates: Date[] = [];
    const startDate = task.dueDate || new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3); // Generate 3 months ahead

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      switch (task.recurringType) {
        case 'daily':
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + (task.recurringInterval || 1));
          break;
        case 'weekly':
          if (task.recurringDays?.includes(currentDate.getDay())) {
            dates.push(new Date(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'monthly':
          dates.push(new Date(currentDate));
          currentDate.setMonth(currentDate.getMonth() + (task.recurringInterval || 1));
          break;
      }
    }

    return dates;
  };

  // 9. Snooze task
  const snoozeTask = async (id: string, snoozeUntil: Date) => {
    try {
      await updateTask(id, { snoozeUntil });
    } catch (error) {
      handleError(error, 'Snoozing Task');
    }
  };

  // 10. Archive task
  const archiveTask = async (id: string) => {
    await updateTask(id, { isArchived: true });
  };

  // 11. Recover deleted task
  const recoverTask = async (id: string) => {
    await updateTask(id, { isDeleted: false, deletedAt: undefined });
  };

  // 12. Bulk actions
  const bulkComplete = async (taskIds: string[]) => {
    try {
      const realm = await getRealm();
      
      realm.write(() => {
        taskIds.forEach(id => {
          const task = realm.objectForPrimaryKey<Todo>('Todo', new BSON.ObjectId(id));
          if (task) {
            task.completed = true;
            task.updatedAt = new Date();
          }
        });
      });

      await loadTasks();
    } catch (error) {
      handleError(error, 'Bulk Complete');
    }
  };

  const bulkDelete = async (taskIds: string[]) => {
    try {
      const realm = await getRealm();
      
      realm.write(() => {
        taskIds.forEach(id => {
          const task = realm.objectForPrimaryKey<Todo>('Todo', new BSON.ObjectId(id));
          if (task) {
            task.isDeleted = true;
            task.deletedAt = new Date();
          }
        });
      });

      await loadTasks();
    } catch (error) {
      handleError(error, 'Bulk Delete');
    }
  };

  const bulkMove = async (taskIds: string[], project: string) => {
    try {
      const realm = await getRealm();
      
      realm.write(() => {
        taskIds.forEach(id => {
          const task = realm.objectForPrimaryKey<Todo>('Todo', new BSON.ObjectId(id));
          if (task) {
            task.project = project;
            task.updatedAt = new Date();
          }
        });
      });

      await loadTasks();
    } catch (error) {
      handleError(error, 'Bulk Move');
    }
  };

  // 7. Attachments
  const addAttachment = async (taskId: string, attachment: string) => {
    try {
      const realm = await getRealm();
      const task = realm.objectForPrimaryKey<Todo>('Todo', new BSON.ObjectId(taskId));
      
      if (task) {
        realm.write(() => {
          task.attachments.push(attachment);
          task.updatedAt = new Date();
        });
        await loadTasks();
      }
    } catch (error) {
      handleError(error, 'Adding Attachment');
    }
  };

  const removeAttachment = async (taskId: string, attachmentIndex: number) => {
    try {
      const realm = await getRealm();
      const task = realm.objectForPrimaryKey<Todo>('Todo', new BSON.ObjectId(taskId));
      
      if (task) {
        realm.write(() => {
          task.attachments.splice(attachmentIndex, 1);
          task.updatedAt = new Date();
        });
        await loadTasks();
      }
    } catch (error) {
      handleError(error, 'Removing Attachment');
    }
  };

  // Helper functions
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return '#FF0000';
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFD93D';
      case 'low': return '#6BCF7F';
      default: return '#4A90E2';
    }
  };

  const getDeletedTasks = async (): Promise<Todo[]> => {
    try {
      const realm = await getRealm();
      const deletedTasks = realm.objects<Todo>('Todo')
        .filtered('userId == $0 AND isDeleted == true', user?.id || '');
      return Array.from(deletedTasks);
    } catch (error) {
      handleError(error, 'Loading Deleted Tasks');
      return [];
    }
  };

  const getArchivedTasks = async (): Promise<Todo[]> => {
    try {
      const realm = await getRealm();
      const archivedTasks = realm.objects<Todo>('Todo')
        .filtered('userId == $0 AND isArchived == true AND isDeleted == false', user?.id || '');
      return Array.from(archivedTasks);
    } catch (error) {
      handleError(error, 'Loading Archived Tasks');
      return [];
    }
  };

  return {
    tasks,
    loading,
    filters,
    sort,
    setFilters,
    setSort,
    addTask,
    updateTask,
    deleteTask,
    snoozeTask,
    archiveTask,
    recoverTask,
    bulkComplete,
    bulkDelete,
    bulkMove,
    addAttachment,
    removeAttachment,
    getDeletedTasks,
    getArchivedTasks,
    loadTasks,
    getTasks: () => tasks,
    toggleTask: async (id: string) => {
      const task = tasks.find(t => t._id.toString() === id);
      if (task) {
        const wasCompleted = task.completed;
        const newCompleted = !task.completed;
        
        await updateTask(id, { 
          completed: newCompleted,
          status: newCompleted ? 'completed' : 'pending'
        });
        
        // If task completed and has repeat rule, create next occurrence
        if (!wasCompleted && newCompleted && task.repeatRule) {
          try {
            const repeatRule: RepeatRule = JSON.parse(task.repeatRule);
            const nextTask = createNextOccurrence(task, repeatRule);
            
            if (nextTask) {
              await addTask({
                title: nextTask.title!,
                description: nextTask.description,
                priority: nextTask.priority as any,
                dueDate: nextTask.dueAt,
              });
            }
          } catch (error) {
            console.error('Failed to create next occurrence:', error);
          }
        }
      }
    },
    
    // Task filtering methods
    getActiveTasks: () => filterTasks.active(tasks),
    getDeletedTasksSync: () => filterTasks.deleted(tasks),
    getArchivedTasksSync: () => filterTasks.archived(tasks),
    getOverdueTasks: () => filterTasks.overdue(tasks),
    getCompletedTasks: () => filterTasks.completed(tasks),
    getTaskStatus: (task: Todo) => getTaskStatus(task),
  };
};