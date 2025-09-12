import Realm from 'realm';

export class Subtask extends Realm.Object<Subtask> {
  _id!: Realm.BSON.ObjectId;
  taskId!: Realm.BSON.ObjectId;
  title!: string;
  done!: boolean;
  completed?: boolean;
  status?: 'pending' | 'completed';
  order!: number;
  createdAt?: Date;
  updatedAt?: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Subtask',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      taskId: 'objectId',
      title: 'string',
      done: { type: 'bool', default: false },
      completed: { type: 'bool', default: false },
      status: { type: 'string', default: 'pending' },
      order: { type: 'int', default: 0 },
      createdAt: { type: 'date', default: () => new Date() },
      updatedAt: { type: 'date', default: () => new Date() },
    },
  };
}