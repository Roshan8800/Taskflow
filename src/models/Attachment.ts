import Realm from 'realm';

export class Attachment extends Realm.Object<Attachment> {
  _id!: Realm.BSON.ObjectId;
  taskId?: Realm.BSON.ObjectId;
  projectId?: Realm.BSON.ObjectId;
  uri!: string;
  type!: string;
  name!: string;
  size!: number;

  static schema: Realm.ObjectSchema = {
    name: 'Attachment',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      taskId: 'objectId?',
      projectId: 'objectId?',
      uri: 'string',
      type: 'string',
      name: 'string',
      size: 'int',
    },
  };
}