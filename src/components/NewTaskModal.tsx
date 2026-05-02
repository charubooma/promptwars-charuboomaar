import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import type { TaskPriority, TaskStatus } from '../types';

interface Props { isOpen: boolean; onClose: () => void; }

const TEAM = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
const avatarColor = (name: string) => {
  const colors = ['var(--blue)', 'var(--red)', 'var(--green)', 'var(--yellow)', 'var(--purple)'];
  return colors[name.length % colors.length];
};

export const NewTaskModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addTask } = useAppContext();
  const [title, setTitle]           = useState('');
  const [desc, setDesc]             = useState('');
  const [assignee, setAssignee]     = useState('');
  const [priority, setPriority]     = useState<TaskPriority>('Medium');
  const [status, setStatus]         = useState<TaskStatus>('todo');
  const [dueDate, setDueDate]       = useState('');
  const [calSync, setCalSync]       = useState(false);
  const [tasksSync, setTasksSync]   = useState(false);
  const [error, setError]           = useState('');

  const PRIORITY_CFG: { label: TaskPriority; color: string }[] = [
    { label: 'High',   color: 'var(--red)'    },
    { label: 'Medium', color: 'var(--yellow)' },
    { label: 'Low',    color: 'var(--green)'  },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    addTask({ title, description: desc, status, assignee: assignee || undefined, priority, dueDate: dueDate ? new Date(dueDate).toISOString() : undefined });
    setTitle(''); setDesc(''); setAssignee(''); setPriority('Medium'); setStatus('todo'); setDueDate(''); setError('');
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0F0F0F', border: '1px solid var(--border)',
    borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)',
    fontSize: 14, outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    (e.target as HTMLElement).style.borderColor = 'var(--blue)';
    (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(66,133,244,0.15)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    (e.target as HTMLElement).style.borderColor = 'var(--border)';
    (e.target as HTMLElement).style.boxShadow = 'none';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 100 }}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: '100%', maxWidth: 560,
              background: '#141414',
              border: '1px solid var(--border)',
              borderRadius: 16,
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
              zIndex: 101, overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="material-icons" style={{ color: 'var(--blue)', fontSize: 22 }}>add_task</span>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Create New Task</h2>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 8, padding: 6, display: 'flex', transition: 'color 0.2s, background 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Title */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 6 }}>Task Title *</label>
                <input
                  type="text" value={title} onChange={e => { setTitle(e.target.value); setError(''); }}
                  placeholder="What needs to be done?" autoFocus
                  style={{ ...inputStyle, fontSize: 16, padding: '12px 14px', fontWeight: 500 }}
                  onFocus={onFocus} onBlur={onBlur}
                />
                {error && <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--red)' }}>{error}</p>}
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 6 }}>Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Add more details..." rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 80 } as React.CSSProperties}
                  onFocus={onFocus as any} onBlur={onBlur as any}
                />
              </div>

              {/* Assignee */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 8 }}>Assignee</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {TEAM.map(name => (
                    <div key={name}
                      onClick={() => setAssignee(assignee === name ? '' : name)}
                      style={{
                        width: 38, height: 38, borderRadius: '50%', background: avatarColor(name),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
                        boxShadow: assignee === name ? `0 0 0 3px #141414, 0 0 0 5px var(--blue)` : 'none',
                        transition: 'box-shadow 0.2s, transform 0.2s',
                        transform: assignee === name ? 'scale(1.1)' : 'scale(1)',
                      }}
                      title={name}
                    >
                      {name[0]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority + Column */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 8 }}>Priority</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {PRIORITY_CFG.map(p => (
                      <button key={p.label} type="button"
                        onClick={() => setPriority(p.label)}
                        style={{
                          flex: 1, padding: '6px 4px', border: `1px solid ${priority === p.label ? p.color : 'var(--border)'}`,
                          borderRadius: 24, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                          background: priority === p.label ? `${p.color}22` : 'transparent',
                          color: priority === p.label ? p.color : 'var(--text-muted)',
                          transition: 'all 0.2s',
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 6 }}>Column</label>
                  <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)}
                    style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none' }}
                    onFocus={onFocus} onBlur={onBlur}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 6 }}>Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                  style={{ ...inputStyle, colorScheme: 'dark' } as React.CSSProperties}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: 24 }}>
                {[
                  { label: 'Sync to Google Calendar', state: calSync, set: setCalSync, icon: 'event', color: 'var(--blue)' },
                  { label: 'Sync to Google Tasks',    state: tasksSync, set: setTasksSync, icon: 'task_alt', color: 'var(--green)' },
                ].map(({ label, state, set, icon, color }) => (
                  <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span className="material-icons" style={{ fontSize: 16, color }}>{icon}</span>
                    {label}
                    <div onClick={() => set(!state)} style={{
                      width: 36, height: 20, borderRadius: 10,
                      background: state ? 'var(--blue)' : 'var(--border)',
                      position: 'relative', transition: 'background 0.25s', cursor: 'pointer', flexShrink: 0,
                    }}>
                      <div style={{
                        position: 'absolute', top: 2, left: state ? 18 : 2,
                        width: 16, height: 16, borderRadius: '50%', background: '#fff',
                        transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                      }} />
                    </div>
                  </label>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary ripple" style={{ flex: 2, justifyContent: 'center' }}>
                  <span className="material-icons" style={{ fontSize: 18 }}>add</span>
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
