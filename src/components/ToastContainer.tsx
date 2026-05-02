import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

/** Toast notification stack — bottom right */
export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useAppContext();

  const icon = (type: string) => {
    if (type === 'success') return { icon: 'check_circle', color: 'var(--green)' };
    if (type === 'error')   return { icon: 'error',        color: 'var(--red)'   };
    return                         { icon: 'info',          color: 'var(--blue)'  };
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
      <AnimatePresence>
        {toasts.map(t => {
          const { icon: ic, color } = icon(t.type);
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderLeft: `4px solid ${color}`,
                borderRadius: 12,
                padding: '12px 16px',
                maxWidth: 320,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <span className="material-icons" style={{ fontSize: 18, color }}>{ic}</span>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>{t.message}</span>
              <button onClick={() => dismissToast(t.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <span className="material-icons" style={{ fontSize: 16 }}>close</span>
              </button>
              {/* Auto-dismiss progress bar */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, background: color, width: '100%', animation: 'toast-progress 4s linear forwards' }} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
