import Realm from 'realm';

export class MemoryItem extends Realm.Object<MemoryItem> {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  content!: string;
  category!: string;
  tags!: string[];
  priority!: 'low' | 'medium' | 'high';
  isArchived!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  userId!: string;

  static schema: Realm.ObjectSchema = {
    name: 'MemoryItem',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      title: 'string',
      content: 'string',
      category: 'string',
      tags: 'string[]',
      priority: 'string',
      isArchived: { type: 'bool', default: false },
      createdAt: 'date',
      updatedAt: 'date',
      userId: 'string',
    },
  };
}

export class MemoryCategory extends Realm.Object<MemoryCategory> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  color!: string;
  icon!: string;
  userId!: string;

  static schema: Realm.ObjectSchema = {
    name: 'MemoryCategory',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      color: 'string',
      icon: 'string',
      userId: 'string',
    },
  };
}