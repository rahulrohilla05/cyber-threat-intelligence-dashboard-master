// src/contexts/auth-context.tsx
"use client";
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type AuthContextType = {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate checking auth status from localStorage or a cookie
    try {
      const storedAuth = localStorage.getItem('cyberwatch_auth');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        if (authData.isAuthenticated && authData.user) {
          setIsAuthenticated(true);
          setUser(authData.user);
        }
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      localStorage.removeItem('cyberwatch_auth');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname?.startsWith('/dashboard')) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, pathname, router]);

  const login = (email: string) => {
    const mockUser = { name: email.split('@')[0] || 'User', email: email };
    setIsAuthenticated(true);
    setUser(mockUser);
    try {
      localStorage.setItem('cyberwatch_auth', JSON.stringify({ isAuthenticated: true, user: mockUser }));
    } catch (error) {
      console.error("Failed to save auth data to localStorage", error);
    }
    router.push('/dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      localStorage.removeItem('cyberwatch_auth');
    } catch (error) {
      console.error("Failed to remove auth data from localStorage", error);
    }
    router.push('/login');
  };

  if (loading && pathname?.startsWith('/dashboard')) {
     return (
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      );
  }


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
