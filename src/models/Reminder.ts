import Realm from 'realm';

export class Reminder extends Realm.Object<Reminder> {
  _id!: Realm.BSON.ObjectId;
  taskId!: Realm.BSON.ObjectId;
  fireAt!: Date;
  repeatRule?: string;
  lastFiredAt?: Date;
  enabled!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'Reminder',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      taskId: 'objectId',
      fireAt: 'date',
      repeatRule: 'string?',
      lastFiredAt: 'date?',
      enabled: { type: 'bool', default: true },
    },
  };
}