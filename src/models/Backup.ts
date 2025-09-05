import Realm from 'realm';

export class Backup extends Realm.Object<Backup> {
  _id!: Realm.BSON.ObjectId;
  createdAt!: Date;
  path!: string;
  type!: 'json' | 'csv';

  static schema: Realm.ObjectSchema = {
    name: 'Backup',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      createdAt: { type: 'date', default: () => new Date() },
      path: 'string',
      type: 'string',
    },
  };
}