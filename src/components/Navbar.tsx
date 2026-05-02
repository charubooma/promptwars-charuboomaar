import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export const Navbar: React.FC<{
  onToggleSidebar: () => void;
  onOpenGemini: () => void;
}> = ({ onToggleSidebar, onOpenGemini }) => {
  const { user } = useAppContext();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showApps, setShowApps] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.navbar-dropdown')) {
        setShowNotifications(false);
        setShowApps(false);
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const NOTIFICATIONS = [
    { icon: 'assignment_turned_in', color: 'var(--green)',  text: 'Alice completed Design System',     time: '2m ago' },
    { icon: 'person_add',           color: 'var(--blue)',   text: 'Bob assigned you a task',            time: '15m ago' },
    { icon: 'calendar_today',       color: 'var(--yellow)', text: 'Sprint Review in 1 hour',            time: '45m ago' },
  ];

  const APPS = [
    { icon: 'mail',           label: 'Gmail',     color: 'var(--red)'    },
    { icon: 'calendar_month', label: 'Calendar',  color: 'var(--blue)'   },
    { icon: 'folder',         label: 'Drive',     color: 'var(--yellow)' },
    { icon: 'videocam',       label: 'Meet',      color: 'var(--green)'  },
    { icon: 'table_chart',    label: 'Sheets',    color: 'var(--green)'  },
    { icon: 'description',    label: 'Docs',      color: 'var(--blue)'   },
  ];

  return (
    <header style={{
      height: 56, minHeight: 56,
      background: '#0F0F0F',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 16px',
      gap: 16,
      position: 'relative', zIndex: 30,
      flexShrink: 0,
    }}>
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', transition: 'color 0.2s, background 0.2s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
      >
        <span className="material-icons" style={{ fontSize: 22 }}>menu</span>
      </button>

      {/* Logo */}
      <span className="gradient-text-blue-purple" style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
        TeamFlow
      </span>

      {/* Search bar */}
      <div style={{ flex: 1, maxWidth: 560, margin: '0 24px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: searchFocused ? 'var(--bg-elevated)' : '#1A1A1A',
          border: `1px solid ${searchFocused ? 'var(--blue)' : 'var(--border)'}`,
          borderRadius: 40,
          padding: '0 16px',
          height: 38,
          boxShadow: searchFocused ? '0 0 0 3px rgba(66,133,244,0.15)' : 'none',
          transition: 'all 0.25s var(--ease)',
        }}>
          <span className="material-icons" style={{ fontSize: 18, color: searchFocused ? 'var(--blue)' : 'var(--text-muted)', transition: 'color 0.2s' }}>search</span>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search tasks, people, files...  ⌘K"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 13, width: '100%',
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Meet button */}
      <button
        aria-label="Start a meeting"
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(52,168,83,0.15)', border: '1px solid rgba(52,168,83,0.3)', borderRadius: 8, padding: '6px 12px', color: 'var(--green)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(52,168,83,0.25)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(52,168,83,0.15)'; }}
      >
        <span className="material-icons" style={{ fontSize: 18 }}>videocam</span>
        New Meet
      </button>

      {/* Notifications */}
      <div style={{ position: 'relative' }} className="navbar-dropdown">
        <button
          onClick={() => setShowNotifications(v => !v)}
          aria-label="Notifications"
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', position: 'relative', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
        >
          <span className="material-icons" style={{ fontSize: 22 }}>notifications</span>
          <span className="pulse-dot" style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: 'var(--red)', borderRadius: '50%', border: '1.5px solid #0F0F0F' }} />
        </button>
        {showNotifications && (
          <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 340, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', overflow: 'hidden', zIndex: 50 }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
              <span style={{ fontSize: 11, color: 'var(--blue)', cursor: 'pointer' }}>Mark all read</span>
            </div>
            {NOTIFICATIONS.map((n, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', borderBottom: i < NOTIFICATIONS.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <span className="material-icons" style={{ fontSize: 18, color: n.color, marginTop: 2 }}>{n.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.text}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apps waffle */}
      <div style={{ position: 'relative' }} className="navbar-dropdown">
        <button
          onClick={() => setShowApps(v => !v)}
          aria-label="Google apps"
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 8, borderRadius: 8, display: 'flex', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
        >
          <span className="material-icons" style={{ fontSize: 22 }}>apps</span>
        </button>
        {showApps && (
          <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 240, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', zIndex: 50 }}>
            <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>GOOGLE APPS</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {APPS.map(app => (
                <div key={app.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                >
                  <span className="material-icons" style={{ fontSize: 22, color: app.color }}>{app.icon}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{app.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div style={{ position: 'relative' }} className="navbar-dropdown">
        <div
          onClick={() => setShowProfile(v => !v)}
          style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 0 2px #0F0F0F, 0 0 0 3.5px var(--blue)' }}
          role="button" aria-label="User menu"
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{user?.initials ?? 'U'}</span>
        </div>
        {showProfile && (
          <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 240, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', overflow: 'hidden', zIndex: 50 }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>{user?.initials ?? 'U'}</div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{user?.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
            </div>
            {['View Profile', 'Settings', 'Sign Out'].map(item => (
              <div key={item} style={{ padding: '10px 16px', fontSize: 13, color: item === 'Sign Out' ? 'var(--red)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <span className="material-icons" style={{ fontSize: 18 }}>
                  {item === 'View Profile' ? 'person' : item === 'Settings' ? 'settings' : 'logout'}
                </span>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
