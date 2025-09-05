import Realm, { BSON } from 'realm';

export class UserStats extends Realm.Object<UserStats> {
  _id!: BSON.ObjectId;
  userId!: BSON.ObjectId;
  currentStreak!: number;
  longestStreak!: number;
  lastActiveDate!: Date;
  totalCompleted!: number;

  static schema: Realm.ObjectSchema = {
    name: 'UserStats',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      userId: 'objectId',
      currentStreak: { type: 'int', default: 0 },
      longestStreak: { type: 'int', default: 0 },
      lastActiveDate: { type: 'date', default: () => new Date() },
      totalCompleted: { type: 'int', default: 0 },
    },
  };
}