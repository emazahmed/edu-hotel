import React, { createContext, useContext, useState, ReactNode } from 'react';
import { router } from 'expo-router';
import { User } from '@/types';
import { mockUser, mockAdmin } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: { name: string; email: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([mockUser]);

  const isAdmin = user?.isAdmin || false;

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call your API
    if (email === 'admin@hotel.com') {
      setUser(mockAdmin);
      return true;
    } else {
      // Check registered users
      const foundUser = registeredUsers.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        return true;
      }
    }
    return false;
  };

  const signup = async (userData: { name: string; email: string; phone: string; password: string }): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUser = registeredUsers.find(u => u.email === userData.email);
      if (existingUser) {
        return false; // User already exists
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        isAdmin: false,
      };

      // Add to registered users
      setRegisteredUsers(prev => [...prev, newUser]);
      
      // Auto-login the new user
      setUser(newUser);
      
      return true;
    } catch (error) {
      return false;
    }
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
        signup,
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