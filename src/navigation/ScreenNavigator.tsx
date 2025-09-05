import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ScreenNavigatorProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  showBackButton?: boolean;
}

export const ScreenNavigator: React.FC<ScreenNavigatorProps> = ({
  currentScreen,
  onNavigate,
  showBackButton = false,
}) => {
  const { theme } = useTheme();

  const getScreenTitle = (screen: string) => {
    const titles: { [key: string]: string } = {
      'Home': 'Dashboard',
      'Tasks': 'Tasks',
      'Calendar': 'Calendar',
      'Projects': 'Projects',
      'Analytics': 'Analytics',
      'Profile': 'Profile',
      'Settings': 'Settings',
      'Themes': 'Themes',
      'ColorThemePicker': 'Color & Theme Picker',
      'AccessibilitySettings': 'Accessibility',
      'Notifications': 'Notifications',
      'ReminderManager': 'Reminder Manager',
      'Export': 'Backup & Export',
      'OfflineSync': 'Offline Sync',
      'Memory': 'Memory Bank',
      'Notes': 'Notes',
      'Attachments': 'Attachments',
      'Checklist': 'Quick Checklist',
      'FocusMode': 'Focus Mode',
      'RecurringTask': 'Recurring Tasks',
      'Archive': 'Archive',
      'RecycleBin': 'Recycle Bin',
      'Reports': 'Reports',
      'StatisticsBreakdown': 'Statistics Breakdown',
      'Gamification': 'Achievements',
      'AchievementsDetail': 'All Achievements',
      'AppLock': 'App Lock',
      'Help': 'Help Center',
      'Feedback': 'Feedback',
      'About': 'About TaskFlow',
      'Search': 'Global Search',
    };
    return titles[screen] || screen;
  };

  const handleBack = () => {
    // Navigate back to appropriate parent screen
    const backNavigation: { [key: string]: string } = {
      'ColorThemePicker': 'Themes',
      'AccessibilitySettings': 'Settings',
      'ReminderManager': 'Notifications',
      'OfflineSync': 'Export',
      'StatisticsBreakdown': 'Analytics',
      'AchievementsDetail': 'Gamification',
      'Search': 'Tasks',
    };
    
    const backScreen = backNavigation[currentScreen] || 'Home';
    onNavigate(backScreen);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={[styles.backIcon, { color: theme.primary }]}>←</Text>
        </TouchableOpacity>
      )}
      
      <Text style={[styles.title, { color: theme.text }]}>
        {getScreenTitle(currentScreen)}
      </Text>
      
      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  spacer: {
    width: 40,
  },
});