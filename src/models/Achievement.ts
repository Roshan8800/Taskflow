import Realm from 'realm';

export class Achievement extends Realm.Object<Achievement> {
  _id!: Realm.BSON.ObjectId;
  key!: string;
  unlockedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Achievement',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      key: 'string',
      unlockedAt: 'date',
    },
  };
}