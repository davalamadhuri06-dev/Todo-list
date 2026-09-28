import { Task } from '../types/task';

const STORAGE_KEY = 'taskease_tasks_v1';

// Format Date object to YYYY-MM-DD
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get sample starter tasks if user is visiting for the first time
export function getInitialDemoTasks(): Task[] {
  const today = new Date();
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const inThreeDays = new Date(today);
  inThreeDays.setDate(today.getDate() + 3);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return [
    {
      id: 'task-1',
      title: 'Complete Web Technology Project Report',
      description: 'Document the architecture, features, and screenshots of TaskEase for submission.',
      priority: 'high',
      dueDate: formatDateToISO(today),
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'task-2',
      title: 'Review Operating Systems Lecture Notes',
      description: 'Study CPU scheduling algorithms and memory management paging mechanisms.',
      priority: 'medium',
      dueDate: formatDateToISO(today),
      completed: true,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      id: 'task-3',
      title: 'Prepare Presentation Slides for Seminar',
      description: 'Design 10 clean slides focusing on problem statement, solution, and demo.',
      priority: 'high',
      dueDate: formatDateToISO(tomorrow),
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'task-4',
      title: 'Return Library Books & Issue References',
      description: 'Algorithms textbook and Distributed Systems handbook.',
      priority: 'low',
      dueDate: formatDateToISO(inThreeDays),
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];
}

// Load tasks from localStorage
export function loadTasksFromStorage(): Task[] {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      const initial = getInitialDemoTasks();
      saveTasksToStorage(initial);
      return initial;
    }
    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return getInitialDemoTasks();
  } catch (error) {
    console.error('Failed to load tasks from localStorage', error);
    return getInitialDemoTasks();
  }
}

// Save tasks to localStorage
export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage', error);
  }
}

// Check if a date string is today
export function isDateToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const todayStr = formatDateToISO(new Date());
  return dateStr === todayStr;
}

// Check if a date string is in the past (overdue) and not today
export function isDateOverdue(dateStr: string): boolean {
  if (!dateStr) return false;
  const todayStr = formatDateToISO(new Date());
  return dateStr < todayStr;
}

// Format human friendly date
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return 'No due date';

  const todayStr = formatDateToISO(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDateToISO(tomorrow);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateToISO(yesterday);

  if (dateStr === todayStr) {
    return 'Today';
  }
  if (dateStr === tomorrowStr) {
    return 'Tomorrow';
  }
  if (dateStr === yesterdayStr) {
    return 'Yesterday';
  }

  // Parse YYYY-MM-DD
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  }

  return dateStr;
}
