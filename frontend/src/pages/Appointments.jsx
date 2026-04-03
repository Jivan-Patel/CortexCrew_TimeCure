import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Plus, X, ChevronRight, User } from 'lucide-react';

const MOCK = [
  { id: 1, dr: 'Dr. Sarah Jenkins', spec: 'Cardiology', date: '2026-04-10', time: '10:30 AM', status: 'Upcoming', wait: 18 },
  { id: 2, dr: 'Dr. Rahul Patel', spec: 'General Physician', date: '2026-03-28', time: '09:00 AM', status: 'Completed', wait: 0 },
  { id: 3, dr: 'Dr. Aisha Khan', spec: 'Dermatology', date: '2026-02-10', time: '11:15 AM', status: 'Completed', wait: 0 },
  { id: 4, dr: 'Dr. James Ortega', spec: 'Orthopedics', date: '2026-01-05', time: '03:00 PM', status: 'Cancelled', wait: 0 },
];
const SPECS = ['Cardiology', 'Dermatology', 'General Physician', 'Neurology', 'Orthopedics', 'Psychiatry', 'ENT'];
const FILTERS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

export default function Appointments() {
  const [list, setList] = useState(MOCK);
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ dr: '', spec: SPECS[0], date: '', time: '10:00' });

  const filtered = filter === 'All' ? list : list.filter(a => a.status === filter);

  const book = () => {
    if (!form.dr || !form.date) return;
    setList(p => [{ id: Date.now(), ...form, status: 'Upcoming', wait: Math.floor(Math.random() * 20) + 8 }, ...p]);
    setModal(false);
    setForm({ dr: '', spec: SPECS[0], date: '', time: '10:00' });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem' }}>
        <div>
          <p className="label-caps">Healthcare</p>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em', marginTop: 4 }}>Appointments</h1>
          <p style={{ color: 'var(--text-sec)', fontSize: 13, marginTop: 4 }}>Track and manage all your medical visits.</p>
        </div>
        <button className="btn btn-green" onClick={() => setModal(true)}><Plus size={15} /> Book New</button>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid',
            background: filter === f ? 'var(--green)' : 'transparent',
            color: filter === f ? '#000' : 'var(--text-sec)',
            borderColor: filter === f ? 'var(--green)' : 'var(--border)',
            transition: 'all 0.15s',
          }}>{f}</button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-sec)', alignSelf: 'center' }}>
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <AnimatePresence>
          {filtered.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ delay: i * 0.04, duration: 0.3 }}
              className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, var(--green-dim), var(--red-dim))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: 'var(--green)', flexShrink: 0, border: '1px solid var(--border)' }}>
                {a.dr.split(' ')[1][0]}
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{a.dr}</div>
                <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 2 }}>{a.spec}</div>
              </div>
              <div style={{ display: 'flex', align: 'center', gap: 6, fontSize: 12, color: 'var(--text-sec)' }}>
                <Calendar size={13} style={{ color: 'var(--green)', flexShrink: 0 }} /> {a.date}
              </div>
              <div style={{ display: 'flex', align: 'center', gap: 6, fontSize: 12, color: 'var(--text-sec)' }}>
                <Clock size={13} style={{ color: 'var(--red)', flexShrink: 0 }} /> {a.time}
              </div>
              {a.status === 'Upcoming' && <div style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600, whiteSpace: 'nowrap' }}>~{a.wait} min wait</div>}
              <span className={`badge badge-${a.status === 'Upcoming' ? 'green' : a.status === 'Completed' ? 'green' : 'red'}`}>{a.status}</span>
              <ChevronRight size={15} style={{ color: 'var(--border)' }} />
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-sec)' }}>
            <User size={36} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ fontWeight: 600 }}>No appointments found</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setModal(false)}>
            <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
              onClick={e => e.stopPropagation()} className="card"
              style={{ width: '100%', maxWidth: 420, border: '1px solid rgba(63,185,80,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: 800, fontSize: 17 }}>Book Appointment</h2>
                <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)', padding: 4 }}><X size={18} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Doctor Name</label>
                  <input className="input" placeholder="e.g. Dr. Sarah Jenkins" value={form.dr} onChange={e => setForm(f => ({ ...f, dr: e.target.value }))} />
                </div>
                <div>
                  <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Specialty</label>
                  <select className="input" value={form.spec} onChange={e => setForm(f => ({ ...f, spec: e.target.value }))}>
                    {SPECS.map(s => <option key={s} style={{ background: 'var(--surface)' }}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Date</label>
                    <input type="date" className="input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label-caps" style={{ display: 'block', marginBottom: 6 }}>Time</label>
                    <input type="time" className="input" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                  </div>
                </div>
                <button className="btn btn-green" onClick={book} style={{ marginTop: 4, justifyContent: 'center', width: '100%', padding: '10px' }}>
                  Confirm Appointment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
