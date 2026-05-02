import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import {
  startOfMonth, endOfMonth, eachDayOfInterval,
  format, isSameDay, parseISO, addMonths, subMonths, getDay
} from 'date-fns';

const priorityDotColor = (p?: string) =>
  p === 'High' ? 'var(--red)' : p === 'Medium' ? 'var(--yellow)' : 'var(--green)';

export const CalendarView: React.FC = () => {
  const { tasks } = useAppContext();
  const [current, setCurrent] = useState(new Date());
  const [dir, setDir] = useState(0);
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const today = new Date();

  const first = startOfMonth(current);
  const days = eachDayOfInterval({ start: first, end: endOfMonth(current) });
  const startPad = getDay(first);

  const prev = () => { setDir(-1); setCurrent(subMonths(current, 1)); };
  const next = () => { setDir(1);  setCurrent(addMonths(current, 1)); };

  const dayTasks = (day: Date) =>
    tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day));

  const selectedTasks = selectedDay ? dayTasks(selectedDay) : [];

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d: number) => ({ x: d < 0 ? 80 : -80, opacity: 0 }),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-icons" style={{ fontSize: 18, color: 'var(--green)' }}>event</span>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Calendar</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={prev} aria-label="Previous month" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px 5px', display: 'flex', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#fff'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'}
          >
            <span className="material-icons" style={{ fontSize: 16 }}>chevron_left</span>
          </button>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', minWidth: 96, textAlign: 'center' }}>
            {format(current, 'MMMM yyyy')}
          </span>
          <button onClick={next} aria-label="Next month" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px 5px', display: 'flex', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#fff'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'}
          >
            <span className="material-icons" style={{ fontSize: 16 }}>chevron_right</span>
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '8px 12px 4px', flexShrink: 0 }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', padding: '2px 0' }}>{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ padding: '0 12px', overflow: 'hidden', flexShrink: 0 }}>
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={format(current, 'yyyy-MM')}
            custom={dir}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}
          >
            {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
            {days.map(day => {
              const dt = dayTasks(day);
              const isToday = isSameDay(day, today);
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              return (
                <div key={day.toISOString()}
                  onClick={() => setSelectedDay(isSameDay(day, selectedDay!) ? null : day)}
                  style={{
                    position: 'relative',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '4px 2px 4px',
                    borderRadius: 8, cursor: 'pointer',
                    background: isSelected ? 'rgba(66,133,244,0.15)' : isToday ? 'rgba(66,133,244,0.08)' : 'transparent',
                    border: `1px solid ${isSelected ? 'var(--blue)' : isToday ? 'rgba(66,133,244,0.4)' : 'transparent'}`,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isSelected && !isToday) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!isSelected && !isToday) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                >
                  <span style={{
                    fontSize: 11, fontWeight: isToday ? 800 : 400,
                    color: isToday ? '#fff' : 'var(--text-secondary)',
                    width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%',
                    background: isToday ? 'var(--blue)' : 'transparent',
                  }}>
                    {format(day, 'd')}
                  </span>
                  <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', marginTop: 2, minHeight: 6 }}>
                    {dt.slice(0, 3).map(t => (
                      <div key={t.id} style={{ width: 5, height: 5, borderRadius: '50%', background: priorityDotColor(t.priority) }} title={t.title} />
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Selected day tasks */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 12px' }} className="hide-scrollbar">
        {selectedDay && (
          <div>
            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {format(selectedDay, 'EEE, MMM d')}
            </p>
            {selectedTasks.length === 0 ? (
              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>No tasks due</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selectedTasks.map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'var(--bg-elevated)', borderRadius: 8, borderLeft: `3px solid ${priorityDotColor(t.priority)}` }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                    {t.assignee && <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{t.assignee}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
