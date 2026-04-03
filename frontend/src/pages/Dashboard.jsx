import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Clock, Calendar, CheckCircle2, Heart, Activity, Bell, ArrowUpRight, ChevronRight, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import Card3D from '../components/Card3D';
import { useAuth } from '../hooks/useAuth';
import { useQueue } from '../hooks/useQueue';

/* ── Mock data ─────────────────────── */
const pieData = [
  { name: 'On Time', value: 72 },
  { name: 'Delayed', value: 18 },
  { name: 'Cancelled', value: 10 },
];
const PIE_COLORS = ['#3fb950', '#f85149', '#6e7681'];

const barData = [
  { m: 'Oct', v: 1 }, { m: 'Nov', v: 2 }, { m: 'Dec', v: 1 },
  { m: 'Jan', v: 3 }, { m: 'Feb', v: 1 }, { m: 'Mar', v: 4 }, { m: 'Apr', v: 2 },
];

const recentAppts = [
  { id: 1, dr: 'Dr. Sarah Jenkins', spec: 'Cardiology', date: 'Apr 10, 2026', status: 'Upcoming', wait: 18 },
  { id: 2, dr: 'Dr. Rahul Patel', spec: 'General Physician', date: 'Mar 28, 2026', status: 'Completed', wait: 0 },
  { id: 3, dr: 'Dr. Aisha Khan', spec: 'Dermatology', date: 'Feb 10, 2026', status: 'Cancelled', wait: 0 },
];

const notifications = [
  { id: 1, text: 'Dr. Jenkins confirmed your appointment for Apr 10.', t: '2m ago', type: 'green' },
  { id: 2, text: 'Queue updated — you are now #2 in line.', t: '8m ago', type: 'green' },
  { id: 3, text: 'Your last visit report is ready to view.', t: '1h ago', type: 'muted' },
];

/* ── Helpers ───────────────────────── */
function useCountUp(target, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px' }}>
      <div style={{ fontSize: 11, color: 'var(--text-sec)', marginBottom: 2 }}>{label || payload[0].name}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--green)' }}>{payload[0].value}{typeof payload[0].value === 'number' && payload[0].name !== 'visits' ? '%' : ''}</div>
    </div>
  );
};

/* ── Stat card ─────────────────────── */
function StatCard({ label, value, unit, icon: Icon, color = 'var(--green)', delay = 0 }) {
  const n = useCountUp(parseInt(value));
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ padding: '8px', background: color + '18', borderRadius: 8 }}><Icon size={16} style={{ color }} /></div>
        <ArrowUpRight size={14} style={{ color: 'var(--text-sec)', opacity: 0.5 }} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>{n}<span style={{ fontSize: 14, color: 'var(--text-sec)', fontWeight: 600, marginLeft: 4 }}>{unit}</span></div>
        <div className="label-caps" style={{ marginTop: 4 }}>{label}</div>
      </div>
    </motion.div>
  );
}

/* ── Queue Stepper ─────────────────── */
const STAGES = ['Waiting', 'Next', 'Consulting', 'Done'];
function QueueStepper({ stage = 0 }) {
  return (
    <div className="stepper">
      {STAGES.map((s, i) => (
        <React.Fragment key={s}>
          {i > 0 && <div className={`step-connector${i <= stage ? ' done' : ''}`} />}
          <div className="step-node" style={{ flexDirection: 'column', width: 'auto', height: 'auto', borderRadius: 0, gap: 6, background: 'transparent', border: 'none' }}>
            <div className={`step-node${i < stage ? ' done' : i === stage ? ' active' : ''}`}>
              {i < stage ? '✓' : i + 1}
            </div>
            <div style={{ fontSize: 10, color: i === stage ? 'var(--green)' : 'var(--text-sec)', fontWeight: 600, whiteSpace: 'nowrap' }}>{s}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Main component ─────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] } }) };

