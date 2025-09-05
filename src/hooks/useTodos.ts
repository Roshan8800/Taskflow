import { useState, useEffect } from 'react';
import { BSON } from 'realm';
import { getRealm } from '../database/db';
import { Todo } from '../models/Todo';
import { useAuth } from './useAuth';
import { handleError } from '../utils/errorHandler';

export const useTodos = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTodos();
    }
  }, [user]);

  const loadTodos = async () => {
    try {
      const realm = await getRealm();
      const userTodos = realm.objects<Todo>('Todo')
        .filtered('userId == $0', user?.id || '')
        .sorted('createdAt', true);
      
      setTodos(Array.from(userTodos));
    } catch (error) {
      handleError(error, 'Loading Todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (data: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    project?: string;
    dueDate?: Date;
  }) => {
    try {
      const realm = await getRealm();
      
      realm.write(() => {
        realm.create<Todo>('Todo', {
          _id: new BSON.ObjectId(),
          title: data.title,
          description: data.description || '',
          completed: false,
          priority: data.priority,
          project: data.project || '',
          dueDate: data.dueDate,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user?.id || '',
        });
      });

      await loadTodos();
    } catch (error) {
      handleError(error, 'Adding Todo');
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const realm = await getRealm();
      const todo = realm.objectForPrimaryKey<Todo>('Todo', new BSON.ObjectId(id));
      
      if (todo) {
        realm.write(() => {
          Object.assign(todo, { ...updates, updatedAt: new Date() });
        });
        await loadTodos();
      }
    } catch (error) {
      handleError(error, 'Updating Todo');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const realm = await getRealm();
      const todo = realm.objectForPrimaryKey<Todo>('Todo', new BSON.ObjectId(id));
      
      if (todo) {
        realm.write(() => {
          realm.delete(todo);
        });
        await loadTodos();
      }
    } catch (error) {
      handleError(error, 'Deleting Todo');
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const realm = await getRealm();
      const todo = realm.objectForPrimaryKey<Todo>('Todo', new BSON.ObjectId(id));
      
      if (todo) {
        realm.write(() => {
          todo.completed = !todo.completed;
          todo.updatedAt = new Date();
        });
        await loadTodos();
      }
    } catch (error) {
      handleError(error, 'Toggling Todo');
    }
  };

  return {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    loadTodos,
  };
};