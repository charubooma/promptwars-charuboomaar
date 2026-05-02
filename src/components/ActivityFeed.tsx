import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

const avatarBg = (name: string) => {
  const c = ['var(--blue)', 'var(--red)', 'var(--green)', 'var(--yellow)', 'var(--purple)'];
  return c[name.length % c.length];
};

const actionIcon = (action: string) => {
  if (action.includes('moved') || action.includes('moved to'))  return { icon: 'swap_horiz',     color: 'var(--yellow)' };
  if (action.includes('created'))                               return { icon: 'add_circle',      color: 'var(--blue)'   };
  if (action.includes('completed') || action.includes('Done'))  return { icon: 'check_circle',    color: 'var(--green)'  };
  if (action.includes('deleted'))                               return { icon: 'delete',           color: 'var(--red)'    };
  if (action.includes('comment'))                               return { icon: 'chat_bubble',      color: 'var(--purple)' };
  if (action.includes('started'))                               return { icon: 'play_circle',      color: 'var(--yellow)' };
  return                                                               { icon: 'notifications',    color: 'var(--text-muted)' };
};

export const ActivityFeed: React.FC = () => {
  const { activities } = useAppContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
      {/* Top color strip */}
      <div style={{ height: 3, background: 'linear-gradient(90deg,var(--blue),var(--red),var(--yellow),var(--green))', flexShrink: 0 }} />

      {/* Header */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-icons" style={{ fontSize: 18, color: 'var(--text-secondary)' }}>history</span>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Team Activity</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--blue)', cursor: 'pointer' }}>View all</span>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }} className="hide-scrollbar">
        {activities.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, color: 'var(--text-muted)' }}>
            <span className="material-icons" style={{ fontSize: 40, opacity: 0.3 }}>history</span>
            <p style={{ margin: 0, fontSize: 12 }}>No activity yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AnimatePresence>
              {activities.map((a, idx) => {
                const { icon, color } = actionIcon(a.action);
                const isNewest = idx === 0;
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    style={{
                      display: 'flex', gap: 10, padding: '10px 10px',
                      borderRadius: 10,
                      background: isNewest ? 'rgba(66,133,244,0.05)' : 'transparent',
                      border: `1px solid ${isNewest ? 'rgba(66,133,244,0.15)' : 'transparent'}`,
                      animation: isNewest ? 'none' : undefined,
                      transition: 'background 0.3s',
                    }}
                  >
                    {/* Avatar */}
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: avatarBg(a.userName), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {a.userName[0]}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: 'var(--text-primary)' }}>
                        <span style={{ fontWeight: 600 }}>{a.userName}</span>{' '}
                        <span style={{ color: 'var(--text-secondary)' }}>{a.action}</span>{' '}
                        <span style={{ fontWeight: 500, color: '#fff' }}>"{a.target}"</span>
                      </p>
                      <p style={{ margin: '3px 0 0', fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span className="material-icons" style={{ fontSize: 11 }}>schedule</span>
                        {formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })}
                      </p>
                    </div>

                    {/* Action icon */}
                    <span className="material-icons" style={{ fontSize: 16, color, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
