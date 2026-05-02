import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

interface ChatMsg { id: string; sender: 'user' | 'ai'; text: string; taskCreated?: boolean; }

const CHIPS = ['🌅 Morning Standup', '📋 Create Sprint Tasks', '🔍 Find Blockers', '📊 Team Summary', '⚠️ Overdue Tasks', '📝 Meeting Notes'];

/** Mock Gemini AI response logic */
const mockGemini = (input: string, tasks: ReturnType<typeof useAppContext>['tasks']): { text: string; createTask?: { title: string; priority: 'High' | 'Medium' | 'Low' } } => {
  const lower = input.toLowerCase();
  if (lower.includes('standup') || lower.includes('morning')) {
    const done = tasks.filter(t => t.status === 'done').length;
    const inProg = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    return { text: `📋 **Today's Standup Summary**\n\n✅ Done: ${done} tasks\n🔄 In Progress: ${inProg} tasks\n📌 To Do: ${todo} tasks\n\nTeam velocity looks healthy! Keep it up.` };
  }
  if (lower.includes('overdue')) {
    const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done');
    return { text: overdue.length === 0 ? '🎉 No overdue tasks! Your team is on track.' : `⚠️ **${overdue.length} overdue task(s):**\n${overdue.map(t => `• "${t.title}" – assigned to ${t.assignee ?? 'unassigned'}`).join('\n')}` };
  }
  if (lower.includes('summary') || lower.includes('progress')) {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const pct = Math.round((done / total) * 100);
    return { text: `📊 **Team Progress Summary**\n\n${done}/${total} tasks completed (${pct}%)\n\nTop contributors: Alice, Bob, Charlie\nHigh priority tasks remaining: ${tasks.filter(t => t.priority === 'High' && t.status !== 'done').length}` };
  }
  if (lower.includes('blocker') || lower.includes('block')) {
    return { text: `🔍 **Potential Blockers Found**\n\n• "Firebase Realtime Sync" has no comments — may need a review.\n• "Mobile Responsive Layout" is past its estimated start date.\n\nConsider scheduling a sync to unblock the team.` };
  }
  if (lower.includes('create') || lower.includes('add task') || lower.includes('new task')) {
    const titleMatch = input.match(/(?:create|add|make)(?:\s+a)?\s+(?:task\s+)?(?:for\s+\w+\s+)?(?:to\s+)?(.+?)(?:\s+(?:high|medium|low)\s+priority)?(?:\s+due\s+.+)?$/i);
    const title = titleMatch ? titleMatch[1].trim() : 'New AI Generated Task';
    const priority = lower.includes('high') ? 'High' : lower.includes('low') ? 'Low' : 'Medium';
    return { text: `✅ I've created the task **"${title}"** with ${priority} priority and added it to your To Do column!`, createTask: { title, priority } };
  }
  if (lower.includes('meeting notes') || lower.includes('meeting')) {
    return { text: `📝 **Meeting Notes → Tasks**\n\nPaste your meeting notes below and I'll extract actionable tasks for you. I can also schedule a follow-up in Google Calendar!` };
  }
  return { text: `I can help you manage tasks, generate standups, find blockers, summarize progress, and more!\n\nTry: "Create a high priority task for Alice to review the API docs by Friday"` };
};

interface Props { isOpen: boolean; onClose: () => void; }

export const GeminiPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const { tasks, addTask } = useAppContext();
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { id: '0', sender: 'ai', text: '👋 Hi! I\'m Gemini. Ask me to create tasks, summarize progress, find blockers, or anything else about your TeamFlow board!' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const send = (text: string = input.trim()) => {
    if (!text) return;
    const userMsg: ChatMsg = { id: Date.now().toString(), sender: 'user', text };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const { text: aiText, createTask } = mockGemini(text, tasks);
      if (createTask) {
        addTask({ title: createTask.title, description: `Created by Gemini AI`, status: 'todo', priority: createTask.priority });
      }
      setMsgs(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiText, taskCreated: !!createTask }]);
      setTyping(false);
    }, 1200 + Math.random() * 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 60 }}
            className="lg:hidden"
          />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0,
              width: 420, maxWidth: '100vw',
              background: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column',
              zIndex: 70, boxShadow: '-16px 0 48px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--blue),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(161,66,244,0.3)', flexShrink: 0 }}>
                <span className="material-icons animate-spin-slow" style={{ fontSize: 20, color: '#fff' }}>auto_awesome</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, background: 'linear-gradient(135deg,var(--blue),var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Assistant</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Powered by Gemini</div>
              </div>
              <button onClick={onClose} aria-label="Close AI panel"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 8, padding: 6, display: 'flex', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#fff'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'}
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            {/* Chips */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0 }} className="hide-scrollbar">
              {CHIPS.map(chip => (
                <button key={chip} onClick={() => send(chip)}
                  style={{ whiteSpace: 'nowrap', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 24, padding: '5px 12px', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--blue)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }} className="hide-scrollbar">
              {msgs.map(msg => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '88%',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.sender === 'user' ? 'var(--blue)' : 'var(--bg-elevated)',
                    borderLeft: msg.sender === 'ai' ? '3px solid var(--purple)' : 'none',
                    border: msg.sender === 'ai' ? '1px solid var(--border)' : 'none',
                    fontSize: 12, color: '#fff', lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(66,133,244,0.3)' : 'none',
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderLeft: '3px solid var(--purple)', display: 'flex', gap: 4 }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay }}
                        style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)' }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, background: 'rgba(255,255,255,0.01)', flexShrink: 0 }}>
              <div style={{ flex: 1, background: '#0F0F0F', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', padding: '0 12px', transition: 'border-color 0.2s' }}>
                <input
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder="Ask Gemini anything..."
                  style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 13, flex: 1, padding: '10px 0' }}
                  aria-label="Chat input"
                />
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 4 }}>
                  <span className="material-icons" style={{ fontSize: 18 }}>mic</span>
                </button>
              </div>
              <button onClick={() => send()}
                style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,var(--blue),var(--purple))', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(66,133,244,0.3)', transition: 'transform 0.2s, box-shadow 0.2s', flexShrink: 0 }}
                aria-label="Send message"
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(161,66,244,0.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(66,133,244,0.3)'; }}
              >
                <span className="material-icons" style={{ fontSize: 20 }}>send</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
