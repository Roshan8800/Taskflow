import Realm, { BSON } from 'realm';

export class Todo extends Realm.Object<Todo> {
  _id!: BSON.ObjectId;
  title!: string;
  description?: string;
  projectId?: Realm.BSON.ObjectId;
  dueAt?: Date;
  priority!: 'low' | 'medium' | 'high' | 'urgent';
  status!: 'pending' | 'completed' | 'cancelled';
  completed!: boolean;
  labels!: string[];
  color!: string;
  createdAt!: Date;
  updatedAt!: Date;
  archived!: boolean;
  deletedAt?: Date;
  repeatRule?: string;
  parentTaskId?: Realm.BSON.ObjectId;
  // Legacy property aliases for compatibility
  dueDate?: Date;
  projectId?: string;
  notes?: string;
  isDeleted?: boolean;
  isArchived?: boolean;
  isRecurring?: boolean;
  recurringType?: string;
  recurringDays?: number[];
  recurringInterval?: number;
  snoozeUntil?: Date;
  reminderDate?: Date;
  attachments?: string[];
  userId?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Todo',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      title: 'string',
      description: 'string?',
      projectId: 'objectId?',
      dueAt: 'date?',
      priority: { type: 'string', default: 'medium' },
      status: { type: 'string', default: 'pending' },
      completed: { type: 'bool', default: false },
      labels: { type: 'list', objectType: 'string' },
      color: { type: 'string', default: '#4A90E2' },
      createdAt: { type: 'date', default: () => new Date() },
      updatedAt: { type: 'date', default: () => new Date() },
      archived: { type: 'bool', default: false },
      deletedAt: 'date?',
      repeatRule: 'string?',
      parentTaskId: 'objectId?',
      // Legacy compatibility properties
      dueAt: 'date?',
      projectId: 'string?',
      notes: 'string?',
      isDeleted: { type: 'bool', default: false },
      isArchived: { type: 'bool', default: false },
      isRecurring: { type: 'bool', default: false },
      recurringType: 'string?',
      recurringDays: { type: 'list', objectType: 'int' },
      recurringInterval: 'int?',
      snoozeUntil: 'date?',
      reminderDate: 'date?',
      attachments: { type: 'list', objectType: 'string' },
      userId: 'string?',
    },
  };
}