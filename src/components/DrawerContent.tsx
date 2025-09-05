import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

export const DrawerContent: React.FC<any> = (props) => {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props} style={styles.container(theme)}>
      <View style={styles.header(theme)}>
        <Text style={styles.title(theme)}>TaskFlow</Text>
        <Text style={styles.subtitle(theme)}>{user?.username}</Text>
        <Text style={styles.email(theme)}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem(theme)}
          onPress={() => props.navigation.navigate('Profile')}
        >
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuText(theme)}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem(theme)}
          onPress={() => props.navigation.navigate('Profile')}
        >
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuText(theme)}>Profile & Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem(theme)}
          onPress={() => props.navigation.navigate('NotificationCenter')}
        >
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuText(theme)}>Notification Center</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem(theme)}
          onPress={() => props.navigation.navigate('Themes')}
        >
          <Text style={styles.menuIcon}>🎨</Text>
          <Text style={styles.menuText(theme)}>Themes & Customization</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem(theme)}
          onPress={() => props.navigation.navigate('Backup')}
        >
          <Text style={styles.menuIcon}>💾</Text>
          <Text style={styles.menuText(theme)}>Backup/Export</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem(theme)}
          onPress={() => props.navigation.navigate('Help')}
        >
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText(theme)}>Help & Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem(theme)}
          onPress={() => props.navigation.navigate('About')}
        >
          <Text style={styles.menuIcon}>ℹ️</Text>
          <Text style={styles.menuText(theme)}>About App</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem(theme)}
          onPress={signOut}
        >
          <Text style={styles.menuIcon}>🚪</Text>
          <Text style={styles.menuText(theme)}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: (theme: any) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
  header: (theme: any) => ({
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  }),
  title: (theme: any) => ({
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  }),
  subtitle: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 4,
  }),
  email: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 2,
  }),
  menu: {
    paddingTop: 20,
  },
  menuItem: (theme: any) => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  }),
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuText: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.text,
  }),
});