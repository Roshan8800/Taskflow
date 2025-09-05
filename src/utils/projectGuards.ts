import { Alert } from 'react-native';
import { getRealm } from '../database/db';
import { Todo } from '../models/Todo';
import { Project } from '../models/Project';
import Realm from 'realm';

export const deleteProjectWithGuards = async (
  projectId: string,
  onConfirm: () => void
): Promise<void> => {
  try {
    const realm = await getRealm();
    
    // Check if project has tasks
    const tasksInProject = realm.objects<Todo>('Todo')
      .filtered('projectId == $0 AND deletedAt == null', new Realm.BSON.ObjectId(projectId));
    
    const taskCount = tasksInProject.length;
    
    if (taskCount === 0) {
      // No tasks, safe to delete
      onConfirm();
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      'Delete Project',
      `This project contains ${taskCount} task(s). What would you like to do?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Move to Unassigned', 
          onPress: () => moveTasksToUnassigned(projectId, onConfirm)
        },
        { 
          text: 'Delete All Tasks', 
          style: 'destructive',
          onPress: () => bulkDeleteProjectTasks(projectId, onConfirm)
        }
      ]
    );
  } catch (error) {
    console.error('Error checking project tasks:', error);
  }
};

const moveTasksToUnassigned = async (projectId: string, onConfirm: () => void) => {
  try {
    const realm = await getRealm();
    
    realm.write(() => {
      const tasks = realm.objects<Todo>('Todo')
        .filtered('projectId == $0 AND deletedAt == null', new Realm.BSON.ObjectId(projectId));
      
      tasks.forEach(task => {
        task.projectId = undefined; // Move to unassigned
        task.updatedAt = new Date();
      });
    });
    
    onConfirm();
  } catch (error) {
    console.error('Error moving tasks to unassigned:', error);
  }
};

const bulkDeleteProjectTasks = async (projectId: string, onConfirm: () => void) => {
  try {
    const realm = await getRealm();
    
    realm.write(() => {
      const tasks = realm.objects<Todo>('Todo')
        .filtered('projectId == $0 AND deletedAt == null', new Realm.BSON.ObjectId(projectId));
      
      tasks.forEach(task => {
        task.deletedAt = new Date();
        task.updatedAt = new Date();
      });
    });
    
    onConfirm();
  } catch (error) {
    console.error('Error bulk deleting project tasks:', error);
  }
};

export const deleteLabelWithGuards = async (
  labelName: string,
  onConfirm: () => void
): Promise<void> => {
  try {
    const realm = await getRealm();
    
    // Check if label is used by tasks
    const tasksWithLabel = realm.objects<Todo>('Todo')
      .filtered('deletedAt == null');
    
    const tasksUsingLabel = Array.from(tasksWithLabel)
      .filter(task => task.labels.includes(labelName));
    
    const taskCount = tasksUsingLabel.length;
    
    if (taskCount === 0) {
      // No tasks using this label, safe to delete
      onConfirm();
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      'Delete Label',
      `This label is used by ${taskCount} task(s). Delete anyway?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove from Tasks', 
          onPress: () => removeLabelFromTasks(labelName, onConfirm)
        }
      ]
    );
  } catch (error) {
    console.error('Error checking label usage:', error);
  }
};

const removeLabelFromTasks = async (labelName: string, onConfirm: () => void) => {
  try {
    const realm = await getRealm();
    
    realm.write(() => {
      const tasks = realm.objects<Todo>('Todo')
        .filtered('deletedAt == null');
      
      tasks.forEach(task => {
        const labelIndex = task.labels.indexOf(labelName);
        if (labelIndex > -1) {
          task.labels.splice(labelIndex, 1);
          task.updatedAt = new Date();
        }
      });
    });
    
    onConfirm();
  } catch (error) {
    console.error('Error removing label from tasks:', error);
  }
};