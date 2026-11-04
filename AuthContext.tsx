import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, PredictionResult } from '../types';

export const DEMO_USERS: Record<UserRole, User> = {
  farmer: {
    id: 'usr_farmer_01',
    name: 'Deepika',
    email: 'deepika.farmer@agriprice.in',
    phone: '+91 98480 23456',
    role: 'farmer',
    state: 'Telangana',
    district: 'Warangal',
    preferredMandi: 'mandi_warangal',
    avatarUrl: '/src/assets/images/avatar_female_farmer_1793765790919.jpg',
    favoriteCrops: ['crop_paddy', 'crop_cotton', 'crop_chilli', 'crop_tomato'],
    createdAt: '2025-08-15'
  },
  admin: {
    id: 'usr_admin_01',
    name: 'Dr. Ananya Sharma',
    email: 'ananya.admin@agriprice.in',
    phone: '+91 94401 88990',
    role: 'admin',
    state: 'Telangana',
    district: 'Hyderabad',
    avatarUrl: '/src/assets/images/avatar_admin_officer_1793764459436.jpg',
    favoriteCrops: ['crop_rice', 'crop_wheat', 'crop_onion'],
    createdAt: '2025-01-10'
  },
  data_manager: {
    id: 'usr_dm_01',
    name: 'Rajesh Patel',
    email: 'rajesh.data@agriprice.in',
    phone: '+91 97012 33445',
    role: 'data_manager',
    state: 'Maharashtra',
    district: 'Nashik',
    avatarUrl: '/src/assets/images/avatar_admin_officer_1793764459436.jpg',
    favoriteCrops: ['crop_onion', 'crop_tomato', 'crop_potato'],
    createdAt: '2025-03-20'
  }
};

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (name: string, email: string, phone: string, state: string, district: string) => Promise<boolean>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  toggleFavoriteCrop: (cropId: string) => void;
  savedPredictions: PredictionResult[];
  savePredictionToHistory: (pred: PredictionResult) => void;
  deletePredictionFromHistory: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('agriprice_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'usr_farmer_01' || parsed.name === 'Deepika' || parsed.name === 'Ramesh Kumar') {
          return DEMO_USERS.farmer;
        }
        return parsed;
      } catch (e) { /* ignore */ }
    }
    return DEMO_USERS.farmer; // Default to farmer for instant preview
  });

  const [savedPredictions, setSavedPredictions] = useState<PredictionResult[]>(() => {
    const saved = localStorage.getItem('agriprice_predictions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('agriprice_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agriprice_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('agriprice_predictions', JSON.stringify(savedPredictions));
  }, [savedPredictions]);

  const login = async (email: string, role: UserRole = 'farmer') => {
    // Check if matching demo user
    const matched = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setUser(matched);
      return true;
    }
    // Create new login session
    setUser({
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      phone: '+91 98000 00000',
      role,
      state: 'Telangana',
      district: 'Warangal',
      favoriteCrops: ['crop_paddy'],
      createdAt: new Date().toISOString()
    });
    return true;
  };

  const register = async (name: string, email: string, phone: string, state: string, district: string) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone,
      role: 'farmer',
      state,
      district,
      favoriteCrops: ['crop_paddy', 'crop_cotton'],
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchDemoRole = (targetRole: UserRole) => {
    setUser(DEMO_USERS[targetRole]);
  };

  const toggleFavoriteCrop = (cropId: string) => {
    if (!user) return;
    const currentFavs = user.favoriteCrops || [];
    const updated = currentFavs.includes(cropId)
      ? currentFavs.filter(id => id !== cropId)
      : [...currentFavs, cropId];

    setUser({
      ...user,
      favoriteCrops: updated
    });
  };

  const savePredictionToHistory = (pred: PredictionResult) => {
    setSavedPredictions(prev => [pred, ...prev.filter(p => p.id !== pred.id)]);
  };

  const deletePredictionFromHistory = (id: string) => {
    setSavedPredictions(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'farmer',
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchDemoRole,
        toggleFavoriteCrop,
        savedPredictions,
        savePredictionToHistory,
        deletePredictionFromHistory
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
