import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vibration } from 'react-native';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  screenReader: boolean;
  largeText: boolean;
}

export interface AppSettings {
  hapticFeedback: boolean;
  notifications: boolean;
  appLock: boolean;
  pinCode?: string;
  biometric: boolean;
  encryption: boolean;
}

export const useSettings = () => {
  const [profile, setProfile] = useState<UserProfile>({ name: 'Roshan', email: 'roshan8800jp@gmail.com' });
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    screenReader: false,
    largeText: false,
  });
  const [appSettings, setAppSettings] = useState<AppSettings>({
    hapticFeedback: true,
    notifications: true,
    appLock: false,
    biometric: false,
    encryption: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('user_profile');
      const savedAccessibility = await AsyncStorage.getItem('accessibility_settings');
      const savedAppSettings = await AsyncStorage.getItem('app_settings');

      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedAccessibility) setAccessibility(JSON.parse(savedAccessibility));
      if (savedAppSettings) setAppSettings(JSON.parse(savedAppSettings));
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    const updated = { ...profile, ...newProfile };
    setProfile(updated);
    await AsyncStorage.setItem('user_profile', JSON.stringify(updated));
  };

  const updateAccessibility = async (newSettings: Partial<AccessibilitySettings>) => {
    const updated = { ...accessibility, ...newSettings };
    setAccessibility(updated);
    await AsyncStorage.setItem('accessibility_settings', JSON.stringify(updated));
  };

  const updateAppSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...appSettings, ...newSettings };
    setAppSettings(updated);
    await AsyncStorage.setItem('app_settings', JSON.stringify(updated));
  };

  const triggerHaptic = () => {
    if (appSettings.hapticFeedback) {
      Vibration.vibrate(50);
    }
  };

  return {
    profile,
    accessibility,
    appSettings,
    updateProfile,
    updateAccessibility,
    updateAppSettings,
    triggerHaptic,
  };
};