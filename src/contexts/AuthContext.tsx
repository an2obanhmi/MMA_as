import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { sendResetPasswordEmail } from '../services/authService';
import { UserProfile } from '../types/models.types';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: { name?: string; avatarUrl?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Firestore users document for the auth user
  const fetchUserProfile = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserProfile({
          id: uid,
          name: data.name || 'User',
          email: data.email || '',
          avatarUrl: data.avatarUrl || '',
          createdAt: data.createdAt || null,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    await fetchUserProfile(cred.user.uid);
  };

  const signup = async (name: string, email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const uid = cred.user.uid;

    // Create user document in 'users' collection
    const userDocRef = doc(db, 'users', uid);
    const profileData: UserProfile = {
      id: uid,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatarUrl: `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(name.trim())}`,
      createdAt: serverTimestamp(),
    };

    await setDoc(userDocRef, profileData);
    setUserProfile(profileData);
  };

  const resetPassword = async (email: string) => {
    await sendResetPasswordEmail(email);
  };

  const updateUserProfile = async (updates: { name?: string; avatarUrl?: string }) => {
    if (!user) throw new Error('No authenticated user');

    // 1. Update Firebase Auth Profile
    const authUpdates: { displayName?: string; photoURL?: string } = {};
    if (updates.name !== undefined) authUpdates.displayName = updates.name.trim();
    if (updates.avatarUrl !== undefined) authUpdates.photoURL = updates.avatarUrl;

    if (Object.keys(authUpdates).length > 0) {
      await updateProfile(user, authUpdates);
    }

    // 2. Update Firestore users collection
    const userDocRef = doc(db, 'users', user.uid);
    const firestoreUpdates: Record<string, string> = {};
    if (updates.name !== undefined) firestoreUpdates.name = updates.name.trim();
    if (updates.avatarUrl !== undefined) firestoreUpdates.avatarUrl = updates.avatarUrl;

    if (Object.keys(firestoreUpdates).length > 0) {
      await updateDoc(userDocRef, firestoreUpdates);
    }

    // 3. Update local userProfile state
    setUserProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        name: updates.name !== undefined ? updates.name.trim() : prev.name,
        avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : prev.avatarUrl,
      };
    });
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        login,
        signup,
        resetPassword,
        updateUserProfile,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
