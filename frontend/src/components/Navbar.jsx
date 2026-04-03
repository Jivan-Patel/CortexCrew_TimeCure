import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-20 glass-panel rounded-none border-t-0 border-l-0 border-r-0 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
      
      {/* Search */}
      <div className="w-1/2 md:w-1/3 relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Search patients..."
          className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-primary/50 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-500"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 hidden sm:block">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white dark:border-slate-900"></span>
        </button>

        <div className="hidden sm:block w-px h-8 bg-slate-300 dark:bg-glass-border-dark"></div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-slate-800/50 p-1 md:pr-3 rounded-full transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-800">
              A
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-none">Admin</p>
              <p className="text-xs text-slate-500 mt-1">Super User</p>
            </div>
            <ChevronDown className="hidden md:block w-4 h-4 text-slate-500 ml-1" />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50"
              >
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-all">Profile Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-all">System Settings</a>
                <div className="border-t border-slate-200 dark:border-glass-border-dark my-1"></div>
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
