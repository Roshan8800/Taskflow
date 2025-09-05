import { useCallback } from 'react';
import { BSON } from 'realm';
import { getRealm } from '../database/db';
import { handleError } from '../utils/errorHandler';

export const useDataModel = () => {
  // Subtask operations
  const addSubtask = useCallback(async (taskId: BSON.ObjectId, title: string) => {
    try {
      const realm = await getRealm();
      const subtasks = realm.objects('Subtask').filtered('taskId == $0', taskId);
      const order = subtasks.length;
      
      realm.write(() => {
        realm.create('Subtask', {
          _id: new BSON.ObjectId(),
          taskId,
          title,
          done: false,
          order,
        });
      });
    } catch (error) {
      handleError(error, 'Adding Subtask');
    }
  }, []);

  const toggleSubtask = useCallback(async (subtaskId: BSON.ObjectId) => {
    try {
      const realm = await getRealm();
      const subtask = realm.objectForPrimaryKey('Subtask', subtaskId);
      
      if (subtask) {
        realm.write(() => {
          subtask.done = !subtask.done;
        });
      }
    } catch (error) {
      handleError(error, 'Toggling Subtask');
    }
  }, []);

  // Reminder operations
  const addReminder = useCallback(async (taskId: BSON.ObjectId, fireAt: Date, repeatRule?: string) => {
    try {
      const realm = await getRealm();
      
      realm.write(() => {
        realm.create('Reminder', {
          _id: new BSON.ObjectId(),
          taskId,
          fireAt,
          repeatRule,
          enabled: true,
        });
      });
    } catch (error) {
      handleError(error, 'Adding Reminder');
    }
  }, []);

  // Note operations
  const addNote = useCallback(async (content: string, taskId?: BSON.ObjectId, projectId?: BSON.ObjectId) => {
    try {
      const realm = await getRealm();
      
      realm.write(() => {
        realm.create('Note', {
          _id: new BSON.ObjectId(),
          taskId,
          projectId,
          content,
        });
      });
    } catch (error) {
      handleError(error, 'Adding Note');
    }
  }, []);

  // Attachment operations
  const addAttachment = useCallback(async (
    uri: string,
    type: string,
    name: string,
    size: number,
    taskId?: BSON.ObjectId,
    projectId?: BSON.ObjectId
  ) => {
    try {
      const realm = await getRealm();
      
      realm.write(() => {
        realm.create('Attachment', {
          _id: new BSON.ObjectId(),
          taskId,
          projectId,
          uri,
          type,
          name,
          size,
        });
      });
    } catch (error) {
      handleError(error, 'Adding Attachment');
    }
  }, []);

  // Stats operations
  const saveStatsSnapshot = useCallback(async (date: Date, completedCount: number, overdueCount: number, streakCount: number) => {
    try {
      const realm = await getRealm();
      
      // Check if snapshot already exists for this date
      const existing = realm.objects('StatsSnapshot').filtered('date == $0', date)[0];
      
      realm.write(() => {
        if (existing) {
          existing.completedCount = completedCount;
          existing.overdueCount = overdueCount;
          existing.streakCount = streakCount;
        } else {
          realm.create('StatsSnapshot', {
            _id: new BSON.ObjectId(),
            date,
            completedCount,
            overdueCount,
            streakCount,
          });
        }
      });
    } catch (error) {
      handleError(error, 'Saving Stats');
    }
  }, []);

  // Achievement operations
  const unlockAchievement = useCallback(async (key: string) => {
    try {
      const realm = await getRealm();
      
      // Check if already unlocked
      const existing = realm.objects('Achievement').filtered('key == $0', key)[0];
      if (existing) return;
      
      realm.write(() => {
        realm.create('Achievement', {
          _id: new BSON.ObjectId(),
          key,
          unlockedAt: new Date(),
        });
      });
    } catch (error) {
      handleError(error, 'Unlocking Achievement');
    }
  }, []);

  // Label operations
  const createLabel = useCallback(async (name: string, color: string) => {
    try {
      const realm = await getRealm();
      
      realm.write(() => {
        realm.create('Label', {
          _id: new BSON.ObjectId(),
          name,
          color,
        });
      });
    } catch (error) {
      handleError(error, 'Creating Label');
    }
  }, []);

  // Backup operations
  const saveBackupRecord = useCallback(async (path: string, type: 'json' | 'csv') => {
    try {
      const realm = await getRealm();
      
      realm.write(() => {
        realm.create('Backup', {
          _id: new BSON.ObjectId(),
          path,
          type,
        });
      });
    } catch (error) {
      handleError(error, 'Saving Backup Record');
    }
  }, []);

  // Query operations
  const getSubtasks = useCallback(async (taskId: BSON.ObjectId) => {
    try {
      const realm = await getRealm();
      return Array.from(realm.objects('Subtask').filtered('taskId == $0', taskId).sorted('order'));
    } catch (error) {
      handleError(error, 'Getting Subtasks');
      return [];
    }
  }, []);

  const getNotes = useCallback(async (taskId?: BSON.ObjectId, projectId?: BSON.ObjectId) => {
    try {
      const realm = await getRealm();
      let query = '';
      const params = [];
      
      if (taskId) {
        query = 'taskId == $0';
        params.push(taskId);
      } else if (projectId) {
        query = 'projectId == $0';
        params.push(projectId);
      }
      
      return Array.from(realm.objects('Note').filtered(query, ...params).sorted('createdAt', true));
    } catch (error) {
      handleError(error, 'Getting Notes');
      return [];
    }
  }, []);

  const getAttachments = useCallback(async (taskId?: BSON.ObjectId, projectId?: BSON.ObjectId) => {
    try {
      const realm = await getRealm();
      let query = '';
      const params = [];
      
      if (taskId) {
        query = 'taskId == $0';
        params.push(taskId);
      } else if (projectId) {
        query = 'projectId == $0';
        params.push(projectId);
      }
      
      return Array.from(realm.objects('Attachment').filtered(query, ...params));
    } catch (error) {
      handleError(error, 'Getting Attachments');
      return [];
    }
  }, []);

  return {
    addSubtask,
    toggleSubtask,
    addReminder,
    addNote,
    addAttachment,
    saveStatsSnapshot,
    unlockAchievement,
    createLabel,
    saveBackupRecord,
    getSubtasks,
    getNotes,
    getAttachments,
  };
};