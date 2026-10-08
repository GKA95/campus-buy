import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UniversityId } from '../types';
import { INITIAL_STUDENT_USER, INITIAL_VENDOR_USER } from '../data/mockData';
import { initAuth, googleSignIn, googleSignOut } from '../services/firebaseAuth';

interface AuthContextType {
  user: UserProfile | null;
  currentUniversityId: UniversityId | 'all';
  setCurrentUniversityId: (id: UniversityId | 'all') => void;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, role?: 'student' | 'vendor') => void;
  register: (name: string, email: string, role: 'student' | 'vendor', universityId: UniversityId, hall: string) => void;
  signInWithGoogleAccount: (role?: 'student' | 'vendor', universityId?: UniversityId, hall?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  toggleRole: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggleSaveVendor: (vendorId: string) => void;
  isVendorSaved: (vendorId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'campusbuy_current_user';
const CAMPUS_STORAGE_KEY = 'campusbuy_active_campus';
const REGISTERED_USERS_KEY = 'campusbuy_registered_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(false);
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

  // Listen to Firebase auth state in background
  useEffect(() => {
    const unsubscribe = initAuth(
      (fbUser) => {
        // If logged into Firebase, sync avatar and profile if user signed in with Google
        setUser((currentUser) => {
          if (!currentUser || currentUser.authProvider !== 'google') {
            return currentUser;
          }
          if (currentUser.id === fbUser.uid) {
            return {
              ...currentUser,
              name: fbUser.displayName || currentUser.name,
              avatarUrl: fbUser.photoURL || currentUser.avatarUrl
            };
          }
          return currentUser;
        });
      },
      () => {
        // User logged out in Firebase
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

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
        email: email || INITIAL_VENDOR_USER.email,
        authProvider: 'password'
      });
    } else {
      setUser({
        ...INITIAL_STUDENT_USER,
        email: email || INITIAL_STUDENT_USER.email,
        authProvider: 'password'
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
      avatarInitial: name.charAt(0).toUpperCase(),
      authProvider: 'password'
    };
    setUser(newUser);
  };

  const signInWithGoogleAccount = async (
    preferredRole: 'student' | 'vendor' = 'student',
    preferredUniversityId?: UniversityId,
    preferredHall?: string
  ): Promise<UserProfile> => {
    setAuthLoading(true);
    try {
      const { user: fbUser } = await googleSignIn();

      // Detect university from email if possible
      let detectedUni: UniversityId =
        preferredUniversityId || (currentUniversityId !== 'all' ? currentUniversityId : 'knust');
      const emailLower = (fbUser.email || '').toLowerCase();
      if (emailLower.includes('ug.edu.gh') || emailLower.includes('legon')) detectedUni = 'ug';
      else if (emailLower.includes('knust.edu.gh')) detectedUni = 'knust';
      else if (emailLower.includes('ucc.edu.gh')) detectedUni = 'ucc';
      else if (emailLower.includes('upsa.edu.gh')) detectedUni = 'upsa';
      else if (emailLower.includes('uds.edu.gh')) detectedUni = 'uds';
      else if (emailLower.includes('uew.edu.gh')) detectedUni = 'uew';
      else if (emailLower.includes('ashesi.edu.gh')) detectedUni = 'ashesi';

      const existingProfilesJson = localStorage.getItem(REGISTERED_USERS_KEY);
      const existingProfiles: Record<string, UserProfile> = existingProfilesJson
        ? JSON.parse(existingProfilesJson)
        : {};

      let profile = existingProfiles[fbUser.uid];
      if (!profile) {
        profile = {
          id: fbUser.uid,
          name: fbUser.displayName || emailLower.split('@')[0] || 'Campus Scholar',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '+233 55 000 0000',
          role: preferredRole,
          universityId: detectedUni,
          hallOrHostel:
            preferredHall ||
            (detectedUni === 'ug'
              ? 'Commonwealth Hall'
              : detectedUni === 'ucc'
              ? 'Casely Hayford'
              : 'Unity Hall (Conti)'),
          savedVendors: [],
          wishlistProductIds: [],
          avatarInitial: (fbUser.displayName || 'G').charAt(0).toUpperCase(),
          avatarUrl: fbUser.photoURL || undefined,
          authProvider: 'google'
        };
        existingProfiles[fbUser.uid] = profile;
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existingProfiles));
      } else {
        if (fbUser.photoURL) profile.avatarUrl = fbUser.photoURL;
        if (fbUser.displayName) profile.name = fbUser.displayName;
        profile.authProvider = 'google';
        if (preferredRole) profile.role = preferredRole;
        existingProfiles[fbUser.uid] = profile;
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existingProfiles));
      }

      setUser(profile);
      if (profile.universityId) {
        setCurrentUniversityId(profile.universityId);
      }
      return profile;
    } catch (error) {
      console.error('Google Sign-in failed:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await googleSignOut();
    } catch (e) {
      console.warn('Google sign out error:', e);
    }
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
      ? user.wishlistProductIds.filter((id) => id !== productId)
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
      ? user.savedVendors.filter((id) => id !== vendorId)
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
        authLoading,
        login,
        register,
        signInWithGoogleAccount,
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
