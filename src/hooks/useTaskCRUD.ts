import { useState, useEffect } from 'react';
import { getRealm } from '../database/db';
import { Todo } from '../models/Todo';
import Realm from 'realm';

export const useTaskCRUD = () => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [searchIndex, setSearchIndex] = useState<Map<string, Todo[]>>(new Map());

  // Optimistic UI update
  const optimisticUpdate = (taskId: string, updates: Partial<Todo>) => {
    setTasks(prev => prev.map(task => 
      task._id.toString() === taskId ? { ...task, ...updates } : task
    ));
  };

  // Local DB write with background index refresh
  const updateTask = async (taskId: string, updates: Partial<Todo>) => {
    // Optimistic UI update first
    optimisticUpdate(taskId, updates);
    
    try {
      const realm = await getRealm();
      realm.write(() => {
        const task = realm.objectForPrimaryKey<Todo>('Todo', new Realm.BSON.ObjectId(taskId));
        if (task) {
          Object.assign(task, { ...updates, updatedAt: new Date() });
        }
      });
      
      // Background index refresh
      setTimeout(() => refreshSearchIndex(), 0);
    } catch (error) {
      // Revert optimistic update on error
      loadTasks();
      throw error;
    }
  };

  const refreshSearchIndex = async () => {
    const realm = await getRealm();
    const allTasks = Array.from(realm.objects<Todo>('Todo'));
    const index = new Map<string, Todo[]>();
    
    allTasks.forEach(task => {
      const searchTerms = [
        task.title,
        task.description || '',
        ...task.labels,
        // Add project name when available
      ].join(' ').toLowerCase();
      
      const words = searchTerms.split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) {
          const existing = index.get(word) || [];
          index.set(word, [...existing, task]);
        }
      });
    });
    
    setSearchIndex(index);
  };

  const loadTasks = async () => {
    const realm = await getRealm();
    const allTasks = Array.from(realm.objects<Todo>('Todo'));
    setTasks(allTasks);
  };

  useEffect(() => {
    loadTasks();
    refreshSearchIndex();
  }, []);

  return { tasks, updateTask, optimisticUpdate, searchIndex, refreshSearchIndex };
};