import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="h-20 glass-panel rounded-none border-t-0 border-l-0 border-r-0 px-8 flex items-center justify-between sticky top-0 z-10">
      
      {/* Search */}
      <div className="w-1/3 relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Search patients, doctors, appointments..."
          className="w-full bg-slate-900/50 border border-slate-700/50 text-slate-200 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-primary/50 focus:bg-slate-900 transition-all placeholder:text-slate-500"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-neon-red rounded-full animate-pulse"></span>
        </button>

        <div className="w-px h-8 bg-glass-border"></div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 hover:bg-slate-800/50 p-1.5 pr-3 rounded-full transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-neon-blue flex items-center justify-center text-white font-bold text-sm shadow-md">
              A
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-200 leading-none">Admin</p>
              <p className="text-xs text-slate-500 mt-1">Super User</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 ml-1" />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-48 glass-panel py-2 border-slate-700 shadow-xl overflow-hidden"
              >
                <a href="#" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white hover:pl-5 transition-all">Profile Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white hover:pl-5 transition-all">System Settings</a>
                <div className="border-t border-glass-border my-1"></div>
                <a href="#" className="block px-4 py-2 text-sm text-neon-red hover:bg-slate-800 hover:pl-5 transition-all">Logout</a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
