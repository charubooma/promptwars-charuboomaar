import React from 'react';
import { useAppContext } from '../context/AppContext';

type NavItem = {
  icon: string;
  label: string;
  color: string;
  view: string;
};

const NAV_ITEMS: NavItem[] = [
  { icon: 'grid_view',      label: 'Dashboard',  color: 'var(--blue)',   view: 'dashboard'  },
  { icon: 'view_kanban',    label: 'Board',       color: 'var(--blue)',   view: 'board'      },
  { icon: 'calendar_month', label: 'Calendar',    color: 'var(--green)',  view: 'calendar'   },
  { icon: 'folder',         label: 'Drive',       color: 'var(--yellow)', view: 'drive'      },
  { icon: 'videocam',       label: 'Meet',        color: 'var(--red)',    view: 'meet'       },
  { icon: 'mail',           label: 'Gmail',       color: 'var(--blue)',   view: 'gmail'      },
  { icon: 'group',          label: 'Team',        color: 'var(--purple)', view: 'team'       },
  { icon: 'bar_chart',      label: 'Analytics',   color: 'var(--green)',  view: 'analytics'  },
];

interface Props {
  isOpen: boolean;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<Props> = ({ isOpen, activeView, onViewChange }) => {
  const { user, logout, showToast } = useAppContext();

  const handleClick = (item: NavItem) => {
    // Board is fully implemented; others show coming-soon toast
    if (item.view === 'board' || item.view === 'dashboard') {
      onViewChange(item.view);
    } else if (item.view === 'meet') {
      // Simulate opening Meet
      const meetUrl = 'https://meet.google.com/new';
      showToast(`🎥 Opening Google Meet...`, 'info');
      onViewChange(item.view);
      window.open(meetUrl, '_blank');
    } else if (item.view === 'gmail') {
      showToast(`📧 Opening Gmail...`, 'info');
      window.open('https://mail.google.com', '_blank');
    } else if (item.view === 'drive') {
      showToast(`📁 Opening Google Drive...`, 'info');
      window.open('https://drive.google.com', '_blank');
    } else {
      onViewChange(item.view);
      showToast(`🔜 ${item.label} — coming soon!`, 'info');
    }
  };

  return (
    <aside
      aria-label="Main navigation"
      style={{
        width: isOpen ? 64 : 0,
        minWidth: isOpen ? 64 : 0,
        background: '#0F0F0F',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12,
        gap: 4,
        overflowX: 'hidden',
        transition: 'width 0.25s var(--ease), min-width 0.25s var(--ease)',
        zIndex: 20,
        flexShrink: 0,
      }}
    >
      {/* TeamFlow logo */}
      <div style={{ marginBottom: 12, padding: '4px 0' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg, var(--blue), var(--purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(66,133,244,0.35)',
          cursor: 'pointer',
        }}>
          <span className="material-icons" style={{ color: '#fff', fontSize: 22 }}>grid_view</span>
        </div>
      </div>

      <div style={{ width: 32, height: 1, background: 'var(--border)', margin: '4px 0 8px' }} />

      {/* Nav items */}
      {NAV_ITEMS.map(item => {
        const isActive = activeView === item.view || (activeView === 'dashboard' && item.view === 'board');
        return (
          <div
            key={item.label}
            className="sidebar-item"
            onClick={() => handleClick(item)}
            onKeyDown={e => e.key === 'Enter' && handleClick(item)}
            role="button"
            tabIndex={0}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            style={{
              position: 'relative',
              width: 48, height: 48,
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              background: isActive ? `${item.color}18` : 'transparent',
              boxShadow: isActive ? `inset 3px 0 0 ${item.color}` : 'none',
              transition: 'background 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => {
              if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={e => {
              if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
            }}
          >
            <span
              className={`material-icons ${isActive && item.icon === 'autorenew' ? 'animate-spin-slow' : ''}`}
              style={{
                fontSize: 22,
                color: isActive ? item.color : 'var(--text-secondary)',
                transition: 'color 0.2s ease',
              }}
            >
              {item.icon}
            </span>
            <span className="sidebar-tooltip">{item.label}</span>
          </div>
        );
      })}

      {/* Gemini AI */}
      <div style={{ margin: '8px 0 4px', width: 32, height: 1, background: 'var(--border)' }} />
      <div
        className="sidebar-item"
        onClick={() => { showToast('Opening Gemini AI...', 'info'); onViewChange('gemini'); }}
        role="button" tabIndex={0} aria-label="Gemini AI"
        style={{
          position: 'relative',
          width: 48, height: 48, borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          background: activeView === 'gemini' ? 'rgba(161,66,244,0.15)' : 'transparent',
          boxShadow: activeView === 'gemini' ? 'inset 3px 0 0 var(--purple)' : 'none',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { if (activeView !== 'gemini') (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'; }}
        onMouseLeave={e => { if (activeView !== 'gemini') (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
      >
        <span className="material-icons" style={{
          fontSize: 22,
          background: 'linear-gradient(135deg,var(--blue),var(--purple))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>auto_awesome</span>
        <span className="sidebar-tooltip">Gemini AI</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Settings */}
      <div className="sidebar-item"
        style={{ position: 'relative', width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        onClick={() => showToast('Settings — coming soon!', 'info')}
        role="button" tabIndex={0} aria-label="Settings"
        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
      >
        <span className="material-icons" style={{ fontSize: 22, color: 'var(--text-muted)' }}>settings</span>
        <span className="sidebar-tooltip">Settings</span>
      </div>

      {/* User avatar */}
      <div
        className="sidebar-item"
        onClick={logout}
        tabIndex={0} role="button" aria-label="Sign out"
        style={{
          position: 'relative',
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg,var(--blue),var(--green))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 0 0 2px #0F0F0F, 0 0 0 3.5px var(--green)',
          marginTop: 4,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: "'Montserrat', sans-serif" }}>
          {user?.initials ?? 'U'}
        </span>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, background: 'var(--green)', borderRadius: '50%', border: '1.5px solid #0F0F0F' }} />
        <span className="sidebar-tooltip">Sign Out ({user?.name})</span>
      </div>
    </aside>
  );
};
