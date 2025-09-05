import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const NotificationsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [emailEnabled, setEmailEnabled] = React.useState(false);

  return (
    <View style={styles.container(theme)}>
      <View style={styles.section(theme)}>
        <Text style={styles.sectionTitle(theme)}>Notification Settings</Text>
        
        <View style={styles.setting}>
          <Text style={styles.settingLabel(theme)}>Push Notifications</Text>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} />
        </View>
        
        <View style={styles.setting}>
          <Text style={styles.settingLabel(theme)}>Email Notifications</Text>
          <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: (theme: any) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  }),
  section: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    ...theme.shadows.md,
  }),
  sectionTitle: (theme: any) => ({
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  }),
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.text,
  }),
});