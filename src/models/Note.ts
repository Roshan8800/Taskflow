import Realm from 'realm';

export class Note extends Realm.Object<Note> {
  _id!: Realm.BSON.ObjectId;
  taskId?: Realm.BSON.ObjectId;
  projectId?: Realm.BSON.ObjectId;
  content!: string;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Note',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      taskId: 'objectId?',
      projectId: 'objectId?',
      content: 'string',
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}