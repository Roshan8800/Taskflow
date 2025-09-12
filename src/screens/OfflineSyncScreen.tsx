import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const OfflineSyncScreen: React.FC = () => {
  const { theme } = useTheme();
  const [autoSync, setAutoSync] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());

  const syncData = {
    tasks: { pending: 3, synced: 45, failed: 0 },
    projects: { pending: 1, synced: 8, failed: 0 },
    notes: { pending: 0, synced: 12, failed: 0 },
    attachments: { pending: 2, synced: 5, failed: 1 },
  };

  const handleManualSync = () => {
    // Simulate sync process
    setLastSync(new Date());
  };

  const SyncStatusCard = ({ title, data }: { title: string; data: any }) => (
    <View style={[styles.statusCard, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.statusTitle, { color: '#000000' }]}>{title}</Text>
      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <Text style={[styles.statusNumber, { color: '#FFD93D' }]}>{data.pending}</Text>
          <Text style={[styles.statusLabel, { color: '#000000' }]}>Pending</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={[styles.statusNumber, { color: '#6BCF7F' }]}>{data.synced}</Text>
          <Text style={[styles.statusLabel, { color: '#000000' }]}>Synced</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={[styles.statusNumber, { color: '#FF6B6B' }]}>{data.failed}</Text>
          <Text style={[styles.statusLabel, { color: '#000000' }]}>Failed</Text>
        </View>
      </View>
    </View>
  );

  const totalPending = Object.values(syncData).reduce((sum, item) => sum + item.pending, 0);
  const totalFailed = Object.values(syncData).reduce((sum, item) => sum + item.failed, 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, { color: '#000000' }]}>Offline Sync Manager</Text>

      <View style={[styles.overview, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.overviewItem}>
          <Text style={[styles.overviewNumber, { color: '#000000' }]}>
            {totalPending}
          </Text>
          <Text style={[styles.overviewLabel, { color: '#000000' }]}>
            Pending Changes
          </Text>
        </View>
        <View style={styles.overviewItem}>
          <Text style={[styles.overviewNumber, { color: totalFailed > 0 ? '#FF6B6B' : '#6BCF7F' }]}>
            {totalFailed > 0 ? 'Issues' : 'All Good'}
          </Text>
          <Text style={[styles.overviewLabel, { color: '#000000' }]}>
            Sync Status
          </Text>
        </View>
      </View>

      <View style={styles.syncStatus}>
        <SyncStatusCard title="Tasks" data={syncData.tasks} />
        <SyncStatusCard title="Projects" data={syncData.projectIds} />
        <SyncStatusCard title="Notes" data={syncData.notes} />
        <SyncStatusCard title="Attachments" data={syncData.attachments} />
      </View>

      <View style={[styles.settings, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.settingsTitle, { color: '#000000' }]}>Sync Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: '#000000' }]}>Auto Sync</Text>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{ false: theme.border, true: theme.primary }}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: '#000000' }]}>WiFi Only</Text>
          <Switch
            value={wifiOnly}
            onValueChange={setWifiOnly}
            trackColor={{ false: theme.border, true: theme.primary }}
          />
        </View>
      </View>

      <View style={[styles.lastSync, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.lastSyncLabel, { color: '#000000' }]}>
          Last sync: {lastSync.toLocaleString()}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.syncBtn, { backgroundColor: '#FFFFFF' }]}
        onPress={handleManualSync}
      >
        <Text style={[styles.syncBtnText, { color: '#000000' }]}>
          🔄 Sync Now
        </Text>
      </TouchableOpacity>

      <View style={[styles.info, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.infoTitle, { color: '#000000' }]}>ℹ️ About Offline Sync</Text>
        <Text style={[styles.infoText, { color: '#000000' }]}>
          TaskFlow works completely offline. Changes are stored locally and will sync when you're back online. 
          No data is lost during offline usage.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  overview: { flexDirection: 'row', padding: 16, borderRadius: 8, marginBottom: 20 },
  overviewItem: { flex: 1, alignItems: 'center' },
  overviewNumber: { fontSize: 24, fontWeight: 'bold' },
  overviewLabel: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  syncStatus: { gap: 12, marginBottom: 20 },
  statusCard: { padding: 16, borderRadius: 8 },
  statusTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statusItem: { alignItems: 'center' },
  statusNumber: { fontSize: 20, fontWeight: 'bold' },
  statusLabel: { fontSize: 12, marginTop: 4 },
  settings: { padding: 16, borderRadius: 8, marginBottom: 16 },
  settingsTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  settingLabel: { fontSize: 16 },
  lastSync: { padding: 12, borderRadius: 8, marginBottom: 16 },
  lastSyncLabel: { fontSize: 14, textAlign: 'center' },
  syncBtn: { padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  syncBtnText: { fontSize: 16, fontWeight: '600' },
  info: { padding: 16, borderRadius: 8, marginBottom: 20 },
  infoTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  infoText: { fontSize: 14, lineHeight: 20 },
});

export default OfflineSyncScreen;