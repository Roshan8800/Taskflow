import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [defaultView, setDefaultView] = useState('list');
  const [sortBy, setSortBy] = useState('dueDate');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify({
        defaultView,
        sortBy,
        language,
        notifications,
        autoSync,
        soundEnabled
      }));
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const SettingRow = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={[styles.row, { backgroundColor: theme.surface }]}>
      <Text style={[styles.rowTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );

  const OptionButton = ({ title, selected, onPress }: { title: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.optionBtn, { backgroundColor: selected ? theme.primary : theme.background }]}
      onPress={onPress}
    >
      <Text style={[styles.optionText, { color: selected ? theme.background : theme.text }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Display Preferences</Text>
      
      <SettingRow title="Default View">
        <View style={styles.options}>
          <OptionButton
            title="List"
            selected={defaultView === 'list'}
            onPress={() => setDefaultView('list')}
          />
          <OptionButton
            title="Kanban"
            selected={defaultView === 'kanban'}
            onPress={() => setDefaultView('kanban')}
          />
        </View>
      </SettingRow>

      <SettingRow title="Sort Tasks By">
        <View style={styles.options}>
          <OptionButton
            title="Due Date"
            selected={sortBy === 'dueDate'}
            onPress={() => setSortBy('dueDate')}
          />
          <OptionButton
            title="Priority"
            selected={sortBy === 'priority'}
            onPress={() => setSortBy('priority')}
          />
          <OptionButton
            title="Created"
            selected={sortBy === 'created'}
            onPress={() => setSortBy('created')}
          />
        </View>
      </SettingRow>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Language & Region</Text>
      
      <SettingRow title="Language">
        <View style={styles.options}>
          <OptionButton
            title="English"
            selected={language === 'en'}
            onPress={() => setLanguage('en')}
          />
          <OptionButton
            title="Spanish"
            selected={language === 'es'}
            onPress={() => setLanguage('es')}
          />
          <OptionButton
            title="French"
            selected={language === 'fr'}
            onPress={() => setLanguage('fr')}
          />
        </View>
      </SettingRow>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
      
      <SettingRow title="Push Notifications">
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: theme.border, true: theme.primary }}
        />
      </SettingRow>

      <SettingRow title="Sound Effects">
        <Switch
          value={soundEnabled}
          onValueChange={setSoundEnabled}
          trackColor={{ false: theme.border, true: theme.primary }}
        />
      </SettingRow>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Data & Sync</Text>
      
      <SettingRow title="Auto Sync">
        <Switch
          value={autoSync}
          onValueChange={setAutoSync}
          trackColor={{ false: theme.border, true: theme.primary }}
        />
      </SettingRow>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
        onPress={saveSettings}
      >
        <Text style={[styles.saveButtonText, { color: theme.background }]}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  options: {
    flexDirection: 'row',
    gap: 8,
  },
  optionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});