export default function Dashboard() {
  const { user, role } = useAuth();
  const { queue, stats, isLive, lastUpdated, error, refresh, myWaitTime } = useQueue();
  const [showNotif, setShowNotif] = useState(false);

  // Find current user's position in queue (first 'waiting' entry as demo)
  const myEntry = queue.find(p => p.status === 'waiting' || p.status === 'in-progress');
  const myIndex = myEntry ? queue.indexOf(myEntry) : 0;
  const waitTime = myEntry ? (myEntry.waitTime ?? myWaitTime(myIndex)) : 23;
  const queuePos = myIndex + 1;
  const stage = myEntry?.status === 'in-progress' ? 1 : myEntry?.status === 'waiting' ? 0 : 2;

  // Dynamic AI insight from live stats
  const efficiency = stats.total > 0
    ? Math.round(((stats.done + stats.inProgress) / stats.total) * 100)
    : 87;
  const highRiskCount = queue.filter(p => (p.noShowProb ?? 0) > 0.4).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <p className="label-caps">Welcome back</p>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em', marginTop: 4 }}>
            Good evening, Prathvik
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-outline"
            onClick={() => setShowNotif(v => !v)}
            style={{ position: 'relative' }}
          >
            <Bell size={15} />
            <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: 'var(--red)', border: '2px solid var(--bg)' }} />
          </button>
          <button className="btn btn-green"><Activity size={15} /> Live Status</button>
        </div>
      </div>

      {/* Notification drawer */}
      <AnimatePresence>
        {showNotif && (
          <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }}
            className="card" style={{ marginBottom: '1.25rem', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <p className="label-caps" style={{ marginBottom: '0.75rem' }}>Notifications</p>
            {notifications.map(n => (
              <div key={n.id} style={{ display: 'flex', gap: 10, padding: '0.625rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.type === 'green' ? 'var(--green)' : 'var(--text-sec)', marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 13 }}>{n.text}</div>
                <div style={{ fontSize: 11, color: 'var(--text-sec)', whiteSpace: 'nowrap' }}>{n.t}</div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BENTO GRID ── */}
      <div className="bento">

        {/* Hero: Wait Time — span 3 cols, 2 rows */}
        <div style={{ gridColumn: 'span 3', gridRow: 'span 2' }}>
          <Card3D style={{ height: '100%', minHeight: 240 }} intensity={6}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '100%', background: 'radial-gradient(ellipse at right, rgba(63,185,80,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div className="label-caps" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: isLive ? 'var(--green)' : 'var(--red)', display: 'inline-block', boxShadow: `0 0 0 3px ${isLive ? 'var(--green-dim)' : 'var(--red-dim)'}` }} />
                {isLive ? 'Live — port 4000' : 'Offline — mock data'}
              </div>
              <button onClick={refresh} title="Refresh queue" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)', padding: 2, display: 'flex' }}>
                {isLive ? <Wifi size={13} style={{ color: 'var(--green)' }} /> : <RefreshCw size={13} />}
              </button>
            </div>
            <div style={{ marginTop: '1.25rem' }}>
              <AnimatePresence mode="popLayout">
                <motion.div key={waitTime} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
                  <span className="hero-number">{waitTime}</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-sec)', marginLeft: 8 }}>min</span>
                </motion.div>
              </AnimatePresence>
              <p style={{ color: 'var(--text-sec)', fontSize: 14, marginTop: 6 }}>Estimated wait time</p>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <QueueStepper stage={stage} />
            </div>
          </Card3D>
        </div>

        {/* Queue Position — span 1, row 1 */}
        <div style={{ gridColumn: 'span 1' }}>
          <Card3D intensity={10} style={{ height: '100%' }}>
            <div className="label-caps">Queue Position</div>
            <AnimatePresence mode="popLayout">
              <motion.div key={queuePos} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 360, damping: 28 }}>
                <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginTop: '0.75rem', color: queuePos === 1 ? 'var(--green)' : 'var(--text)' }}>
                  #{queuePos}
                </div>
              </motion.div>
            </AnimatePresence>
            <div style={{ marginTop: '0.5rem', fontSize: 13, color: 'var(--text-sec)' }}>
              {queuePos === 1 ? 'You are next! 🎉' : `${queuePos - 1} patient${queuePos > 2 ? 's' : ''} ahead`}
            </div>
            {/* Mini progress bar */}
            <div style={{ marginTop: '1rem', height: 4, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden' }}>
              <motion.div style={{ height: '100%', background: 'var(--green)', borderRadius: 99 }} animate={{ width: `${((5 - queuePos) / 5) * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
            </div>
          </Card3D>
        </div>

        {/* AI Status — span 2, row 1 */}
        <div style={{ gridColumn: 'span 2' }}>
          <Card3D intensity={5} style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div className="label-caps">AI Insight</div>
              <span className={`badge badge-${highRiskCount > 1 ? 'red' : 'green'}`}>
                {highRiskCount > 1 ? `${highRiskCount} High Risk` : 'On Schedule'}
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>
              Clinic efficiency is <strong>{efficiency}%</strong> today.
              {isLive ? ' Wait time is calculated from live queue data + ML predicted consultation durations.' : ' Showing estimated data — connect to queue server for live predictions.'}
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {stats.waiting > 0 && <span className="badge badge-muted">{stats.waiting} waiting</span>}
              {stats.inProgress > 0 && <span className="badge badge-green">{stats.inProgress} in session</span>}
              {highRiskCount > 0 && <span className="badge badge-red">{highRiskCount} high-risk</span>}
              {highRiskCount === 0 && <span className="badge badge-green">Low no-show risk</span>}
            </div>
          </Card3D>
        </div>

        {/* Appointment card — span 3, row 2 */}
        <div style={{ gridColumn: 'span 3' }}>
          <Card3D intensity={4} style={{ height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div className="label-caps">Upcoming Appointment</div>
                <div style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>Dr. Sarah Jenkins</div>
                <div style={{ fontSize: 13, color: 'var(--text-sec)', marginTop: 2 }}>Cardiology · Apr 10, 2026 · 10:30 AM</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="badge badge-green">Upcoming</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--red)', fontWeight: 600 }}>
                  <Clock size={12} /> ~{waitTime} min wait
                </span>
              </div>
            </div>
          </Card3D>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
        <StatCard label="Total in Queue" value={String(stats.total || 13)} unit="" icon={Calendar} delay={0} />
        <StatCard label="Avg Wait Time" value={String(waitTime || 18)} unit="min" icon={Clock} color="var(--red)" delay={0.05} />
        <StatCard label="Completed Today" value={String(stats.done || 11)} unit="" icon={CheckCircle2} delay={0.1} />
        <StatCard label="Health Score" value="84" unit="/100" icon={Heart} color="#f0a500" delay={0.15} />
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.25rem', marginTop: '1.25rem' }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className="card">
          <p className="section-title">Appointment Outcomes</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {pieData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-sec)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i] }} />
                {d.name} — <b style={{ color: PIE_COLORS[i] }}>{d.value}%</b>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className="card">
          <p className="section-title">Visit History</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="m" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} width={24} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="v" name="visits" radius={[5, 5, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={i === barData.length - 1 ? '#3fb950' : '#3fb95040'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ── Recent Appointments ── */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show" className="card" style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <p className="section-title" style={{ margin: 0 }}>Recent Appointments</p>
          <button className="btn btn-outline" style={{ fontSize: 12, padding: '5px 12px' }}>View all <ChevronRight size={13} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recentAppts.map((a, i) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: i < recentAppts.length - 1 ? '1px solid var(--border)' : 'none', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-dim), var(--red-dim))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'var(--green)', border: '1px solid var(--border)' }}>
                  {a.dr.split(' ')[1][0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{a.dr}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-sec)' }}>{a.spec}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-sec)' }}>{a.date}</div>
                <span className={`badge badge-${a.status === 'Upcoming' ? 'green' : a.status === 'Completed' ? 'green' : 'red'}`}>{a.status}</span>
                {a.status === 'Upcoming' && <span style={{ fontSize: 12, color: 'var(--red)' }}>~{a.wait} min</span>}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Quote ── */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" style={{ marginTop: '1.25rem', padding: '2rem', background: 'linear-gradient(135deg, var(--green-dim), var(--red-dim))', borderRadius: 'var(--radius)', border: '1px solid rgba(63,185,80,0.16)', textAlign: 'center' }}>
        <Activity size={22} style={{ color: 'var(--green)', opacity: 0.7, marginBottom: 12 }} />
        <p style={{ fontSize: 15, fontStyle: 'italic', lineHeight: 1.8, color: 'var(--text)', maxWidth: 560, margin: '0 auto', fontWeight: 500 }}>
          "Every minute you invest in your health today buys you years of a life well-lived."
        </p>
        <p className="label-caps" style={{ marginTop: 12, color: 'var(--green)', opacity: 0.6 }}>— Powered by TimeCure AI</p>
      </motion.div>
    </motion.div>
  );
}


