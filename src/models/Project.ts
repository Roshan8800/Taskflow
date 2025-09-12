import Realm from 'realm';

export class Project extends Realm.Object<Project> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  description?: string;
  color!: string;
  icon!: string;
  archived!: boolean;
  isArchived?: boolean;
  progress?: number;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Project',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      description: 'string?',
      color: 'string',
      icon: 'string',
      archived: { type: 'bool', default: false },
      isArchived: { type: 'bool', default: false },
      progress: 'double?',
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}