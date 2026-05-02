export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'High' | 'Medium' | 'Low';

/** A single task card on the board */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string;
  dueDate?: string;       // ISO date string
  priority?: TaskPriority;
  comments?: number;
}

/** A team activity event shown in the feed */
export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;      // ISO date string
}

/** A toast notification */
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

/** The logged-in user (mocked) */
export interface User {
  name: string;
  email: string;
  initials: string;
  avatar?: string;
}
