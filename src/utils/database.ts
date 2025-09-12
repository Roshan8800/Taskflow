import { getRealm } from '../database/db';
import { Project } from '../models/Project';
import { MemoryCategory } from '../models/MemoryBank';
import { BSON } from 'realm';

export const initializeDefaultData = async (userId: string): Promise<void> => {
  try {
    const realm = await getRealm();
    
    realm.write(() => {
      realm.create<Project>('Project', {
        _id: new BSON.ObjectId(),
        name: 'Personal',
        description: 'Personal tasks and goals',
        color: '#4A90E2',
        userId,
        createdAt: new Date(),
      });

      const categories = [
        { name: 'Work', color: '#FF6B6B', icon: '💼' },
        { name: 'Personal', color: '#4ECDC4', icon: '👤' },
        { name: 'Ideas', color: '#FFD93D', icon: '💡' },
        { name: 'Notes', color: '#96CEB4', icon: '📝' }];

      categories.forEach(cat => {
        realm.create<MemoryCategory>('MemoryCategory', {
          _id: new BSON.ObjectId(),
          name: cat.name,
          color: cat.color,
          icon: cat.icon,
          userId,
        });
      });
    });
  } catch (error) {
    console.error('Failed to initialize default data:', error);
  }
};

export const validateDatabaseIntegrity = async (): Promise<void> => {
  try {
    const realm = await getRealm();
    realm.objects('Todo');
    realm.objects('User');
    realm.objects('Project');
  } catch (error) {
    console.error('Database validation failed:', error);
  }
};

export const cleanupOldData = async (): Promise<void> => {
  try {
    const realm = await getRealm();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const oldCompletedTodos = realm.objects('Todo')
      .filtered('completed == true AND updatedAt < $0', thirtyDaysAgo);
    
    if (oldCompletedTodos.length > 0) {
      realm.write(() => {
        realm.delete(oldCompletedTodos);
      });
    }
  } catch (error) {
    console.error('Data cleanup failed:', error);
  }
};