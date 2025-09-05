import Realm from 'realm';
import { Todo } from '../models/Todo';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Subtask } from '../models/Subtask';
import { UserStats } from '../models/UserStats';
import { MemoryItem, MemoryCategory } from '../models/MemoryBank';

export const validateDatabaseIntegrity = async (): Promise<void> => {
  try {
    const realm = await Realm.open({
      schema: [Todo.schema, User.schema, Project.schema, Subtask.schema, UserStats.schema, MemoryItem.schema, MemoryCategory.schema],
      schemaVersion: 9,
    });
    
    // Basic validation - check if schemas are accessible
    realm.objects('Todo');
    realm.objects('User');
    realm.objects('Project');
    
    realm.close();
  } catch (error) {
    console.error('Database validation failed:', error);
  }
};

export const cleanupOldData = async (): Promise<void> => {
  try {
    const realm = await Realm.open({
      schema: [Todo.schema, User.schema, Project.schema, Subtask.schema, UserStats.schema, MemoryItem.schema, MemoryCategory.schema],
      schemaVersion: 9,
    });
    
    // Clean up completed todos older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const oldCompletedTodos = realm.objects<Todo>('Todo')
      .filtered('completed == true AND updatedAt < $0', thirtyDaysAgo);
    
    if (oldCompletedTodos.length > 0) {
      realm.write(() => {
        realm.delete(oldCompletedTodos);
      });
    }
    
    realm.close();
  } catch (error) {
    console.error('Data cleanup failed:', error);
  }
};