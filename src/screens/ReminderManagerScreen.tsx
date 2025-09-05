import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Reminder {
  id: string;
  title: string;
  time: string;
  enabled: boolean;
  type: 'task' | 'daily' | 'custom';
}

export const ReminderManagerScreen: React.FC = () => {
  const { theme } = useTheme();
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', title: 'Daily Review', time: '6:00 PM', enabled: true, type: 'daily' },
    { id: '2', title: 'Project Meeting', time: '2:00 PM', enabled: true, type: 'task' },
    { id: '3', title: 'Exercise', time: '7:00 AM', enabled: false, type: 'custom' },
  ]);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return '✓';
      case 'daily': return '📅';
      case 'custom': return '⏰';
      default: return '🔔';
    }
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={[styles.reminderCard, { backgroundColor: theme.surface }]}>
      <View style={styles.reminderInfo}>
        <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
        <View style={styles.reminderDetails}>
          <Text style={[styles.reminderTitle, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.reminderTime, { color: theme.textSecondary }]}>{item.time}</Text>
        </View>
      </View>
      <Switch
        value={item.enabled}
        onValueChange={() => toggleReminder(item.id)}
        trackColor={{ false: theme.border, true: theme.primary }}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Reminder Manager</Text>
      
      <View style={styles.stats}>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>
            {reminders.filter(r => r.enabled).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Active</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {reminders.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total</Text>
        </View>
      </View>

      <FlatList
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]}>
        <Text style={[styles.addBtnText, { color: theme.background }]}>+ Add Reminder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  stats: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 14, marginTop: 4 },
  list: { paddingBottom: 80 },
  reminderCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 8, marginBottom: 8 },
  reminderInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  typeIcon: { fontSize: 20, marginRight: 12 },
  reminderDetails: { flex: 1 },
  reminderTitle: { fontSize: 16, fontWeight: '500', marginBottom: 2 },
  reminderTime: { fontSize: 14 },
  addBtn: { position: 'absolute', bottom: 20, left: 16, right: 16, padding: 16, borderRadius: 8, alignItems: 'center' },
  addBtnText: { fontSize: 16, fontWeight: '600' },
});