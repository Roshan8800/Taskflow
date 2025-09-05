import Realm from 'realm';

export class Label extends Realm.Object<Label> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  color!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Label',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      color: 'string',
    },
  };
}