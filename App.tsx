import React, { useEffect, useState } from 'react';
import { AuthScreen } from './src/screens/AuthScreen';
import { MainNavigator } from './src/navigation/MainNavigator';
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { AppLockScreen } from './src/screens/AppLockScreen';
import { ThemeProvider } from './src/hooks/useTheme';
import { useAuth } from './src/hooks/useAuth';
import { LoadingScreen } from './src/components/LoadingScreen';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { checkPermissions } from './src/utils/permissions';
import { handleError } from './src/utils/errorHandler';
import { validateDatabaseIntegrity, cleanupOldData } from './src/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContent: React.FC = () => {
  const { user, isLoading, isLocked } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if first launch
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('hasLaunched', 'true');
        } else {
          setIsFirstLaunch(false);
        }
        
        await checkPermissions();
        await validateDatabaseIntegrity();
        await cleanupOldData();
        
        // Check for missed notifications
        const { checkMissedNotifications, showMissedNotificationsAlert, checkNotificationPermission, showNotificationPermissionPrompt } = await import('./src/utils/notifications');
        
        const hasPermission = await checkNotificationPermission();
        if (!hasPermission) {
          showNotificationPermissionPrompt();
        } else {
          const missed = await checkMissedNotifications();
          showMissedNotificationsAlert(missed);
        }
      } catch (error) {
        handleError(error, 'App Initialization');
        setIsFirstLaunch(false);
      }
    };
    
    initializeApp();
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // If first launch → show Onboarding
  if (isFirstLaunch === true) {
    return <OnboardingScreen onComplete={() => setIsFirstLaunch(false)} />;
  }

  // If still checking first launch or loading
  if (isFirstLaunch === null || isLoading) {
    return showSplash ? 
      <SplashScreen onFinish={handleSplashFinish} /> : 
      <LoadingScreen message="Initializing TaskFlow..." />;
  }

  // If Splash finds valid session and app lock is on → show App Lock
  if (user && isLocked) {
    return <AppLockScreen />;
  }

  // If Splash finds valid session and app lock is off → go to Home
  if (user && !isLocked) {
    return <MainNavigator />;
  }

  // No valid session → show Auth
  return <AuthScreen />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;