import Realm from 'realm';

export class StatsSnapshot extends Realm.Object<StatsSnapshot> {
  _id!: Realm.BSON.ObjectId;
  date!: Date;
  completedCount!: number;
  overdueCount!: number;
  streakCount!: number;

  static schema: Realm.ObjectSchema = {
    name: 'StatsSnapshot',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      date: 'date',
      completedCount: 'int',
      overdueCount: 'int',
      streakCount: 'int',
    },
  };
}