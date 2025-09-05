import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

// Import all screens
import { HomeScreen } from '../screens/HomeScreen';
import { TodoScreen } from '../screens/TodoScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ThemeCustomizationScreen } from '../screens/ThemeCustomizationScreen';
import { NotificationCenterScreen } from '../screens/NotificationCenterScreen';
import { ExportImportScreen } from '../screens/ExportImportScreen';
import { HelpCenterScreen } from '../screens/HelpCenterScreen';
import { FeedbackScreen } from '../screens/FeedbackScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { GlobalSearchScreen } from '../screens/GlobalSearchScreen';
import { LabelManagementScreen } from '../screens/LabelManagementScreen';
import { ProductivitySummaryScreen } from '../screens/ProductivitySummaryScreen';
import { GamificationScreen } from '../screens/GamificationScreen';
import { MemoryBankScreen } from '../screens/MemoryBankScreen';
import { MultiSelectScreen } from '../screens/MultiSelectScreen';
import { RecurringTaskScreen } from '../screens/RecurringTaskScreen';
import { ReminderManagerScreen } from '../screens/ReminderManagerScreen';
import { NotesScreen } from '../screens/NotesScreen';
import { AttachmentsScreen } from '../screens/AttachmentsScreen';
import { ChecklistScreen } from '../screens/ChecklistScreen';
import { FocusModeScreen } from '../screens/FocusModeScreen';
import { ArchiveScreen } from '../screens/ArchiveScreen';
import { RecycleBinScreen } from '../screens/RecycleBinScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { StatisticsBreakdownScreen } from '../screens/StatisticsBreakdownScreen';
import { AchievementsDetailScreen } from '../screens/AchievementsDetailScreen';
import { AppLockScreen } from '../screens/AppLockScreen';
import { OfflineSyncScreen } from '../screens/OfflineSyncScreen';
import { ColorThemePickerScreen } from '../screens/ColorThemePickerScreen';
import { AccessibilitySettingsScreen } from '../screens/AccessibilitySettingsScreen';
import { AppLogo } from '../components/AppLogo';

type Screen = 
  | 'Home' | 'Tasks' | 'Calendar' | 'Projects' | 'Analytics'
  | 'Profile' | 'Settings' | 'Themes' | 'Notifications' | 'Export'
  | 'Help' | 'Feedback' | 'About' | 'Search' | 'Gamification' | 'Memory'
  | 'RecurringTask' | 'ReminderManager' | 'Notes' | 'Attachments' | 'Checklist'
  | 'FocusMode' | 'Archive' | 'RecycleBin' | 'Reports' | 'StatisticsBreakdown'
  | 'AchievementsDetail' | 'AppLock' | 'OfflineSync' | 'ColorThemePicker' | 'AccessibilitySettings';

