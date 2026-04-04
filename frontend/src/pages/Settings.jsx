import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Globe, Trash2, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 40, height: 22, borderRadius: 999, cursor: 'pointer', background: value ? 'var(--green)' : 'var(--surface2)', border: '1px solid var(--border)', position: 'relative', transition: 'background 0.25s', flexShrink: 0 }}>
      <motion.div animate={{ x: value ? 18 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} style={{ position: 'absolute', top: 2, width: 16, height: 16, borderRadius: '50%', background: value ? '#000' : 'var(--text-sec)' }} />
    </div>
  );
}

function SettingRow({ label, sub, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 2 }}>{sub}</div>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

const Section = ({ icon: Icon, title, children }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: '1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.25rem' }}>
      <Icon size={14} style={{ color: 'var(--green)' }} />
      <p className="label-caps">{title}</p>
    </div>
    {children}
  </motion.div>
);

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [s, setS] = useState({ push: true, sms: true, email: false, dataShare: true });
  const [lang, setLang] = useState('English');
  const [saved, setSaved] = useState(false);

  const set = k => v => setS(p => ({ ...p, [k]: v }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="label-caps">Account</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em', marginTop: 4 }}>Settings</h1>
        <p style={{ color: 'var(--text-sec)', fontSize: 13, marginTop: 4 }}>Manage your preferences, privacy, and account details.</p>
      </div>

      {/* Profile */}
      <Section icon={Shield} title="Profile">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green), var(--red))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0 }}>P</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Prathvik</div>
            <div style={{ fontSize: 12, color: 'var(--text-sec)' }}>prathvik@example.com</div>
          </div>
          <button className="btn btn-outline" style={{ fontSize: 12 }}>Edit</button>
        </div>
        {[['Date of Birth', 'January 12, 2001'], ['Blood Group', 'B+'], ['Emergency Contact', '+91 98765 43210']].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-sec)' }}>{l}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications">
        <SettingRow label="Push Notifications" sub="Real-time appointment updates" value={s.push} onChange={set('push')} />
        <SettingRow label="SMS Alerts" sub="Text reminders for upcoming visits" value={s.sms} onChange={set('sms')} />
        <SettingRow label="Email Digest" sub="Weekly health summary" value={s.email} onChange={set('email')} />
      </Section>

      {/* Privacy */}
      <Section icon={Shield} title="Privacy & Display">
        <SettingRow label="Anonymous Data Sharing" sub="Help improve AI predictions" value={s.dataShare} onChange={set('dataShare')} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Theme</div>
            <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 2 }}>Choose your interface style</div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['dark', 'light'].map(t => (
              <button key={t} onClick={() => setTheme(t)} style={{
                padding: '4px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid',
                background: theme === t ? 'var(--green)' : 'var(--surface2)',
                color: theme === t ? '#000' : 'var(--text-sec)',
                borderColor: theme === t ? 'var(--green)' : 'var(--border)',
                transition: 'all 0.15s', textTransform: 'capitalize',
              }}>{t}</button>
            ))}
          </div>
        </div>
      </Section>

      {/* Language */}
      <Section icon={Globe} title="Language & Region">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Display Language</div>
            <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 2 }}>Current: {lang}</div>
          </div>
          <select className="input" value={lang} onChange={e => setLang(e.target.value)} style={{ width: 'auto', fontSize: 13, padding: '6px 10px' }}>
            {['English', 'Hindi', 'Gujarati', 'Tamil', 'Telugu'].map(l => <option key={l} style={{ background: 'var(--surface)' }}>{l}</option>)}
          </select>
        </div>
      </Section>

      {/* Danger zone */}
      <motion.div className="card" style={{ marginBottom: '1rem', border: '1px solid rgba(248,81,73,0.25)' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '0.75rem' }}>
          <Trash2 size={14} style={{ color: 'var(--red)' }} />
          <p className="label-caps" style={{ color: 'var(--red)' }}>Danger Zone</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Delete Account</div>
            <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 2 }}>Permanently remove all data. This cannot be undone.</div>
          </div>
          <button style={{ background: 'none', border: '1px solid rgba(248,81,73,0.4)', color: 'var(--red)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', transition: 'background 0.15s' }}
            onMouseEnter={e => e.target.style.background = 'var(--red-dim)'}
            onMouseLeave={e => e.target.style.background = 'none'}>
            Delete Account
          </button>
        </div>
      </motion.div>

      {/* Save */}
      <button className="btn btn-green" onClick={save} style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 14 }}>
        {saved ? <><CheckCircle2 size={16} /> Saved!</> : 'Save Changes'}
      </button>
    </motion.div>
  );
}
