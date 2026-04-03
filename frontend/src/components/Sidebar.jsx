import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Users, BarChart3, Stethoscope, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'queue', label: 'Wait Queue', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={false}
      animate={{ width: isExpanded ? 260 : 80 }}
      className="h-screen glass-panel rounded-none border-t-0 border-b-0 border-l-0 flex flex-col relative z-20 shrink-0"
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-8 bg-darker border border-glass-border p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors z-30"
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Logo Area */}
      <div className={`p-6 flex items-center ${isExpanded ? 'gap-3' : 'justify-center'} border-b border-glass-border`}>
        <Logo className={isExpanded ? "w-8 h-8" : "w-10 h-10"} />
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="whitespace-nowrap overflow-hidden"
            >
              <h2 className="font-bold text-lg leading-tight text-white">TimeCure</h2>
              <p className="text-[10px] text-primary uppercase tracking-wider">HealthTech OS</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              } ${!isExpanded ? 'justify-center' : ''}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <Icon className={`relative z-10 w-5 h-5 ${isActive ? 'text-primary' : 'group-hover:text-slate-300'}`} />
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="relative z-10 font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-glass-border">
        <button 
          onClick={() => navigate('/login')}
          className={`flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-neon-red hover:bg-neon-red/10 transition-all w-full ${!isExpanded ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-medium whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

    </motion.div>
  );
};

export default Sidebar;
