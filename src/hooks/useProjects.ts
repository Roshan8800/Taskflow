import { useState, useEffect } from 'react';
import { BSON } from 'realm';
import { getRealm } from '../database/db';
import { Project } from '../models/Project';
import { useAuth } from './useAuth';
import { handleError } from '../utils/errorHandler';

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      const realm = await getRealm();
      const userProjects = realm.objects<Project>('Project')
        .filtered('userId == $0', user?.id || '')
        .sorted('createdAt', true);
      
      setProjects(Array.from(userProjects));
    } catch (error) {
      handleError(error, 'Loading Projects');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (data: {
    name: string;
    description?: string;
    color: string;
  }) => {
    try {
      const realm = await getRealm();
      
      realm.write(() => {
        realm.create<Project>('Project', {
          _id: new BSON.ObjectId(),
          name: data.name,
          description: data.description || '',
          color: data.color,
          userId: user?.id || '',
          createdAt: new Date(),
        });
      });

      await loadProjects();
    } catch (error) {
      handleError(error, 'Adding Project');
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const realm = await getRealm();
      const project = realm.objectForPrimaryKey<Project>('Project', new BSON.ObjectId(id));
      
      if (project) {
        realm.write(() => {
          Object.assign(project, updates);
        });
        await loadProjects();
      }
    } catch (error) {
      handleError(error, 'Updating Project');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const realm = await getRealm();
      const project = realm.objectForPrimaryKey<Project>('Project', new BSON.ObjectId(id));
      
      if (project) {
        realm.write(() => {
          realm.delete(project);
        });
        await loadProjects();
      }
    } catch (error) {
      handleError(error, 'Deleting Project');
    }
  };

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    loadProjects,
  };
};