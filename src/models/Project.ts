import Realm from 'realm';

export class Project extends Realm.Object<Project> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  color!: string;
  icon!: string;
  archived!: boolean;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Project',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      color: 'string',
      icon: 'string',
      archived: { type: 'bool', default: false },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}