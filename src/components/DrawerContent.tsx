import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

export const DrawerContent: React.FC<any> = (props) => {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props} style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <View style={[styles.header, { backgroundColor: '#FFFFFF', borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: '#000000' }]}>TaskFlow</Text>
        <Text style={[styles.subtitle, { color: '#000000' }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: '#000000' }]}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={[styles.menuItem]}
          onPress={() => props.navigation.navigate('Profile' as never)}
        >
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={[styles.menuText, { color: '#000000' }]}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem]}
          onPress={() => props.navigation.navigate('Profile' as never)}
        >
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={[styles.menuText, { color: '#000000' }]}>Profile & Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem]}
          onPress={() => props.navigation.navigate('NotificationCenter' as never)}
        >
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={[styles.menuText, { color: '#000000' }]}>Notification Center</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem]}
          onPress={() => props.navigation.navigate('Themes' as never)}
        >
          <Text style={styles.menuIcon}>🎨</Text>
          <Text style={[styles.menuText, { color: '#000000' }]}>Themes & Customization</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem]}
          onPress={() => props.navigation.navigate('Backup' as never)}
        >
          <Text style={styles.menuIcon}>💾</Text>
          <Text style={[styles.menuText, { color: '#000000' }]}>Backup/Export</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem]}
          onPress={() => props.navigation.navigate('Help' as never)}
        >
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={[styles.menuText, { color: '#000000' }]}>Help & Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem]}
          onPress={() => props.navigation.navigate('About' as never)}
        >
          <Text style={styles.menuIcon}>ℹ️</Text>
          <Text style={[styles.menuText, { color: '#000000' }]}>About App</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem]}
          onPress={signOut}
        >
          <Text style={styles.menuIcon}>🚪</Text>
          <Text style={[styles.menuText, { color: '#000000' }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    marginTop: 2,
  },
  menu: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
  },
});

export default DrawerContent;