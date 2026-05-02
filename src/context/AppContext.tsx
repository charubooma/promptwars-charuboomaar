import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Task, Activity, TaskStatus, Toast, User } from '../types';

/* ─── Types ──────────────────────────────────────────── */
interface AppContextProps {
  tasks: Task[];
  activities: Activity[];
  toasts: Toast[];
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
}

/* ─── Context ────────────────────────────────────────── */
const AppContext = createContext<AppContextProps | undefined>(undefined);

/* ─── Mock Data ──────────────────────────────────────── */
const today = new Date();
const d = (offset: number) => new Date(today.getTime() + offset * 86400000).toISOString();

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Design System & Component Library', description: 'Create reusable Figma components and export design tokens for engineering.', status: 'done',        assignee: 'Alice',   dueDate: d(-2), priority: 'High',   comments: 4 },
  { id: '2', title: 'Google OAuth Integration',          description: 'Implement Sign-in with Google using OAuth 2.0 and Firebase Auth.',                status: 'done',        assignee: 'Bob',     dueDate: d(-1), priority: 'High',   comments: 2 },
  { id: '3', title: 'Kanban Board UI',                   description: 'Build drag-and-drop Kanban columns with framer-motion spring physics.',           status: 'in-progress', assignee: 'Charlie', dueDate: d(1),  priority: 'High',   comments: 5 },
  { id: '4', title: 'Gemini AI Assistant Panel',         description: 'Wire up Gemini API for natural language task creation and team summaries.',       status: 'in-progress', assignee: 'Alice',   dueDate: d(2),  priority: 'Medium', comments: 3 },
  { id: '5', title: 'Firebase Realtime Sync',            description: 'Set up Firestore listeners for live multi-user task updates.',                    status: 'in-progress', assignee: 'Diana',   dueDate: d(3),  priority: 'High',   comments: 1 },
  { id: '6', title: 'Mobile Responsive Layout',          description: 'Ensure full responsiveness with bottom nav on mobile and collapsible sidebar.',   status: 'todo',        assignee: 'Eve',     dueDate: d(4),  priority: 'Medium', comments: 0 },
  { id: '7', title: 'Google Calendar API Sync',          description: 'Two-way sync of tasks with due dates to personal and team Google Calendars.',     status: 'todo',        assignee: 'Bob',     dueDate: d(5),  priority: 'Low',    comments: 2 },
  { id: '8', title: 'Unit & Integration Tests',          description: 'Achieve 80%+ coverage on task CRUD functions using Vitest + Testing Library.',    status: 'todo',        assignee: 'Charlie', dueDate: d(6),  priority: 'Medium', comments: 0 },
];

const INITIAL_ACTIVITIES: Activity[] = [
  { id: '1', userId: 'u1', userName: 'Alice',   action: 'moved to Done',         target: 'Design System & Component Library', timestamp: d(-0.1) },
  { id: '2', userId: 'u2', userName: 'Bob',     action: 'completed',             target: 'Google OAuth Integration',          timestamp: d(-0.2) },
  { id: '3', userId: 'u3', userName: 'Charlie', action: 'started working on',    target: 'Kanban Board UI',                   timestamp: d(-0.3) },
  { id: '4', userId: 'u1', userName: 'Alice',   action: 'created',               target: 'Gemini AI Assistant Panel',         timestamp: d(-0.5) },
  { id: '5', userId: 'u4', userName: 'Diana',   action: 'added a comment on',    target: 'Kanban Board UI',                   timestamp: d(-0.8) },
];

/* ─── Provider ───────────────────────────────────────── */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /** Add a line to the activity feed */
  const logActivity = useCallback((userName: string, action: string, target: string) => {
    const entry: Activity = {
      id: Math.random().toString(36).slice(2, 10),
      userId: 'current',
      userName,
      action,
      target,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [entry, ...prev.slice(0, 49)]);
  }, []);

  /** Show a toast notification */
  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2, 10);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => dismissToast(id), 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  /* Auth */
  const login = useCallback((u: User) => { setUser(u); setIsLoggedIn(true); }, []);
  const logout = useCallback(() => { setUser(null); setIsLoggedIn(false); }, []);

  /* Task CRUD */
  const addTask = useCallback((taskData: Omit<Task, 'id'>) => {
    const newTask: Task = { ...taskData, id: Math.random().toString(36).slice(2, 10), comments: 0 };
    setTasks(prev => [...prev, newTask]);
    logActivity(user?.name ?? 'You', 'created', newTask.title);
    showToast(`Task "${newTask.title}" created!`, 'success');
  }, [user, logActivity, showToast]);

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.status !== newStatus) {
        logActivity(user?.name ?? 'You', `moved to ${newStatus}`, t.title);
        if (newStatus === 'done') showToast(`🎉 "${t.title}" completed!`, 'success');
        return { ...t, status: newStatus };
      }
      return t;
    }));
  }, [user, logActivity, showToast]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => {
      const target = prev.find(t => t.id === taskId);
      if (target) {
        logActivity(user?.name ?? 'You', 'deleted', target.title);
        showToast(`Task deleted`, 'info');
      }
      return prev.filter(t => t.id !== taskId);
    });
  }, [user, logActivity, showToast]);

  return (
    <AppContext.Provider value={{
      tasks, activities, toasts, user, isLoggedIn,
      login, logout,
      addTask, updateTaskStatus, deleteTask,
      showToast, dismissToast,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
