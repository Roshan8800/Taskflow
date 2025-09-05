import { useState, useEffect } from 'react';
import Realm from 'realm';
import { MemoryItem, MemoryCategory } from '../models/MemoryBank';
import { useAuth } from './useAuth';

export const useMemoryBank = () => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [categories, setCategories] = useState<MemoryCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadMemories();
    loadCategories();
  }, [user]);

  const loadMemories = async () => {
    try {
      const realm = await Realm.open({
        schema: [MemoryItem.schema, MemoryCategory.schema],
        schemaVersion: 9,
      });
      
      const memoryItems = realm.objects<MemoryItem>('MemoryItem')
        .filtered('userId == $0 AND isArchived == false', user?.id)
        .sorted('updatedAt', true);
      
      setMemories(Array.from(memoryItems));
      setLoading(false);
    } catch (error) {
      console.error('Error loading memories:', error);
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const realm = await Realm.open({
        schema: [MemoryItem.schema, MemoryCategory.schema],
        schemaVersion: 9,
      });
      
      const categoryItems = realm.objects<MemoryCategory>('MemoryCategory')
        .filtered('userId == $0', user?.id);
      
      setCategories(Array.from(categoryItems));
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const addMemory = async (data: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    priority: 'low' | 'medium' | 'high';
  }) => {
    try {
      const realm = await Realm.open({
        schema: [MemoryItem.schema, MemoryCategory.schema],
        schemaVersion: 9,
      });

      realm.write(() => {
        realm.create('MemoryItem', {
          _id: new Realm.BSON.ObjectId(),
          ...data,
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user?.id,
        });
      });

      loadMemories();
    } catch (error) {
      console.error('Error adding memory:', error);
    }
  };

  const updateMemory = async (id: string, updates: Partial<MemoryItem>) => {
    try {
      const realm = await Realm.open({
        schema: [MemoryItem.schema, MemoryCategory.schema],
        schemaVersion: 9,
      });

      const memory = realm.objectForPrimaryKey<MemoryItem>('MemoryItem', new Realm.BSON.ObjectId(id));
      
      if (memory) {
        realm.write(() => {
          Object.assign(memory, { ...updates, updatedAt: new Date() });
        });
        loadMemories();
      }
    } catch (error) {
      console.error('Error updating memory:', error);
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      const realm = await Realm.open({
        schema: [MemoryItem.schema, MemoryCategory.schema],
        schemaVersion: 9,
      });

      const memory = realm.objectForPrimaryKey<MemoryItem>('MemoryItem', new Realm.BSON.ObjectId(id));
      
      if (memory) {
        realm.write(() => {
          realm.delete(memory);
        });
        loadMemories();
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const searchMemories = (query: string) => {
    return memories.filter(memory =>
      memory.title.toLowerCase().includes(query.toLowerCase()) ||
      memory.content.toLowerCase().includes(query.toLowerCase()) ||
      memory.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getMemoriesByCategory = (category: string) => {
    return memories.filter(memory => memory.category === category);
  };

  return {
    memories,
    categories,
    loading,
    addMemory,
    updateMemory,
    deleteMemory,
    searchMemories,
    getMemoriesByCategory,
    loadMemories,
  };
};