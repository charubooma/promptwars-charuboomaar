import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { TaskBoard } from './components/TaskBoard';
import { CalendarView } from './components/CalendarView';
import { ActivityFeed } from './components/ActivityFeed';
import { GeminiPanel } from './components/GeminiPanel';
import { ToastContainer } from './components/ToastContainer';
import { LoginPage } from './pages/LoginPage';
import { useAppContext } from './context/AppContext';

/**
 * Main application shell.
 * Shows login page when logged out, full dashboard when logged in.
 */
const AppShell: React.FC = () => {
  const { isLoggedIn } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [geminiOpen, setGeminiOpen] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!isLoggedIn ? (
        <motion.div key="login" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.4 }}>
          <LoginPage />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}
        >
          {/* Top navbar */}
          <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} onOpenGemini={() => setGeminiOpen(true)} />

          {/* Body: sidebar + main + right panel */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
            {/* Left sidebar */}
            <Sidebar isOpen={sidebarOpen} />

            {/* Main Kanban area */}
            <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <TaskBoard />
            </main>

            {/* Right panel: calendar + activity */}
            <aside style={{
              width: 320,
              minWidth: 320,
              background: '#0F0F0F',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <div style={{ flex: '0 0 52%', overflow: 'hidden', padding: '16px 16px 8px' }}>
                <CalendarView />
              </div>
              <div style={{ flex: '0 0 48%', overflow: 'hidden', padding: '8px 16px 16px' }}>
                <ActivityFeed />
              </div>
            </aside>
          </div>

          {/* Gemini FAB */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGeminiOpen(true)}
            aria-label="Open Gemini AI assistant"
            title="Ask Gemini"
            style={{
              position: 'fixed', bottom: 28, right: 28,
              width: 56, height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--blue) 0%, var(--purple) 100%)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(66,133,244,0.4)',
              zIndex: 50,
              transition: 'box-shadow 0.25s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(161,66,244,0.5)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(66,133,244,0.4)'}
          >
            <span className="material-icons animate-spin-slow" style={{ color: '#fff', fontSize: 26 }}>auto_awesome</span>
          </motion.button>

          {/* Gemini slide-in panel */}
          <GeminiPanel isOpen={geminiOpen} onClose={() => setGeminiOpen(false)} />

          {/* Toast stack */}
          <ToastContainer />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return <AppShell />;
}
