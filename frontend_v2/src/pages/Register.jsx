import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, User, Loader2, Stethoscope, UserRound, ArrowRight, Eye, EyeOff, Activity, CheckCircle2, Brain, Zap, Bell, ShieldCheck } from 'lucide-react';
import { authService } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    authService.checkAdmin()
      .then(exists => {
        setAdminExists(exists);
        if (!exists) setFormData(p => ({ ...p, role: 'doctor' }));
      })
      .catch(() => setAdminExists(true));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register(formData.username, formData.email, formData.password, formData.role);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Ensure Auth Server (Port 3000) is online.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'doctor',
      label: 'Doctor / Admin',
      icon: Stethoscope,
      desc: 'Full queue control, AI analytics, patient management',
      color: '#00D4FF',
      disabled: adminExists,
    },
    {
      id: 'patient',
      label: 'Patient',
      icon: UserRound,
      desc: 'Book appointments, track queue position, view wait times',
      color: '#8B5CF6',
      disabled: false,
    },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-darkBg flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md anim-fade-in">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Account Created!</h2>
          <p className="text-slate-500">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkBg text-white flex overflow-hidden relative">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-15%] w-[65%] h-[65%] rounded-full blur-[140px] animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full blur-[130px] animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', animationDelay: '3s' }} />
        <div className="grid-bg absolute inset-0 opacity-20" />
      </div>

      <div className="flex w-full min-h-screen">
        {/* LEFT: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-md anim-fade-in">

            {/* Logo for mobile */}
            <div className="flex items-center justify-center gap-3 mb-10 lg:hidden">
              <Activity className="w-7 h-7 text-neonGlow" />
              <span className="font-black text-2xl text-white">Time<span className="text-neonGlow">Cure</span></span>
            </div>

            <div className="glass-card p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-white mb-2">Create your account</h2>
                <p className="text-slate-500 text-sm">Join the smart healthcare revolution.</p>
              </div>

              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {roles.map(role => {
                  const isSelected = formData.role === role.id;
                  const isDisabled = role.disabled;
                  return (
                    <button key={role.id} type="button"
                      disabled={isDisabled}
                      onClick={() => !isDisabled && setFormData(p => ({ ...p, role: role.id }))}
                      className={`p-4 rounded-2xl border text-left transition-all duration-300 ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}`}
                      style={{
                        background: isSelected ? `${role.color}12` : 'rgba(255,255,255,0.02)',
                        borderColor: isSelected ? `${role.color}50` : 'rgba(255,255,255,0.07)',
                        boxShadow: isSelected ? `0 0 20px ${role.color}15` : 'none',
                      }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: isSelected ? `${role.color}20` : 'rgba(255,255,255,0.05)', border: `1px solid ${isSelected ? role.color + '40' : 'rgba(255,255,255,0.08)'}` }}>
                        <role.icon className="w-4 h-4" style={{ color: isSelected ? role.color : '#64748b' }} />
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: isSelected ? role.color : '#64748b' }}>
                        {role.label}
                      </p>
                      <p className="text-[10px] text-slate-600 leading-tight">{role.desc}</p>
                      {isDisabled && <p className="text-[9px] text-slate-700 mt-1 uppercase tracking-widest">Admin exists</p>}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                  <div className="relative">
                    {/* <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 pointer-events-none" /> */}
                    <input type="text" required placeholder="Dr. Name" className="glass-input pl-12"
                      value={formData.username} onChange={e => setFormData(p => ({ ...p, username: e.target.value }))} />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <div className="relative">
                    {/* <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 pointer-events-none" /> */}
                    <input type="email" required placeholder="identifier@hospital.com" className="glass-input pl-12"
                      value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                  <div className="relative">
                    {/* <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 pointer-events-none" /> */}
                    <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                      className="glass-input pl-12 pr-12"
                      value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl px-4 py-3 text-sm text-red-400 anim-fade-in"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading} className="btn-primary w-full mt-2 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Create Account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">
                  ← Already have an account
                </Link>
                <Link to="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Benefits Panel */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center gap-10 p-12 relative">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center anim-glow"
                style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(99,102,241,0.15))', border: '1px solid rgba(0,212,255,0.3)' }}>
                <Activity className="w-5 h-5 text-neonGlow" />
              </div>
              <span className="font-black tracking-tight text-white text-xl">Time<span className="text-neonGlow">Cure</span></span>
            </div>

            <h2 className="text-3xl font-black text-white mb-4 leading-tight">
              Smarter Healthcare
              <br />
              <span style={{ background: 'linear-gradient(135deg, #00D4FF, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Starts with You
              </span>
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Join TimeCure as a doctor to manage intelligent queues, or as a patient to experience seamless AI-driven scheduling.
            </p>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                { icon: Brain, color: '#00D4FF', title: 'ML-Powered Predictions', desc: 'Wait times are predicted using real machine learning, not guesswork.' },
                { icon: Zap, color: '#8B5CF6', title: 'Real-Time Queue Sync', desc: 'Every action updates the queue live across all connected devices.' },
                { icon: Bell, color: '#10B981', title: 'Smart SMS Reminders', desc: 'High-risk patients get automatic reminders. Zero manual work.' },
                { icon: ShieldCheck, color: '#F59E0B', title: 'Role-Based Security', desc: 'JWT-protected endpoints ensure data stays where it belongs.' },
              ].map(({ icon: Icon, color, title, desc }, i) => (
                <div key={i} className="flex items-start gap-4 glass-card p-4"
                  style={{ animationDelay: `${i * 80}ms`, opacity: 0, animation: `fadeUp 0.5s ease-out ${i * 80}ms forwards` }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