export const MainNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [multiSelectVisible, setMultiSelectVisible] = useState(false);

  const bottomTabs = [
    { id: 'Home', label: 'Home', icon: '🏠' },
    { id: 'Tasks', label: 'Tasks', icon: '✓' },
    { id: 'Calendar', label: 'Calendar', icon: '📅' },
    { id: 'Projects', label: 'Projects', icon: '📁' },
    { id: 'Analytics', label: 'Analytics', icon: '📊' },
  ];

  const drawerItems = [
    { id: 'Profile', label: 'Profile', icon: '👤' },
    { id: 'Settings', label: 'Settings', icon: '⚙️' },
    { id: 'Themes', label: 'Themes & Customization', icon: '🎨' },
    { id: 'ColorThemePicker', label: 'Color & Theme Picker', icon: '🌈' },
    { id: 'AccessibilitySettings', label: 'Accessibility', icon: '♿' },
    { id: 'Notifications', label: 'Notifications', icon: '🔔' },
    { id: 'ReminderManager', label: 'Reminder Manager', icon: '⏰' },
    { id: 'Export', label: 'Backup & Export', icon: '💾' },
    { id: 'OfflineSync', label: 'Offline Sync', icon: '🔄' },
    { id: 'Memory', label: 'Memory Bank', icon: '🧠' },
    { id: 'Notes', label: 'Notes', icon: '📝' },
    { id: 'Attachments', label: 'Attachments', icon: '📎' },
    { id: 'Checklist', label: 'Quick Checklist', icon: '☑️' },
    { id: 'FocusMode', label: 'Focus Mode', icon: '🍅' },
    { id: 'RecurringTask', label: 'Recurring Tasks', icon: '🔁' },
    { id: 'Archive', label: 'Archive', icon: '📦' },
    { id: 'RecycleBin', label: 'Recycle Bin', icon: '🗑️' },
    { id: 'Reports', label: 'Reports', icon: '📊' },
    { id: 'StatisticsBreakdown', label: 'Statistics', icon: '📈' },
    { id: 'Gamification', label: 'Achievements', icon: '🏆' },
    { id: 'AchievementsDetail', label: 'All Achievements', icon: '🏅' },
    { id: 'AppLock', label: 'App Lock', icon: '🔒' },
    { id: 'Help', label: 'Help Center', icon: '❓' },
    { id: 'Feedback', label: 'Feedback', icon: '💬' },
    { id: 'About', label: 'About App', icon: 'ℹ️' },
  ];

  const renderScreen = () => {
    const screenProps = {
      onNavigate: setCurrentScreen,
      onOpenMultiSelect: () => setMultiSelectVisible(true),
    };

    switch (currentScreen) {
      case 'Home': return <HomeScreen {...screenProps} />;
      case 'Tasks': return <TodoScreen {...screenProps} />;
      case 'Calendar': return <CalendarScreen {...screenProps} />;
      case 'Projects': return <ProjectsScreen {...screenProps} />;
      case 'Analytics': return <StatsScreen {...screenProps} />;

      case 'Profile': return <ProfileScreen />;
      case 'Settings': return <SettingsScreen />;
      case 'Themes': return <ThemeCustomizationScreen />;
      case 'Notifications': return <NotificationCenterScreen />;
      case 'Export': return <ExportImportScreen />;
      case 'Help': return <HelpCenterScreen />;
      case 'Feedback': return <FeedbackScreen />;
      case 'About': return <AboutScreen />;
      case 'Search': return <GlobalSearchScreen />;

      case 'Gamification': return <GamificationScreen />;
      case 'Memory': return <MemoryBankScreen />;
      case 'RecurringTask': return <RecurringTaskScreen />;
      case 'ReminderManager': return <ReminderManagerScreen />;
      case 'Notes': return <NotesScreen />;
      case 'Attachments': return <AttachmentsScreen />;
      case 'Checklist': return <ChecklistScreen />;
      case 'FocusMode': return <FocusModeScreen />;
      case 'Archive': return <ArchiveScreen />;
      case 'RecycleBin': return <RecycleBinScreen />;
      case 'Reports': return <ReportsScreen />;
      case 'StatisticsBreakdown': return <StatisticsBreakdownScreen />;
      case 'AchievementsDetail': return <AchievementsDetailScreen />;
      case 'AppLock': return <AppLockScreen />;
      case 'OfflineSync': return <OfflineSyncScreen />;
      case 'ColorThemePicker': return <ColorThemePickerScreen />;
      case 'AccessibilitySettings': return <AccessibilitySettingsScreen />;

      default: return <HomeScreen {...screenProps} />;
    }
  };

  const isMainTab = bottomTabs.some(tab => tab.id === currentScreen);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)}>
          <Text style={[styles.menuIcon, { color: theme.text }]}>☰</Text>
        </TouchableOpacity>
        
        <AppLogo size={32} variant="text" />
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setCurrentScreen('Search')}>
            <Text style={[styles.headerIcon, { color: theme.text }]}>🔍</Text>
          </TouchableOpacity>
          {currentScreen === 'Tasks' && (
            <TouchableOpacity onPress={() => setMultiSelectVisible(true)}>
              <Text style={[styles.headerIcon, { color: theme.text }]}>☑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Screen Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Navigation */}
      {isMainTab && (
        <View style={[styles.bottomNav, { backgroundColor: theme.surface }]}>
          {bottomTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabItem,
                currentScreen === tab.id && { backgroundColor: theme.primary + '20' }
              ]}
              onPress={() => setCurrentScreen(tab.id as Screen)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[
                styles.tabLabel,
                { color: currentScreen === tab.id ? theme.primary : theme.textSecondary }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Side Drawer */}
      {drawerOpen && (
        <View style={styles.drawerOverlay}>
          <TouchableOpacity 
            style={styles.drawerBackdrop} 
            onPress={() => setDrawerOpen(false)} 
          />
          <View style={[styles.drawer, { backgroundColor: theme.surface }]}>
            <View style={styles.drawerHeader}>
              <AppLogo size={60} variant="full" />
            </View>
            
            <ScrollView style={styles.drawerContent}>
              {drawerItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.drawerItem}
                  onPress={() => {
                    setCurrentScreen(item.id as Screen);
                    setDrawerOpen(false);
                  }}
                >
                  <Text style={styles.drawerIcon}>{item.icon}</Text>
                  <Text style={[styles.drawerLabel, { color: theme.text }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity style={styles.drawerItem} onPress={logout}>
                <Text style={styles.drawerIcon}>🚪</Text>
                <Text style={[styles.drawerLabel, { color: '#FF6B6B' }]}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Multi-Select Overlay */}
      <MultiSelectScreen
        visible={multiSelectVisible}
        onClose={() => setMultiSelectVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  menuIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingBottom: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  drawerContent: {
    flex: 1,
    padding: 16,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  drawerIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});