'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'AGENCY_ADMIN' | 'CASHIER' | 'CONTROLLER' | 'DRIVER';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('opep_user');
    const token = localStorage.getItem('opep_token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('opep_token', token);
    localStorage.setItem('opep_user', JSON.stringify(userData));
    setUser(userData);
    router.push('/reproduction/opep-super-admin-dashboard');
  };

  const logout = () => {
    localStorage.removeItem('opep_token');
    localStorage.removeItem('opep_user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    if (typeof window === 'undefined') {
      // During SSR/SSG, return safe fallback values
      return {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: () => {},
        logout: () => {},
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
