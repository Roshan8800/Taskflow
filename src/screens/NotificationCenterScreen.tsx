import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../hooks/useTheme';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'system' | 'overdue';
  timestamp: Date;
  read: boolean;
}

export const NotificationCenterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem('notifications');
      if (saved) {
        const parsed = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(parsed);
      } else {
        // Demo notifications
        const demoNotifications: Notification[] = [
          {
            id: '1',
            title: 'Task Reminder',
            message: 'Complete project presentation due today',
            type: 'reminder',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            read: false,
          },
          {
            id: '2',
            title: 'Achievement Unlocked!',
            message: 'You completed 10 tasks - Task Master badge earned',
            type: 'achievement',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            read: false,
          },
          {
            id: '3',
            title: 'Overdue Tasks',
            message: '3 tasks are overdue and need attention',
            type: 'overdue',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
            read: true,
          },
          {
            id: '4',
            title: 'Backup Complete',
            message: 'Your data has been backed up successfully',
            type: 'system',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
            read: true,
          },
        ];
        setNotifications(demoNotifications);
        await AsyncStorage.setItem('notifications', JSON.stringify(demoNotifications));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
  };

  const markAllAsRead = async () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
  };

  const clearAll = async () => {
    setNotifications([]);
    await AsyncStorage.removeItem('notifications');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder': return '⏰';
      case 'achievement': return '🏆';
      case 'overdue': return '⚠️';
      case 'system': return 'ℹ️';
      default: return '📱';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder': return theme.primary;
      case 'achievement': return '#FFD700';
      case 'overdue': return theme.error;
      case 'system': return theme.textSecondary;
      default: return theme.primary;
    }
  };

  const filteredNotifications = notifications
    .filter(n => filter === 'all' || !n.read)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const unreadCount = notifications.filter(n => !n.read).length;

  const NotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => markAsRead(item.id)}
      style={{
        backgroundColor: item.read ? theme.surface : theme.primary + '10',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: getNotificationColor(item.type),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Text style={{ fontSize: 24, marginRight: 12 }}>
          {getNotificationIcon(item.type)}
        </Text>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: theme.text,
              flex: 1,
            }}>
              {item.title}
            </Text>
            {!item.read && (
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.primary,
                marginLeft: 8,
              }} />
            )}
          </View>
          <Text style={{
            fontSize: 14,
            color: theme.textSecondary,
            lineHeight: 20,
            marginBottom: 8,
          }}>
            {item.message}
          </Text>
          <Text style={{
            fontSize: 12,
            color: theme.textSecondary,
          }}>
            {item.timestamp.toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{
        backgroundColor: theme.surface,
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 18, color: theme.text }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Text>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={{ fontSize: 14, color: theme.primary, fontWeight: '600' }}>
              Mark All Read
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => setFilter('all')}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: filter === 'all' ? theme.primary : theme.background,
            }}
          >
            <Text style={{
              color: filter === 'all' ? 'white' : theme.text,
              fontSize: 14,
              fontWeight: '600',
            }}>
              All ({notifications.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter('unread')}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: filter === 'unread' ? theme.primary : theme.background,
            }}
          >
            <Text style={{
              color: filter === 'unread' ? 'white' : theme.text,
              fontSize: 14,
              fontWeight: '600',
            }}>
              Unread ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🔔</Text>
            <Text style={{ fontSize: 18, color: theme.textSecondary, textAlign: 'center' }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </Text>
          </View>
        }
      />

      {notifications.length > 0 && (
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            onPress={clearAll}
            style={{
              backgroundColor: theme.error,
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Clear All Notifications
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};