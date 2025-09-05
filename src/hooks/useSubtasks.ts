import { useState, useEffect } from 'react';
import { getRealm } from '../database/db';
import { Subtask } from '../models/Subtask';
import { Todo } from '../models/Todo';
import { useSettings } from '../hooks/useSettings';
import Realm from 'realm';

export const useSubtasks = (taskId: string) => {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const { settings } = useSettings();

  const loadSubtasks = async () => {
    const realm = await getRealm();
    const taskSubtasks = realm.objects<Subtask>('Subtask')
      .filtered('taskId == $0', new Realm.BSON.ObjectId(taskId))
      .sorted('order');
    setSubtasks(Array.from(taskSubtasks));
  };

  const toggleSubtask = async (subtaskId: string) => {
    const realm = await getRealm();
    
    realm.write(() => {
      const subtask = realm.objectForPrimaryKey<Subtask>('Subtask', new Realm.BSON.ObjectId(subtaskId));
      if (subtask) {
        subtask.status = subtask.status === 'completed' ? 'pending' : 'completed';
        subtask.updatedAt = new Date();
      }
    });

    await loadSubtasks();
    await checkParentCompletion();
  };

  const checkParentCompletion = async () => {
    if (!settings.autoCompleteParent) return;

    const realm = await getRealm();
    const allSubtasks = realm.objects<Subtask>('Subtask')
      .filtered('taskId == $0', new Realm.BSON.ObjectId(taskId));
    
    const allCompleted = Array.from(allSubtasks).every(st => st.status === 'completed');
    
    if (allCompleted && allSubtasks.length > 0) {
      realm.write(() => {
        const parentTask = realm.objectForPrimaryKey<Todo>('Todo', new Realm.BSON.ObjectId(taskId));
        if (parentTask) {
          parentTask.status = 'completed';
          parentTask.completed = true;
          parentTask.updatedAt = new Date();
        }
      });
    }
  };

  const reorderSubtasks = async (fromIndex: number, toIndex: number) => {
    const realm = await getRealm();
    
    realm.write(() => {
      const reorderedSubtasks = [...subtasks];
      const [moved] = reorderedSubtasks.splice(fromIndex, 1);
      reorderedSubtasks.splice(toIndex, 0, moved);
      
      reorderedSubtasks.forEach((subtask, index) => {
        const realmSubtask = realm.objectForPrimaryKey<Subtask>('Subtask', subtask._id);
        if (realmSubtask) {
          realmSubtask.order = index;
        }
      });
    });
    
    await loadSubtasks();
  };

  useEffect(() => {
    loadSubtasks();
  }, [taskId]);

  return { subtasks, toggleSubtask, reorderSubtasks, loadSubtasks };
};