import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Theme {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  shadow: string;
  surfaceSecondary: string;
}

const lightTheme: Theme = {
  primary: '#4A90E2',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#212529',
  textSecondary: '#6C757D',
  textMuted: '#ADB5BD',
  border: '#DEE2E6',
  error: '#DC3545',
  success: '#28A745',
  warning: '#FFC107',
  shadow: '#00000020',
  surfaceSecondary: '#E9ECEF',
};

const darkTheme: Theme = {
  primary: '#4A90E2',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#868E96',
  border: '#333333',
  error: '#FF6B6B',
  success: '#51CF66',
  warning: '#FFD43B',
  shadow: '#FFFFFF10',
  surfaceSecondary: '#2C2C2C',
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => Promise<void>;
  setThemeColor: (color: string) => Promise<void>;
  fontSize: number;
  setFontSize: (size: number) => Promise<void>;
  fontFamily: string;
  setFontFamily: (family: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [fontSize, setFontSizeState] = useState(16);
  const [fontFamily, setFontFamilyState] = useState('System');
  const [primaryColor, setPrimaryColor] = useState('#4A90E2');

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    await AsyncStorage.setItem('isDark', JSON.stringify(newIsDark));
  };

  const setThemeColor = async (color: string) => {
    setPrimaryColor(color);
    await AsyncStorage.setItem('primaryColor', color);
  };

  const setFontSize = async (size: number) => {
    setFontSizeState(size);
    await AsyncStorage.setItem('fontSize', size.toString());
  };

  const setFontFamily = async (family: string) => {
    setFontFamilyState(family);
    await AsyncStorage.setItem('fontFamily', family);
  };

  const theme = {
    ...(isDark ? darkTheme : lightTheme),
    primary: primaryColor
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDark, 
      toggleTheme, 
      setThemeColor,
      fontSize, 
      setFontSize,
      fontFamily,
      setFontFamily
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;