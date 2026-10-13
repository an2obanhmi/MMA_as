import { Timestamp, FieldValue } from 'firebase/firestore';

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id?: string; // Auto-generated Firestore Document ID
  title: string; // Required
  description?: string; // Optional
  status: TaskStatus; // Default: 'To Do'
  priority: TaskPriority; // Default: 'Medium'
  dueDate?: string; // ISO date string or formatted date string
  createdAt?: Timestamp | FieldValue | null; // Firestore Timestamp or serverTimestamp()
  teamId?: string | null; // Placeholder (null for Exam 1)
  assigneeId?: string | null; // Placeholder (null for Exam 1)
}

export type TaskFilter = 'All' | TaskStatus;
