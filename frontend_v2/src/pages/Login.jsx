import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, Loader2, Activity, ArrowRight, Eye, EyeOff, ChevronRight, Brain, Wifi, Bell, BarChart3 } from 'lucide-react';
import { authService } from '../services/api';
import { Helmet } from "react-helmet";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Ensure Auth Server (Port 3000) is online.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-white flex overflow-hidden relative">
      <Helmet>
        <title>Home - TimeCure</title>
        <meta name="description" content="Learn coding with CodingGita" />
      </Helmet>

      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[65%] h-[65%] rounded-full blur-[140px] animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full blur-[130px] animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', animationDelay: '3s' }} />
        <div className="grid-bg absolute inset-0 opacity-20" />
      </div>

      {/* ── SPLIT LAYOUT ── */}
      <div className="flex w-full min-h-screen">

        {/* LEFT: Brand Panel (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center gap-10 p-12 relative">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center anim-glow"
                style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(99,102,241,0.15))', border: '1px solid rgba(0,212,255,0.3)' }}>
                <Activity className="w-5 h-5 text-neonGlow" />
              </div>
              <span className="font-black tracking-tight text-white text-xl">Time<span className="text-neonGlow">Cure</span></span>
            </div>

            <div className="max-w-md anim-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
                style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00D4FF' }}>
                AI-Powered Healthcare
              </div>
              <h1 className="text-4xl font-black text-white leading-tight mb-6">
                Intelligent Queue Management
                <span style={{ background: 'linear-gradient(135deg, #00D4FF, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> starts here.</span>
              </h1>
              <p className="text-slate-500 leading-relaxed">
                Login to access your real-time dashboard powered by ML predictions, live queue sync, and smart notifications.
              </p>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="space-y-3 mt-10 anim-fade-up" style={{ animationDelay: '200ms', opacity: 0 }}>
            {[
              { icon: Brain, text: 'ML-based consultation time prediction', color: '#00D4FF' },
              { icon: BarChart3, text: 'Real-time queue optimization', color: '#8B5CF6' },
              { icon: Bell, text: 'Automated no-show SMS reminders', color: '#10B981' },
            ].map(({ icon: Icon, text, color }, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-400 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-md anim-fade-in">

            {/* Mobile Logo */}
            <div className="flex items-center justify-center gap-3 mb-10 lg:hidden">
              <Activity className="w-7 h-7 text-neonGlow" />
              <span className="font-black text-2xl text-white">Time<span className="text-neonGlow">Cure</span></span>
            </div>

            <div className="glass-card p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-white mb-2">Welcome back</h2>
                <p className="text-slate-500 text-sm">Sign in to your TimeCure account to continue.</p>
              </div>

              {/* Role Hint Badges */}
              <div className="flex gap-3 mb-8">
                {['Doctor / Admin', 'Patient'].map((role, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 cursor-default"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? '#00D4FF' : '#8B5CF6' }} />
                    {role}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <div className="relative">
                    {/* <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 pointer-events-none" /> */}
                    <input
                      type="email" required
                      placeholder="doctor@hospital.com"
                      className="glass-input pl-12"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                  <div className="relative">
                    {/* <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 pointer-events-none" /> */}
                    <input
                      type={showPassword ? 'text' : 'password'} required
                      placeholder="••••••••"
                      className="glass-input pl-12 pr-12"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
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
                      Sign In Securely
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer link */}
              <div className="mt-8 pt-6 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <Link to="/register" className="text-xs font-bold text-neonGlow hover:text-white transition-colors flex items-center gap-1">
                  Create account <ChevronRight className="w-3 h-3" />
                </Link>
                <Link to="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                  ← Back to Home
                </Link>
              </div>
            </div>

            {/* Security note */}
            <p className="text-center text-[10px] text-slate-700 mt-5 uppercase tracking-widest font-semibold">
              JWT Secured · End-to-End Encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
