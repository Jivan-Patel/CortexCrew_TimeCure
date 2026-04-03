import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Activity, Calendar, Clock, HeartPulse } from 'lucide-react';
import Logo from '../components/Logo';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-darker flex relative overflow-hidden text-slate-200">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-blob z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-blue/20 blur-[120px] animate-blob animation-delay-2000 z-0 pointer-events-none"></div>
      
      {/* Left Column (Info / Illustration) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <Logo className="w-14 h-14 mb-8" />
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Smart <span className="text-gradient">Appointment</span> <br/> Scheduling System
          </h1>
          <p className="text-lg text-slate-400 mb-12">
            Optimizing hospital workflows, reducing patient wait times, and predicting consultations with advanced AI models. Experience seamless healthcare management.
          </p>

          {/* Floating Cards Illustration */}
          <div className="relative h-64 w-full">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-0 left-0 glass-panel p-4 flex items-center gap-4 w-64"
            >
              <div className="bg-primary/20 p-3 rounded-full text-primary">
                <Calendar />
              </div>
              <div>
                <p className="text-sm font-semibold">Appointment Booked</p>
                <p className="text-xs text-slate-400">Dr. Sarah Connor</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-20 left-24 glass-panel p-4 flex items-center gap-4 w-72 z-10 shadow-2xl border-primary/30"
            >
              <div className="bg-neon-blue/20 p-3 rounded-full text-neon-blue">
                <Activity />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Prediction Active</p>
                <p className="text-xs text-slate-400">Estimated wait time: 14 mins</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
              className="absolute top-40 left-8 glass-panel p-4 flex items-center gap-4 w-60"
            >
              <div className="bg-neon-red/20 p-3 rounded-full text-neon-red">
                <HeartPulse />
              </div>
              <div>
                <p className="text-sm font-semibold">Real-time vitals</p>
                <p className="text-xs text-slate-400">Monitoring patient status</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Right Column (Login Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md glass-panel p-10 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary to-neon-blue rounded-b-lg"></div>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Please sign in to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input pl-12" 
                  placeholder="admin@timecure.io"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <a href="#" className="text-xs text-primary hover:text-white transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pl-12" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full mt-8 flex justify-center items-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Login to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account? <a href="#" className="text-primary hover:underline">Contact Administrator</a>
          </p>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;
