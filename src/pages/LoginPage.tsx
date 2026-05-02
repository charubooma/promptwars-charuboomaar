import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import type { User } from '../types';

/** Animated background orb */
const Orb: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div style={{
    position: 'absolute', borderRadius: '50%',
    filter: 'blur(80px)', opacity: 0.2, pointerEvents: 'none',
    animation: 'mesh-move 14s ease-in-out infinite',
    ...style,
  }} />
);

/** Small app preview card — corner elements */
const PreviewCard: React.FC<{ children: React.ReactNode; style: React.CSSProperties; delay?: number }> = ({ children, style, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 + delay, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    style={{
      position: 'absolute',
      background: 'rgba(20,20,20,0.75)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      padding: '14px 16px',
      animation: `float ${4 + delay * 0.5}s ease-in-out ${delay}s infinite`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      ...style,
    }}
  >
    {children}
  </motion.div>
);

export const LoginPage: React.FC = () => {
  const { login } = useAppContext();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  const handleLogin = () => {
    const mockUser: User = { name: 'Charu Boomaar', email: 'charu@gmail.com', initials: 'CB' };
    login(mockUser);
  };

  // Subtle parallax transform for the decorative cards only
  const px = (depth: number) => ({
    transform: `translate(${mousePos.x * depth}px, ${mousePos.y * depth}px)`,
    transition: 'transform 0.15s ease-out',
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0A0A0A', overflow: 'hidden', fontFamily: "'Montserrat', sans-serif" }}>

      {/* Ambient gradient orbs — corners only, far from center */}
      <Orb style={{ width: 500, height: 500, top: '-10%', left: '-5%',  background: 'var(--blue)',   animationDelay: '0s'   }} />
      <Orb style={{ width: 400, height: 400, top: '-8%',  right: '-5%', background: 'var(--red)',    animationDelay: '-5s'  }} />
      <Orb style={{ width: 450, height: 450, bottom: '-12%', left: '5%',  background: 'var(--purple)', animationDelay: '-3s'  }} />
      <Orb style={{ width: 350, height: 350, bottom: '-8%', right: '8%', background: 'var(--green)',  animationDelay: '-9s'  }} />

      {/* Corner preview cards with parallax */}
      <div style={{ ...px(6), position: 'absolute', inset: 0, pointerEvents: 'none' }}>

        {/* TOP LEFT — Kanban preview */}
        <PreviewCard delay={0} style={{ top: 48, left: 40, width: 220 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="material-icons" style={{ color: 'var(--blue)', fontSize: 16 }}>view_kanban</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.3px' }}>Kanban Board</span>
          </div>
          {[
            { label: 'Design System', status: 'Done',        color: 'var(--green)'  },
            { label: 'Auth Integration', status: 'In Progress', color: 'var(--yellow)' },
            { label: 'Mobile Layout',  status: 'To Do',      color: 'var(--blue)'   },
          ].map(t => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', marginBottom: 4, borderLeft: `3px solid ${t.color}` }}>
              <span style={{ flex: 1, fontSize: 10, color: 'var(--text-secondary)' }}>{t.label}</span>
              <span style={{ fontSize: 9, color: t.color, fontWeight: 600 }}>{t.status}</span>
            </div>
          ))}
        </PreviewCard>

        {/* TOP RIGHT — Activity feed preview */}
        <PreviewCard delay={0.3} style={{ top: 48, right: 40, width: 210 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Team Activity</div>
          {[
            { user: 'Alice', action: 'completed Design System', icon: 'check_circle', color: 'var(--green)' },
            { user: 'Bob',   action: 'created Sprint Review',   icon: 'add_circle',   color: 'var(--blue)'  },
            { user: 'Diana', action: 'commented on Kanban UI',  icon: 'chat_bubble',  color: 'var(--purple)' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
              <span className="material-icons" style={{ fontSize: 13, color: a.color, marginTop: 1, flexShrink: 0 }}>{a.icon}</span>
              <p style={{ margin: 0, fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>{a.user}</span> {a.action}
              </p>
            </div>
          ))}
        </PreviewCard>

        {/* BOTTOM LEFT — Calendar preview */}
        <PreviewCard delay={0.6} style={{ bottom: 48, left: 40, width: 190 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="material-icons" style={{ color: 'var(--green)', fontSize: 16 }}>event</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>May 2026</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>{d}</div>
            ))}
            {Array.from({ length: 31 }, (_, i) => (
              <div key={i} style={{
                fontSize: 9, textAlign: 'center', padding: '2px 0', borderRadius: 4,
                background: i === 1 ? 'var(--blue)' : i === 7 || i === 14 || i === 21 ? 'rgba(52,168,83,0.2)' : 'transparent',
                color: i === 1 ? '#fff' : 'var(--text-secondary)',
                fontWeight: i === 1 ? 700 : 400,
              }}>
                {i + 1}
              </div>
            ))}
          </div>
        </PreviewCard>

        {/* BOTTOM RIGHT — Gemini AI preview */}
        <PreviewCard delay={0.9} style={{ bottom: 48, right: 40, width: 210 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="material-icons" style={{ fontSize: 16, background: 'linear-gradient(135deg,var(--blue),var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>auto_awesome</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Gemini AI</span>
            <span style={{ marginLeft: 'auto', fontSize: 8, background: 'rgba(161,66,244,0.2)', color: 'var(--purple)', border: '1px solid rgba(161,66,244,0.3)', borderRadius: 10, padding: '2px 6px', fontWeight: 700 }}>LIVE</span>
          </div>
          <div style={{ background: 'rgba(66,133,244,0.12)', borderRadius: 8, padding: '7px 10px', fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6, borderLeft: '2px solid var(--blue)' }}>
            "Create a task for Bob to fix login bug — high priority"
          </div>
          <div style={{ background: 'rgba(161,66,244,0.12)', borderRadius: 8, padding: '7px 10px', fontSize: 10, color: 'var(--text-secondary)', borderLeft: '2px solid var(--purple)' }}>
            ✅ Done! Task created and assigned to Bob.
          </div>
        </PreviewCard>
      </div>

      {/* Center login panel — completely isolated, never overlapped */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
            background: 'rgba(20,20,20,0.6)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24, padding: '48px 56px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            minWidth: 380, maxWidth: 440,
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'linear-gradient(135deg, var(--blue) 0%, var(--purple) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 28px rgba(66,133,244,0.45)',
            }}>
              <span className="material-icons" style={{ color: '#fff', fontSize: 28 }}>grid_view</span>
            </div>
            <h1 style={{
              margin: 0, fontSize: 42, fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1,
              background: 'linear-gradient(135deg, var(--blue) 0%, var(--purple) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              TeamFlow
            </h1>
          </div>

          {/* Tagline */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
              Your team. Your flow.
            </p>
            <p style={{
              margin: '4px 0 0', fontSize: 15, fontWeight: 700,
              background: 'linear-gradient(90deg, var(--blue), var(--red), var(--yellow), var(--green))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Supercharged by Google.
            </p>
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* Google Sign-In button */}
          <button
            onClick={handleLogin}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              width: '100%',
              background: '#ffffff', color: '#3c4043',
              border: '1px solid #dadce0',
              borderRadius: 12, padding: '13px 24px',
              fontSize: 14, fontWeight: 700,
              fontFamily: "'Montserrat', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
              transition: 'box-shadow 0.25s ease, transform 0.25s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.35)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign in with Google
          </button>

          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
            By signing in, you agree to our Terms and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
};
