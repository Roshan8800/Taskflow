import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { setupBackHandler } from '../utils/backHandler';
import { HomeScreen } from '../screens/HomeScreen';
import { TodoScreen } from '../screens/TodoScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { NewTaskScreen } from '../screens/NewTaskScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { ProjectDetailScreen } from '../screens/ProjectDetailScreen';
import { ProjectSettingsScreen } from '../screens/ProjectSettingsScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NotificationCenterScreen } from '../screens/NotificationCenterScreen';
import { ThemesScreen } from '../screens/ThemesScreen';
import { BackupScreen } from '../screens/BackupScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { DrawerContent } from '../components/DrawerContent';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          shadowColor: theme.shadow,
        },
        headerTintColor: theme.text,
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={() => navigation.openDrawer()}
          >
            <Text style={{ fontSize: 20, color: '#000000' }}>☰</Text>
          </TouchableOpacity>
        ),
        headerLeft: ({ canGoBack, route }) => {
          const isMainTab = ['Home', 'Tasks', 'Calendar', 'Projects', 'Analytics'].includes(route.name);
          return canGoBack && !isMainTab ? (
            <TouchableOpacity
              style={{ marginLeft: 16 }}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ fontSize: 20, color: '#000000' }}>←</Text>
            </TouchableOpacity>
          ) : null;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TodoScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✅</Text>,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📁</Text>,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { theme } = useTheme();
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    const removeBackHandler = setupBackHandler(navigationRef);
    return removeBackHandler;
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#FFFFFF',
            width: 280,
          },
          gestureEnabled: true,
        }}
      >
        <Drawer.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ gestureEnabled: false }}
        />
        <Drawer.Screen 
          name="TaskDetail" 
          component={TaskDetailScreen}
          options={{ 
            title: 'Task Details',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: theme.text
          }}
        />
        <Drawer.Screen 
          name="NewTask" 
          component={NewTaskScreen}
          options={{ 
            title: 'New Task',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: theme.text
          }}
        />
        <Drawer.Screen 
          name="ProjectDetail" 
          component={ProjectDetailScreen}
          options={{ 
            title: 'Project Details',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: theme.text
          }}
        />
        <Drawer.Screen 
          name="ProjectSettings" 
          component={ProjectSettingsScreen}
          options={{ 
            title: 'Project Settings',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: theme.text
          }}
        />
        <Drawer.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ 
            title: 'Profile',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: theme.text
          }}
        />
        <Drawer.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ 
            title: 'Settings',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: theme.text
          }}
        />
        <Drawer.Screen 
          name="NotificationCenter" 
          component={NotificationCenterScreen}
          options={{ 
            title: 'Notifications',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: theme.text
          }}
        />
        <Drawer.Screen 
          name="Themes" 
          component={ThemesScreen}
          options={{ 
            title: 'Themes',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: theme.text
          }}
        />
        <Drawer.Screen 
          name="Backup" 
          component={BackupScreen}
          options={{ 
            title: 'Backup & Export',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: theme.text
          }}
        />
        <Drawer.Screen 
          name="Help" 
          component={HelpScreen}
          options={{ 
            title: 'Help & Feedback',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: theme.text
          }}
        />
        <Drawer.Screen 
          name="About" 
          component={AboutScreen}
          options={{ 
            title: 'About',
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTintColor: theme.text
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};