import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  mode: 'light' | 'dark';
  isDark: boolean;
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
}

const lightTheme: Theme = {
  mode: 'light',
  isDark: false,
  primary: '#4A90E2',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  error: '#FF6B6B',
  success: '#50C878',
  warning: '#FFD93D',
  colors: {
    primary: '#4A90E2',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#333333',
    textSecondary: '#666666',
    border: '#E0E0E0',
    error: '#FF6B6B',
    success: '#50C878',
    warning: '#FFD93D',
  },
};

const darkTheme: Theme = {
  mode: 'dark',
  isDark: true,
  primary: '#5AA3F0',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  border: '#333333',
  error: '#FF6B6B',
  success: '#50C878',
  warning: '#FFD93D',
  colors: {
    primary: '#5AA3F0',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    border: '#333333',
    error: '#FF6B6B',
    success: '#50C878',
    warning: '#FFD93D',
  },
};

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  setThemeColor: (color: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (family: string) => void;
}>({
  theme: lightTheme,
  toggleTheme: () => {},
  setThemeColor: () => {},
  fontSize: 16,
  setFontSize: () => {},
  fontFamily: 'System',
  setFontFamily: () => {},
});

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('System');

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('theme_mode');
      const savedColor = await AsyncStorage.getItem('theme_color');
      const savedFontSize = await AsyncStorage.getItem('font_size');
      const savedFontFamily = await AsyncStorage.getItem('font_family');

      if (savedMode === 'dark') {
        setTheme(darkTheme);
      }
      if (savedColor) {
        setThemeColor(savedColor);
      }
      if (savedFontSize) {
        setFontSize(parseInt(savedFontSize));
      }
      if (savedFontFamily) {
        setFontFamily(savedFontFamily);
      }
    } catch (error) {
      console.error('Failed to load theme settings:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme.mode === 'light' ? darkTheme : lightTheme;
    setTheme(newTheme);
    await AsyncStorage.setItem('theme_mode', newTheme.mode);
  };

  const setThemeColor = async (color: string) => {
    const newTheme = { ...theme, primary: color };
    setTheme(newTheme);
    await AsyncStorage.setItem('theme_color', color);
  };

  const updateFontSize = async (size: number) => {
    setFontSize(size);
    await AsyncStorage.setItem('font_size', size.toString());
  };

  const updateFontFamily = async (family: string) => {
    setFontFamily(family);
    await AsyncStorage.setItem('font_family', family);
  };

  return {
    theme,
    toggleTheme,
    setThemeColor,
    fontSize,
    setFontSize: updateFontSize,
    fontFamily,
    setFontFamily: updateFontFamily,
  };
};

export const ThemeProvider = ThemeContext.Provider;
export { ThemeContext };