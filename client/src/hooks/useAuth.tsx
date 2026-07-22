import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'farmer' | 'buyer' | 'delivery_partner' | 'admin';
  avatarUrl?: string;
  status: string;
  details?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  darkMode: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('agrein_token'));
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  // Dark mode side effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Load user details if token exists on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
        } catch (error) {
          console.error('Session expired or load failed', error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('agrein_token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.fullName}!`);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Login failed. Please check credentials.';
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (regData: any) => {
    setLoading(true);
    try {
      const data = await authService.register(regData);
      localStorage.setItem('agrein_token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success(`Account registered successfully!`);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Registration failed.';
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('agrein_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const profile = await authService.getMe();
        setUser(profile);
      } catch (error) {
        console.error('Failed to refresh profile', error);
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        darkMode,
        login,
        register,
        logout,
        refreshUser,
        toggleDarkMode
      }}
    >
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
