import Realm from 'realm';

export class User extends Realm.Object<User> {
  _id!: Realm.BSON.ObjectId;
  id?: string;
  name!: string;
  username?: string;
  email!: string;
  avatar?: string;
  settings!: string; // JSON string
  hash!: string;
  salt!: string;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      id: 'string?',
      name: 'string',
      username: 'string?',
      email: 'string',
      avatar: 'string?',
      settings: { type: 'string', default: '{}' },
      hash: 'string',
      salt: 'string',
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}