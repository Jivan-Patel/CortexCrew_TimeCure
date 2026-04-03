import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, LogIn, UserPlus, Loader2 } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } } };

export default function Login({ onSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem', position: 'relative' }}>
      {/* Aurora bg decoration */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 20% 30%, rgba(63,185,80,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(248,81,73,0.05) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div variants={fadeUp} initial="hidden" animate="show"
        style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

        {/* Logo & Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Logo size={36} />
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em' }}>
              <span style={{ color: 'var(--green)' }}>Time</span>
              <span style={{ color: 'var(--red)' }}>Cure</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-sec)', fontSize: 13 }}>Smart Appointment Scheduling System</p>
        </div>

        <div className="card" style={{ border: '1px solid var(--border)' }}>
          {/* Mode tabs */}
          <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 10, padding: 3, marginBottom: '1.5rem' }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
                flex: 1, padding: '8px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                background: mode === m ? 'var(--surface)' : 'transparent',
                color: mode === m ? 'var(--text)' : 'var(--text-sec)',
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
              }}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Full Name</label>
                  <input className="input" placeholder="Your name" value={form.username} onChange={set('username')} required={mode === 'register'} />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Email</label>
              <input className="input" type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} required autoComplete="email" />
            </div>

            <div>
              <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={set('password')} required minLength={6} style={{ paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)', padding: 2 }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '10px 12px', background: 'var(--red-dim)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 8, fontSize: 13, color: 'var(--red)' }}>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className="btn btn-green" disabled={loading} style={{ justifyContent: 'center', padding: '11px', fontSize: 14, marginTop: 4, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : mode === 'login' ? <><LogIn size={15} /> Sign In</> : <><UserPlus size={15} /> Create Account</>}
            </button>
          </form>

          {/* Demo hint */}
          <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'var(--surface2)', borderRadius: 8, fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text)' }}>Backend offline?</strong> The dashboard works with mock data — just click <span style={{ color: 'var(--green)', fontWeight: 700, cursor: 'pointer' }} onClick={() => onSuccess?.()}>Continue without login →</span>
          </div>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
