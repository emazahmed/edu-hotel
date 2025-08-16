import React, { createContext, useContext, useState, ReactNode } from 'react';
import { router } from 'expo-router';
import { User } from '@/types';
import { mockUser, mockAdmin } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const isAdmin = user?.isAdmin || false;

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call your API
    if (email === 'admin@hotel.com') {
      setUser(mockAdmin);
      return true;
    } else if (email === 'john.doe@example.com') {
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    router.replace('/(auth)/login');
  };

  const switchToAdmin = () => {
    setUser(mockAdmin);
  };

  const switchToUser = () => {
    setUser(mockUser);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAdmin, 
        login, 
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};