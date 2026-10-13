import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFilter } from '../types/task.types';
import { getTasksRealtime, createTask, updateTask, deleteTask } from '../services/taskService';

export const useTasks = (activeFilter: TaskFilter = 'All') => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = getTasksRealtime(
      fetchedTasks => {
        setTasks(fetchedTasks);
        setLoading(false);
        setError(null);
      },
      err => {
        setError(err.message || 'Failed to sync tasks from Firestore');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleCreateTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      await createTask(task);
    } catch (err: unknown) {
      console.error('Error creating task:', err);
      const message = err instanceof Error ? err.message : 'Could not create task';
      setError(message);
      throw err;
    }
  }, []);

  const handleUpdateTask = useCallback(
    async (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
      try {
        setError(null);
        await updateTask(taskId, updates);
      } catch (err: unknown) {
        console.error('Error updating task:', err);
        const message = err instanceof Error ? err.message : 'Could not update task';
        setError(message);
        throw err;
      }
    },
    [],
  );

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      setError(null);
      await deleteTask(taskId);
    } catch (err: unknown) {
      console.error('Error deleting task:', err);
      const message = err instanceof Error ? err.message : 'Could not delete task';
      setError(message);
      throw err;
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Since Firestore uses real-time snapshot, a short simulated refresh provides great UX feedback
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  // Filter tasks based on active filter
  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'All') return true;
    return task.status === activeFilter;
  });

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    error,
    refreshing,
    onRefresh,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
  };
};
