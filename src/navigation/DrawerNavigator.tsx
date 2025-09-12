import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { BottomTabNavigator } from './BottomTabNavigator';
import { FocusModeScreen } from '../screens/FocusModeScreen';
import { MemoryBankScreen } from '../screens/MemoryBankScreen';
import { ProductivityScreen } from '../screens/ProductivityScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { BackupScreen } from '../screens/BackupScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }: any) => {
  const menuItems = [
    { name: 'Main', icon: '🏠', screen: 'MainTabs' },
    { name: 'Focus Mode', icon: '🎯', screen: 'FocusMode' },
    { name: 'Memory Bank', icon: '🧠', screen: 'MemoryBank' },
    { name: 'Productivity', icon: '📊', screen: 'Productivity' },
    { name: 'Analytics', icon: '📈', screen: 'Analytics' },
    { name: 'Backup & Sync', icon: '☁️', screen: 'Backup' }];

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {}
      <View style={{
        backgroundColor: '#4A90E2',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>TaskFlow</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
          by Roshan
        </Text>
      </View>

      {}
      <ScrollView style={{ flex: 1, paddingTop: 20 }}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.screen}
            onPress={() => navigation.navigate(item.screen)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0',
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 16 }}>{item.icon}</Text>
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#333' }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {}
      <View style={{
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
      }}>
        <Text style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>
          TaskFlow v1.0.0
        </Text>
        <Text style={{ fontSize: 12, color: '#999', textAlign: 'center', marginTop: 4 }}>
          Made with ❤️ by Roshan
        </Text>
      </View>
    </View>
  );
};

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
      <Drawer.Screen name="FocusMode" component={FocusModeScreen} />
      <Drawer.Screen name="MemoryBank" component={MemoryBankScreen} />
      <Drawer.Screen name="Productivity" component={ProductivityScreen} />
      <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
      <Drawer.Screen name="Backup" component={BackupScreen} />
    </Drawer.Navigator>
  );
};