import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Moon, Sun, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import Avatar from '../ui/Avatar';
import NotificationPanel from '../features/NotificationPanel';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { preferences, toggleTheme } = useTheme();
  const { notifications } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Get current mood based on most recent entry
  const { moodEntries } = useData();
  const latestMood = moodEntries.length > 0 ? moodEntries[0].mood : undefined;
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };
  
  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <Calendar className="h-5 w-5" /> },
    { to: '/mood', label: 'Mood Tracker', icon: <span className="text-lg">😊</span> },
    { to: '/events', label: 'Events', icon: <Calendar className="h-5 w-5" /> },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 py-3 backdrop-blur-sm transition-colors duration-200 dark:bg-neutral-900/80">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400"
        >
          <Avatar mood={latestMood} size="sm" className="transition-all duration-300" />
          <span>MoodSync</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden space-x-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 font-medium transition-all duration-200 ${
                isActive(link.to)
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            onClick={toggleNotification}
            className="relative rounded-full p-2 text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-error-500 text-xs font-medium text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label={preferences.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {preferences.theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="rounded-full p-2 text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="container mx-auto overflow-hidden px-4 md:hidden"
          >
            <div className="flex flex-col space-y-1 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300'
                      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Notification Panel */}
      <AnimatePresence>
        {isNotificationOpen && (
          <NotificationPanel onClose={() => setIsNotificationOpen(false)} />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;