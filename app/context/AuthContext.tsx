'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore session token and user from localStorage safely
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedToken !== 'undefined') {
      setToken(savedToken);
    }

    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Corrupted user data in localStorage, clearing key...', err);
        localStorage.removeItem('user');
      }
    } else {
      localStorage.removeItem('user');
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:7766/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer guest',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error?.message || 'Login failed');

      const accessToken = data.data.accessToken;
      const userData = data.data.user;

      setUser(userData || null);
      setToken(accessToken || null);

      if (accessToken) {
        localStorage.setItem('token', accessToken);
      }
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:7766/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer guest',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error?.message || 'Registration failed');

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch('http://localhost:7766/api/v1/auth/password/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer guest',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error?.message || 'Request failed');

      return { success: true, message: data.message || 'Reset instructions sent!' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const resetPassword = async (tokenParam: string, newPassword: string) => {
    try {
      const res = await fetch('http://localhost:7766/api/v1/auth/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer guest',
        },
        body: JSON.stringify({ token: tokenParam, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error?.message || 'Reset failed');

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const activeToken = token || localStorage.getItem('token');

      if (!activeToken) {
        throw new Error('You are not logged in or your session has expired.');
      }

      const res = await fetch('http://localhost:7766/api/v1/auth/password/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error?.message || 'Password update failed');

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        forgotPassword,
        resetPassword,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};