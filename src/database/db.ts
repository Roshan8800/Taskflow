import Realm from 'realm';
import { User } from '../models/User';
import { Todo } from '../models/Todo';
import { Project } from '../models/Project';
import { Label } from '../models/Label';
import { Subtask } from '../models/Subtask';
import { Reminder } from '../models/Reminder';
import { Note } from '../models/Note';
import { Attachment } from '../models/Attachment';
import { StatsSnapshot } from '../models/StatsSnapshot';
import { Achievement } from '../models/Achievement';
import { Backup } from '../models/Backup';

let realmInstance: Realm | null = null;

export const getRealm = async (): Promise<Realm> => {
  if (realmInstance) {
    return realmInstance;
  }

  try {
    realmInstance = await Realm.open({
      schema: [
        User.schema,
        Todo.schema,
        Project.schema,
        Label.schema,
        Subtask.schema,
        Reminder.schema,
        Note.schema,
        Attachment.schema,
        StatsSnapshot.schema,
        Achievement.schema,
        Backup.schema,
      ],
      schemaVersion: 2,
    });
    
    return realmInstance;
  } catch (error) {
    console.error('Failed to open Realm:', error);
    throw error;
  }
};

export const closeRealm = () => {
  if (realmInstance && !realmInstance.isClosed) {
    realmInstance.close();
    realmInstance = null;
  }
};