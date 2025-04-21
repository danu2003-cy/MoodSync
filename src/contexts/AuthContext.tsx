import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { generateId } from '../utils/helpers';

type AuthContextType = {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : { user: null, isAuthenticated: false };
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(authState));
  }, [authState]);

  const login = async (email: string, password: string) => {
    // In a real app, validate against stored credentials
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }

    // In a real app, validate password hash
    const storedPassword = localStorage.getItem(`password_${email}`);
    if (storedPassword !== password) {
      throw new Error('Invalid password');
    }

    setAuthState({ user, isAuthenticated: true });
  };

  const register = async (email: string, password: string, name: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((u: User) => u.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: generateId(),
      email,
      name,
      createdAt: new Date().toISOString()
    };

    // Store user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Store password (in a real app, store hashed password)
    localStorage.setItem(`password_${email}`, password);

    // Auto login after registration
    setAuthState({ user: newUser, isAuthenticated: true });
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: User) => 
      u.id === authState.user?.id ? { ...u, ...updates } : u
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setAuthState(prev => ({
      ...prev,
      user: { ...prev.user!, ...updates }
    }));
  };

  return (
    <AuthContext.Provider value={{ 
      authState,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};