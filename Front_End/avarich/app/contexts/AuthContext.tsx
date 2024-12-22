// app/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signIn as apiSignIn,
  signUp as apiSignUp,
  assignUserType as apiAssignUserType,
  fetchUser as apiFetchUser,
} from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  assignUserType: (userType: string) => Promise<void>;
}

interface User {
  email: string;
  token: string;
  userType?: string;
  personalInformation?: {
    name?: string;
    age?: number;
    occupation?: string;
    financialDependents?: boolean;
    primaryIncomeEarner?: boolean;
  };
  // Include other fields as needed
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  assignUserType: async () => {},
});

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load user from AsyncStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser: User = JSON.parse(userData);
          // Fetch latest user details from backend
          const userDetails = await apiFetchUser(parsedUser.token);
          const updatedUser = { ...parsedUser, ...userDetails };
          setUser(updatedUser);
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('Failed to load user.', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const data = await apiSignIn(email, password);
      const userData: User = {
        email: data.email,
        token: data.token,
        userType: data.userType,
      };
      // Fetch latest user details
      const userDetails = await apiFetchUser(userData.token);
      const updatedUser = { ...userData, ...userDetails };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      console.error('Sign In Error:', error);
      Alert.alert('Sign In Failed', error.response?.data?.message || 'An error occurred during sign in.');
      throw error;
    }
  };

  // Sign Up
  const signUp = async (email: string, password: string) => {
    try {
      const data = await apiSignUp(email, password);
      const userData: User = {
        email: data.email,
        token: data.token,
      };
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Sign Up Error:', error);
      Alert.alert('Sign Up Failed', error.response?.data?.message || 'An error occurred during sign up.');
      throw error;
    }
  };

  // Sign Out
  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
    router.replace('/(auth)/SignInScreen');
  };

  // Assign User Type
  const assignUserType = async (userType: string) => {
    if (!user) return;
    try {
      const data = await apiAssignUserType(user.token, userType);
      const updatedUser: User = { ...user, userType: data.userType };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      console.error('Assign User Type Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to assign user type.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, assignUserType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
