export type Priority = 'low' | 'medium' | 'high';

export type FilterType = 'all' | 'pending' | 'completed' | 'high';

export type SortType = 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'newest';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string; // ISO string
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}
