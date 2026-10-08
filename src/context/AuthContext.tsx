import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UniversityId } from '../types';
import { INITIAL_STUDENT_USER, INITIAL_VENDOR_USER } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  currentUniversityId: UniversityId | 'all';
  setCurrentUniversityId: (id: UniversityId | 'all') => void;
  isAuthenticated: boolean;
  login: (email: string, role?: 'student' | 'vendor') => void;
  register: (name: string, email: string, role: 'student' | 'vendor', universityId: UniversityId, hall: string) => void;
  logout: () => void;
  toggleRole: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggleSaveVendor: (vendorId: string) => void;
  isVendorSaved: (vendorId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'campusbuy_current_user';
const CAMPUS_STORAGE_KEY = 'campusbuy_active_campus';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_STUDENT_USER;
    } catch {
      return INITIAL_STUDENT_USER;
    }
  });

  const [currentUniversityId, setCurrentUniversityId] = useState<UniversityId | 'all'>(() => {
    try {
      const stored = localStorage.getItem(CAMPUS_STORAGE_KEY);
      return (stored as UniversityId | 'all') || 'all';
    } catch {
      return 'all';
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(CAMPUS_STORAGE_KEY, currentUniversityId);
    } catch (e) {
      console.error(e);
    }
  }, [currentUniversityId]);

  const login = (email: string, role: 'student' | 'vendor' = 'student') => {
    if (role === 'vendor') {
      setUser({
        ...INITIAL_VENDOR_USER,
        email: email || INITIAL_VENDOR_USER.email
      });
    } else {
      setUser({
        ...INITIAL_STUDENT_USER,
        email: email || INITIAL_STUDENT_USER.email
      });
    }
  };

  const register = (
    name: string,
    email: string,
    role: 'student' | 'vendor',
    universityId: UniversityId,
    hall: string
  ) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: '+233 55 000 0000',
      role,
      universityId,
      hallOrHostel: hall,
      savedVendors: [],
      wishlistProductIds: [],
      avatarInitial: name.charAt(0).toUpperCase()
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleRole = () => {
    if (!user || user.role === 'student') {
      setUser(INITIAL_VENDOR_USER);
    } else {
      setUser(INITIAL_STUDENT_USER);
    }
  };

  const toggleWishlist = (productId: string) => {
    if (!user) return;
    const exists = user.wishlistProductIds.includes(productId);
    const updated = exists
      ? user.wishlistProductIds.filter(id => id !== productId)
      : [...user.wishlistProductIds, productId];
    setUser({ ...user, wishlistProductIds: updated });
  };

  const isWishlisted = (productId: string) => {
    return user ? user.wishlistProductIds.includes(productId) : false;
  };

  const toggleSaveVendor = (vendorId: string) => {
    if (!user) return;
    const exists = user.savedVendors.includes(vendorId);
    const updated = exists
      ? user.savedVendors.filter(id => id !== vendorId)
      : [...user.savedVendors, vendorId];
    setUser({ ...user, savedVendors: updated });
  };

  const isVendorSaved = (vendorId: string) => {
    return user ? user.savedVendors.includes(vendorId) : false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUniversityId,
        setCurrentUniversityId,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        toggleRole,
        toggleWishlist,
        isWishlisted,
        toggleSaveVendor,
        isVendorSaved
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
