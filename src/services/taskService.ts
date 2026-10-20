import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Task } from '../types/task.types';

const COLLECTION_NAME = 'tasks';
const tasksCollectionRef = collection(db, COLLECTION_NAME);

/**
 * Real-time Firestore listener for tasks collection
 * Automatically updates when any document is added, updated, or removed
 */
export const getTasksRealtime = (
  onSuccess: (tasks: Task[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  const q = query(tasksCollectionRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    snapshot => {
      const tasks: Task[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title,
          description: data.description || '',
          status: data.status || 'To Do',
          priority: data.priority || 'Medium',
          dueDate: data.dueDate || '',
          createdAt: data.createdAt,
          teamId: data.teamId ?? null,
          teamName: data.teamName ?? null,
          assigneeId: data.assigneeId ?? null,
          assigneeName: data.assigneeName ?? null,
        } as Task;
      });
      onSuccess(tasks);
    },
    err => {
      console.error('Error fetching tasks realtime:', err);
      if (onError) onError(err);
    },
  );
};

/**
 * Real-time listener for tasks belonging to a specific team
 */
export const getTeamTasksRealtime = (
  teamId: string,
  onSuccess: (tasks: Task[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  // Query by teamId only (single-field index automatically handled by Firestore)
  // Avoids 'The query requires an index' composite index failure
  const q = query(
    tasksCollectionRef,
    where('teamId', '==', teamId),
  );

  return onSnapshot(
    q,
    snapshot => {
      const tasks: Task[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title,
          description: data.description || '',
          status: data.status || 'To Do',
          priority: data.priority || 'Medium',
          dueDate: data.dueDate || '',
          createdAt: data.createdAt,
          teamId: data.teamId ?? null,
          teamName: data.teamName ?? null,
          assigneeId: data.assigneeId ?? null,
          assigneeName: data.assigneeName ?? null,
        } as Task;
      });

      // In-memory sort by createdAt descending (newest first)
      const getMillis = (val: unknown): number => {
        if (!val) return 0;
        if (typeof val === 'object' && val !== null && 'toMillis' in val && typeof (val as { toMillis: () => number }).toMillis === 'function') {
          return (val as { toMillis: () => number }).toMillis();
        }
        if (val instanceof Date) return val.getTime();
        return 0;
      };

      tasks.sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));

      onSuccess(tasks);
    },
    err => {
      console.error('Error fetching team tasks realtime:', err);
      if (onError) onError(err);
    },
  );
};

/**
 * Creates a new task in Firestore
 */
export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<string> => {
  const newTaskDoc = {
    title: task.title.trim(),
    description: task.description?.trim() || '',
    status: task.status || 'To Do',
    priority: task.priority || 'Medium',
    dueDate: task.dueDate || '',
    createdAt: serverTimestamp(),
    teamId: task.teamId ?? null,
    teamName: task.teamName ?? null,
    assigneeId: task.assigneeId ?? null,
    assigneeName: task.assigneeName ?? null,
  };

  const docRef = await addDoc(tasksCollectionRef, newTaskDoc);
  return docRef.id;
};

/**
 * Updates an existing task in Firestore
 */
export const updateTask = async (
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'createdAt'>>,
): Promise<void> => {
  const taskDocRef = doc(db, COLLECTION_NAME, taskId);
  const cleanUpdates: Partial<Task> = {};

  if (updates.title !== undefined) cleanUpdates.title = updates.title.trim();
  if (updates.description !== undefined) cleanUpdates.description = updates.description.trim();
  if (updates.status !== undefined) cleanUpdates.status = updates.status;
  if (updates.priority !== undefined) cleanUpdates.priority = updates.priority;
  if (updates.dueDate !== undefined) cleanUpdates.dueDate = updates.dueDate;
  if (updates.teamId !== undefined) cleanUpdates.teamId = updates.teamId;
  if (updates.teamName !== undefined) cleanUpdates.teamName = updates.teamName;
  if (updates.assigneeId !== undefined) cleanUpdates.assigneeId = updates.assigneeId;
  if (updates.assigneeName !== undefined) cleanUpdates.assigneeName = updates.assigneeName;

  await updateDoc(taskDocRef, cleanUpdates);
};

/**
 * Deletes a task from Firestore
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  const taskDocRef = doc(db, COLLECTION_NAME, taskId);
  await deleteDoc(taskDocRef);
};
