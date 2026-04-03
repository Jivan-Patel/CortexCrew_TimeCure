import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Activity, Calendar } from 'lucide-react';
import Logo from '../components/Logo';

const Signin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-light dark:bg-darker flex relative overflow-hidden transition-colors duration-300">
      
      {/* Background Animated Blobs - fixed opacity and z-index to avoid overlaying the inputs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] animate-blob z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/10 blur-[120px] animate-blob z-0 pointer-events-none" style={{animationDelay: "2s"}}></div>
      
      {/* Left Column (Info / Illustration) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 relative z-10 border-r border-glass-border dark:border-glass-border-dark">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <Logo className="w-14 h-14 mb-8" />
          <h1 className="text-5xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
            Smart <span className="text-primary">Appointment</span> <br/> Scheduling System
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
            Optimizing hospital workflows, reducing patient wait times, and predicting consultations with advanced AI models. Experience seamless healthcare management.
          </p>

          {/* Floating Cards Illustration (Fixed overlay with relative positioning instead of absolute overlaps) */}
          <div className="flex flex-col gap-4 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-4 flex items-center gap-4 w-[70%]"
            >
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Appointment Booked</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Dr. Sarah Connor</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="glass-panel p-4 flex items-center gap-4 w-[80%] self-end border-primary/30"
            >
              <div className="bg-secondary/10 p-3 rounded-full text-secondary">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">AI Prediction Active</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Estimated wait time: 14 mins</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Right Column (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 z-10">
        
        {/* Mobile Header (Shows only on small screens) */}
        <div className="lg:hidden flex flex-col items-center mb-8">
          <Logo className="w-12 h-12 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Smart Scheduling</h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md glass-panel p-8 sm:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Please sign in to access the dashboard</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input pl-11 shadow-sm" 
                  placeholder="admin@timecure.io"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-xs text-primary hover:text-secondary transition-colors font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pl-11 shadow-sm" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full mt-6 flex justify-center items-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-8">
            Don't have an account? <Link to="/register" className="text-primary hover:underline font-semibold">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signin;
