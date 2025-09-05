import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TouchID from 'react-native-touch-id';
import { Alert } from 'react-native';

export interface User {
  id: string;
  email: string;
  name: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<Date | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const appLockEnabled = await AsyncStorage.getItem('app_lock_enabled');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Auto-login for demo
        const defaultUser = { id: 'user_1', email: 'roshan8800jp@gmail.com', name: 'Roshan' };
        setUser(defaultUser);
        await AsyncStorage.setItem('user', JSON.stringify(defaultUser));
      }
      
      if (appLockEnabled === 'true') {
        setIsLocked(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithPIN = async (pin: string) => {
    try {
      // Check cooldown
      if (cooldownUntil && new Date() < cooldownUntil) {
        const remainingMinutes = Math.ceil((cooldownUntil.getTime() - Date.now()) / 60000);
        Alert.alert('Locked', `Too many attempts. Try again in ${remainingMinutes} minutes.`);
        return false;
      }
      
      const savedPIN = await AsyncStorage.getItem('app_pin');
      if (savedPIN === pin) {
        setIsLocked(false);
        setPinAttempts(0);
        setCooldownUntil(null);
        return true;
      }
      
      // Wrong PIN - increment attempts
      const newAttempts = pinAttempts + 1;
      setPinAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        // 5 wrong attempts - start cooldown
        const cooldown = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        setCooldownUntil(cooldown);
        setPinAttempts(0);
        Alert.alert('Locked', 'Too many failed attempts. Please wait 15 minutes.');
      }
      
      return false;
    } catch (error) {
      console.error('PIN authentication failed:', error);
      return false;
    }
  };

  const authenticateWithBiometric = async () => {
    try {
      const isSupported = await TouchID.isSupported();
      if (!isSupported) {
        Alert.alert('Biometric Not Available', 'Please use PIN to unlock.');
        return false;
      }
      
      await TouchID.authenticate('Unlock TaskFlow', {
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
      });
      
      setIsLocked(false);
      setPinAttempts(0);
      return true;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      Alert.alert('Biometric Failed', 'Please use PIN to unlock.');
      return false;
    }
  };

  const setPIN = async (pin: string) => {
    try {
      await AsyncStorage.setItem('app_pin', pin);
      await AsyncStorage.setItem('app_lock_enabled', 'true');
      return true;
    } catch (error) {
      console.error('Failed to set PIN:', error);
      return false;
    }
  };

  const disableAppLock = async () => {
    try {
      await AsyncStorage.removeItem('app_pin');
      await AsyncStorage.setItem('app_lock_enabled', 'false');
      setIsLocked(false);
      return true;
    } catch (error) {
      console.error('Failed to disable app lock:', error);
      return false;
    }
  };

  return {
    user,
    isLocked,
    loading,
    pinAttempts,
    cooldownUntil,
    authenticateWithPIN,
    authenticateWithBiometric,
    setPIN,
    disableAppLock,
  };
};