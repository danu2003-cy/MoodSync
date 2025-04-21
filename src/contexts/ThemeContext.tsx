import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserPreferences } from '../types';

type ThemeContextType = {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  toggleTheme: () => void;
};

const initialPreferences: UserPreferences = {
  theme: 'light',
  showAvatar: true,
  enableNotifications: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    
    if (savedPreferences) {
      return JSON.parse(savedPreferences);
    }
    
    // Check for system dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return { ...initialPreferences, theme: 'dark' };
    }
    
    return initialPreferences;
  });
  
  useEffect(() => {
    // Update document with theme class
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);
  
  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPrefs };
      localStorage.setItem('userPreferences', JSON.stringify(updated));
      return updated;
    });
  };
  
  const toggleTheme = () => {
    updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' });
  };
  
  return (
    <ThemeContext.Provider value={{ preferences, updatePreferences, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};