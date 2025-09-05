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
    },
  };
}