import Realm from 'realm';

export class Subtask extends Realm.Object<Subtask> {
  _id!: Realm.BSON.ObjectId;
  taskId!: Realm.BSON.ObjectId;
  title!: string;
  done!: boolean;
  order!: number;

  static schema: Realm.ObjectSchema = {
    name: 'Subtask',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      taskId: 'objectId',
      title: 'string',
      done: { type: 'bool', default: false },
      order: { type: 'int', default: 0 },
    },
  };
}