import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const NotificationsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [emailEnabled, setEmailEnabled] = React.useState(false);

  return (
    <View style={[styles.container]}>
      <View style={[styles.section]}>
        <Text style={[styles.sectionTitle]}>Notification Settings</Text>
        
        <View style={styles.setting}>
          <Text style={[styles.settingLabel]}>Push Notifications</Text>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} />
        </View>
        
        <View style={styles.setting}>
          <Text style={[styles.settingLabel]}>Email Notifications</Text>
          <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  section: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 20,
    ,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#000000',
  },
});

export default NotificationsScreen;