import { useState, useCallback } from 'react';
import Realm, { BSON } from 'realm';
import { Project } from '../models/Project';
import { Todo } from '../models/Todo';
import { getRealm } from '../database/db';

export const useProjectManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = useCallback(async (data: {
    name: string;
    description?: string;
    color: string;
    icon: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const realm = await getRealm();
      realm.write(() => {
        realm.create('Project', {
          _id: new BSON.ObjectId(),
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    } catch (err) {
      setError('Failed to create project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [realm]);

  const updateProject = useCallback(async (id: BSON.ObjectId, data: Partial<Project>) => {
    try {
      setLoading(true);
      setError(null);
      
      const realm = await getRealm();
      const project = realm.objectForPrimaryKey('Project', id);
      if (!project) throw new Error('Project not found');
      
      realm.write(() => {
        Object.assign(project, { ...data, updatedAt: new Date() });
      });
    } catch (err) {
      setError('Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [realm]);

  const deleteProject = useCallback(async (id: BSON.ObjectId) => {
    try {
      setLoading(true);
      setError(null);
      
      const realm = await getRealm();
      const project = realm.objectForPrimaryKey('Project', id);
      if (!project) throw new Error('Project not found');
      
      realm.write(() => {
        // Remove project from all tasks
        const tasks = realm.objects('Todo').filtered('projectId == $0', id);
        tasks.forEach(task => {
          task.projectId = undefined;
        });
        realm.delete(project);
      });
    } catch (err) {
      setError('Failed to delete project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [realm]);

  const archiveProject = useCallback(async (id: BSON.ObjectId, archive: boolean = true) => {
    try {
      setLoading(true);
      setError(null);
      
      const realm = await getRealm();
      const project = realm.objectForPrimaryKey('Project', id);
      if (!project) throw new Error('Project not found');
      
      realm.write(() => {
        project.isArchived = archive;
        project.updatedAt = new Date();
      });
    } catch (err) {
      setError('Failed to archive project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [realm]);

  const assignTaskToProject = useCallback(async (taskId: BSON.ObjectId, projectId?: BSON.ObjectId) => {
    try {
      setLoading(true);
      setError(null);
      
      const realm = await getRealm();
      const task = realm.objectForPrimaryKey('Todo', taskId);
      if (!task) throw new Error('Task not found');
      
      realm.write(() => {
        task.projectId = projectId;
        task.updatedAt = new Date();
      });
    } catch (err) {
      setError('Failed to assign task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [realm]);

  const getProjectStats = useCallback(async (projectId: BSON.ObjectId) => {
    const realm = await getRealm();
    const tasks = realm.objects('Todo').filtered('projectId == $0 AND isDeleted == false', projectId);
    const total = tasks.length;
    const completed = tasks.filtered('completed == true').length;
    const pending = total - completed;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    
    const priorities = {
      urgent: tasks.filtered('priority == "urgent"').length,
      high: tasks.filtered('priority == "high"').length,
      medium: tasks.filtered('priority == "medium"').length,
      low: tasks.filtered('priority == "low"').length,
    };

    return { total, completed, pending, progress, priorities };
  }, []);

  const getProjects = useCallback(async (includeArchived: boolean = false) => {
    const realm = await getRealm();
    const filter = includeArchived ? '' : 'isArchived == false';
    return realm.objects('Project').filtered(filter).sorted('updatedAt', true);
  }, []);

  const getProjectTasks = useCallback(async (projectId: BSON.ObjectId, filters?: {
    status?: 'all' | 'completed' | 'pending';
    priority?: 'all' | 'urgent' | 'high' | 'medium' | 'low';
  }) => {
    const realm = await getRealm();
    let query = 'projectId == $0 AND isDeleted == false';
    const params = [projectId];

    if (filters?.status === 'completed') {
      query += ' AND completed == true';
    } else if (filters?.status === 'pending') {
      query += ' AND completed == false';
    }

    if (filters?.priority && filters.priority !== 'all') {
      query += ' AND priority == $1';
      params.push(filters.priority);
    }

    return realm.objects('Todo').filtered(query, ...params).sorted('createdAt', true);
  }, []);

  return {
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
    assignTaskToProject,
    getProjectStats,
    getProjects,
    getProjectTasks,
  };
};