import { BackHandler, Alert } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';

export const setupBackHandler = (navigationRef: React.RefObject<NavigationContainerRef<any>>) => {
  const backAction = () => {
    const currentRoute = navigationRef.current?.getCurrentRoute();
    
    if (!currentRoute) return false;
    
    // Main tab screens - allow default back behavior (exit app)
    const mainTabs = ['Home', 'Tasks', 'Calendar', 'Projects', 'Analytics'];
    if (mainTabs.includes(currentRoute.name)) {
      // On main tabs, show exit confirmation
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() }
        ]
      );
      return true; // Prevent default back behavior
    }
    
    // Sub-screens - navigate back to previous screen
    const subScreens = [
      'TaskDetail', 'NewTask', 'ProjectDetail', 'ProjectSettings',
      'Profile', 'Settings', 'NotificationCenter', 'Themes', 
      'Backup', 'Help', 'About'
    ];
    
    if (subScreens.includes(currentRoute.name)) {
      navigationRef.current?.goBack();
      return true; // Prevent default back behavior
    }
    
    return false; // Allow default back behavior
  };

  BackHandler.addEventListener('hardwareBackPress', backAction);
  
  return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
};