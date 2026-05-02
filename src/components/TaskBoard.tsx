import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import type { TaskStatus, Task } from '../types';
import confetti from 'canvas-confetti';
import { NewTaskModal } from './NewTaskModal';

/* ─── Helpers ──────────────────────────────────────── */
const COLUMN_CFG = [
  { status: 'todo'        as TaskStatus, label: 'To Do',       icon: 'assignment',  color: 'var(--blue)'   },
  { status: 'in-progress' as TaskStatus, label: 'In Progress', icon: 'autorenew',   color: 'var(--yellow)' },
  { status: 'done'        as TaskStatus, label: 'Done',        icon: 'check_circle', color: 'var(--green)'  },
];

const priorityColor = (p?: string) => {
  if (p === 'High')   return 'var(--red)';
  if (p === 'Medium') return 'var(--yellow)';
  if (p === 'Low')    return 'var(--green)';
  return 'var(--text-muted)';
};

const avatarBg = (name: string) => {
  const c = ['var(--blue)', 'var(--red)', 'var(--green)', 'var(--yellow)', 'var(--purple)'];
  return c[name.length % c.length];
};

const fireConfetti = (x: number, y: number) => {
  confetti({ particleCount: 120, spread: 80, origin: { x: x / window.innerWidth, y: y / window.innerHeight }, colors: ['#4285F4','#EA4335','#FBBC05','#34A853','#A142F4'] });
};

/* ─── Task Card ────────────────────────────────────── */
const TaskCard: React.FC<{ task: Task; accentColor: string }> = ({ task, accentColor }) => {
  const { deleteTask } = useAppContext();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      draggable
      onDragStart={(e: unknown) => (e as React.DragEvent).dataTransfer.setData('taskId', task.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#1A1A1A',
        border: `1px solid ${hovered ? accentColor + '55' : '#252525'}`,
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: 12,
        padding: '14px 14px 12px',
        cursor: 'grab',
        position: 'relative',
        boxShadow: hovered ? `0 8px 24px ${accentColor}22` : '0 1px 4px rgba(0,0,0,0.3)',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
    >
      {/* Priority + delete */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        {task.priority && (
          <span className="badge" style={{
            background: priorityColor(task.priority) + '22',
            color: priorityColor(task.priority),
            border: `1px solid ${priorityColor(task.priority)}44`,
            fontSize: 9,
          }}>
            {task.priority}
          </span>
        )}
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            onClick={() => deleteTask(task.id)}
            aria-label="Delete task"
            style={{ background: 'rgba(234,67,53,0.15)', border: 'none', borderRadius: 6, color: 'var(--red)', cursor: 'pointer', padding: '2px 4px', display: 'flex', marginLeft: 'auto' }}
          >
            <span className="material-icons" style={{ fontSize: 14 }}>close</span>
          </motion.button>
        )}
      </div>

      {/* Title */}
      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>{task.title}</p>

      {/* Description */}
      {task.description && (
        <p style={{ margin: '0 0 10px', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description}
        </p>
      )}

      {/* Footer row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {task.dueDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '3px 7px' }}>
              <span className="material-icons" style={{ fontSize: 11, color: 'var(--text-muted)' }}>calendar_today</span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
          {(task.comments ?? 0) > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span className="material-icons" style={{ fontSize: 12, color: 'var(--text-muted)' }}>chat_bubble_outline</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{task.comments}</span>
            </div>
          )}
        </div>
        {task.assignee && (
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: avatarBg(task.assignee), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }} title={task.assignee}>
            {task.assignee[0]}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Column ───────────────────────────────────────── */
const Column: React.FC<{ status: TaskStatus; label: string; icon: string; color: string; onQuickAdd: () => void }> = ({ status, label, icon, color, onQuickAdd }) => {
  const { tasks, updateTaskStatus } = useAppContext();
  const columnTasks = tasks.filter(t => t.status === status);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== status) {
      updateTaskStatus(taskId, status);
      if (status === 'done') fireConfetti(e.clientX, e.clientY);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      style={{
        flex: 1, minWidth: 300, maxWidth: 400,
        display: 'flex', flexDirection: 'column',
        background: isDragOver ? 'rgba(66,133,244,0.04)' : 'rgba(255,255,255,0.015)',
        border: `1px solid ${isDragOver ? 'var(--blue)' : 'var(--border)'}`,
        borderRadius: 16,
        transition: 'background 0.2s, border-color 0.2s',
        overflow: 'hidden',
      }}
    >
      {/* Column header */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`material-icons ${icon === 'autorenew' ? 'animate-spin-slow' : ''}`} style={{ fontSize: 18, color }}>{icon}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color, letterSpacing: '0.3px' }}>{label}</span>
          <span style={{ background: color + '22', color, border: `1px solid ${color}44`, borderRadius: 24, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>
            {columnTasks.length}
          </span>
        </div>
        <button onClick={onQuickAdd} aria-label={`Add task to ${label}`}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: 6, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = color}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'}
        >
          <span className="material-icons" style={{ fontSize: 18 }}>add</span>
        </button>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }} className="hide-scrollbar">
        <AnimatePresence>
          {columnTasks.map(task => <TaskCard key={task.id} task={task} accentColor={color} />)}
        </AnimatePresence>

        {/* Empty state */}
        {columnTasks.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '32px 16px', border: '1.5px dashed var(--border)', borderRadius: 12, color: 'var(--text-muted)' }}>
            <span className="material-icons" style={{ fontSize: 36, opacity: 0.4, color }}>{icon}</span>
            <p style={{ margin: 0, fontSize: 12, textAlign: 'center' }}>No tasks here</p>
            <button onClick={onQuickAdd} style={{ fontSize: 11, color, background: color + '15', border: `1px solid ${color}33`, borderRadius: 8, padding: '6px 14px', cursor: 'pointer' }}>+ Add Task</button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Board ────────────────────────────────────────── */
export const TaskBoard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 24px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexShrink: 0 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>Board</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>Drag cards between columns to update status</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary ripple" aria-label="Create new task">
          <span className="material-icons" style={{ fontSize: 18 }}>add</span>
          New Task
        </button>
      </div>

      {/* Columns */}
      <div style={{ display: 'flex', gap: 16, flex: 1, overflow: 'hidden' }} className="stagger animate-fade-up">
        {COLUMN_CFG.map(col => (
          <Column key={col.status} {...col} onQuickAdd={() => setIsModalOpen(true)} />
        ))}
      </div>

      <NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
