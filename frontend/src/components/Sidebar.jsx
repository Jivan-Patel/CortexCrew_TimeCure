import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Users, BarChart3, Stethoscope, Settings, ChevronLeft, ChevronRight, LogOut, Menu, X } from 'lucide-react';
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Handle window resize to auto-collapse on smaller desktop screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-darker transition-colors duration-300">
      {/* Search Toggle Button for Desktop */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="hidden lg:flex absolute -right-3 top-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 rounded-full text-slate-500 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors z-30"
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Logo Area */}
      <div className={`p-6 flex items-center ${isExpanded || isMobileOpen ? 'gap-3' : 'justify-center'} border-b border-slate-200 dark:border-glass-border-dark`}>
        <Logo className={isExpanded || isMobileOpen ? "w-8 h-8" : "w-10 h-10"} />
        <AnimatePresence>
          {(isExpanded || isMobileOpen) && (
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="whitespace-nowrap overflow-hidden"
            >
              <h2 className="font-bold text-lg leading-tight text-slate-900 dark:text-white">TimeCure</h2>
              <p className="text-[10px] text-primary uppercase tracking-wider font-semibold">HealthTech OS</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsMobileOpen(false);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                isActive 
                  ? 'text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              } ${(!isExpanded && !isMobileOpen) ? 'justify-center' : ''}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-primary border border-primary/50 shadow-md rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <Icon className={`relative z-10 w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-primary transition-colors'}`} />
              
              <AnimatePresence>
                {(isExpanded || isMobileOpen) && (
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
      <div className="p-4 border-t border-slate-200 dark:border-glass-border-dark">
        <button 
          onClick={() => navigate('/login')}
          className={`flex items-center gap-3 p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all w-full font-medium ${(!isExpanded && !isMobileOpen) ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5" />
          <AnimatePresence>
            {(isExpanded || isMobileOpen) && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger menu trigger */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-md text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Sidebar Sidebar */}
      <motion.div 
        initial={false}
        animate={{ width: isExpanded ? 240 : 80 }}
        className="hidden lg:flex h-screen glass-panel rounded-none border-t-0 border-b-0 border-l-0 flex-col relative z-30 shrink-0"
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 glass-panel rounded-none border-none shadow-2xl z-50"
            >
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
