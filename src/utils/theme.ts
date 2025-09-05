export const lightTheme = {
  colors: {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSecondary: '#F3F4F6',
    
    text: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    
    border: '#E5E7EB',
    borderFocus: '#6366F1',
    
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  
  typography: {
    h1: { fontSize: 32, fontWeight: '800' as const, lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
    body: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
    caption: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
    small: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    primary: '#818CF8',
    primaryLight: '#A5B4FC',
    primaryDark: '#6366F1',
    
    background: '#0F172A',
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    
    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    
    border: '#475569',
    borderFocus: '#818CF8',
    
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export type Theme = typeof lightTheme;