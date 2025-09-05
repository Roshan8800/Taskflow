import { useState } from 'react';
import { Todo } from '../models/Todo';
import { useTaskManager } from './useTaskManager';

export const useMultiSelect = () => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const { bulkComplete, bulkDelete, bulkMove, updateTask } = useTaskManager();

  const toggleSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const selectAll = (taskIds: string[]) => {
    setSelectedTasks(taskIds);
  };

  const clearSelection = () => {
    setSelectedTasks([]);
  };

  const getAvailableActions = (tasks: Todo[]) => {
    const selectedTaskObjects = tasks.filter(task => 
      selectedTasks.includes(task._id.toString())
    );

    const hasArchived = selectedTaskObjects.some(task => task.archived);
    const hasCompleted = selectedTaskObjects.some(task => task.completed);
    const hasActive = selectedTaskObjects.some(task => !task.archived && !task.completed);

    return {
      canComplete: hasActive && !hasArchived, // Can only complete if no archived tasks
      canArchive: selectedTaskObjects.length > 0,
      canDelete: selectedTaskObjects.length > 0,
      canUnarchive: hasArchived,
      canMove: selectedTaskObjects.length > 0,
      needsUnarchive: hasArchived && hasActive, // Mixed selection needs unarchive first
    };
  };

  const bulkCompleteSelected = async (tasks: Todo[]) => {
    const actions = getAvailableActions(tasks);
    
    if (actions.needsUnarchive) {
      // Unarchive first, then complete
      await bulkUnarchiveSelected();
      await bulkComplete(selectedTasks);
    } else if (actions.canComplete) {
      await bulkComplete(selectedTasks);
    }
    
    clearSelection();
  };

  const bulkDeleteSelected = async () => {
    await bulkDelete(selectedTasks);
    clearSelection();
  };

  const bulkMoveSelected = async (projectId: string) => {
    await bulkMove(selectedTasks, projectId);
    clearSelection();
  };

  const bulkArchiveSelected = async () => {
    for (const taskId of selectedTasks) {
      await updateTask(taskId, { archived: true });
    }
    clearSelection();
  };

  const bulkUnarchiveSelected = async () => {
    for (const taskId of selectedTasks) {
      await updateTask(taskId, { archived: false });
    }
    clearSelection();
  };

  return {
    selectedTasks,
    toggleSelection,
    selectAll,
    clearSelection,
    getAvailableActions,
    bulkCompleteSelected,
    bulkDeleteSelected,
    bulkMoveSelected,
    bulkArchiveSelected,
    bulkUnarchiveSelected,
  };
};