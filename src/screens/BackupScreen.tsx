import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useBackup } from '../hooks/useBackup';
import { useTheme } from '../hooks/useTheme';

export const BackupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { loading, exportBackup, importBackup, syncData } = useBackup();

  const handleExport = (format: 'json' | 'csv') => {
    Alert.alert(
      'Export Options',
      'Choose export type',
      [
        { text: 'Encrypted', onPress: () => exportBackup(format, true) },
        { text: 'Plain Text', onPress: () => exportBackup(format, false) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
            <Text style={{ fontSize: 18, color: theme.text }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>Backup & Sync</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Export Backup */}
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 12 }}>
            📤 Export Backup
          </Text>
          <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 16 }}>
            Create a backup of all your tasks and projects
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={() => handleExport('json')}
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: theme.primary,
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                {loading ? 'Exporting...' : 'JSON Format'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleExport('csv')}
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: theme.success,
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                CSV Format
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Import Backup */}
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 12 }}>
            📥 Import Backup
          </Text>
          <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 16 }}>
            Restore your data from a backup file
          </Text>
          
          <TouchableOpacity
            onPress={importBackup}
            disabled={loading}
            style={{
              backgroundColor: theme.warning,
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              {loading ? 'Importing...' : 'Select Backup File'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Manual Sync */}
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 12 }}>
            🔄 Manual Sync
          </Text>
          <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 16 }}>
            Synchronize your data with cloud storage
          </Text>
          
          <TouchableOpacity
            onPress={syncData}
            disabled={loading}
            style={{
              backgroundColor: theme.primary,
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              {loading ? 'Syncing...' : 'Sync Now'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Security Info */}
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 12,
          padding: 16,
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 12 }}>
            🔒 Security Features
          </Text>
          <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20, marginBottom: 8 }}>
            • End-to-end encryption for all local data
          </Text>
          <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20, marginBottom: 8 }}>
            • Encrypted backup files with AES-256
          </Text>
          <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20, marginBottom: 8 }}>
            • Local storage with secure key management
          </Text>
          <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20 }}>
            • No data transmitted without encryption
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};