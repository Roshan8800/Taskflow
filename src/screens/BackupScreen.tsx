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
        { text: 'Cancel', style: 'cancel' }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{
        backgroundColor: '#FFFFFF',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
            <Text style={{ fontSize: 18, color: '#000000' }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000000' }}>Backup & Sync</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000', marginBottom: 12 }}>
            📤 Export Backup
          </Text>
          <Text style={{ fontSize: 14, color: '#000000', marginBottom: 16 }}>
            Create a backup of all your tasks and projects
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={() => handleExport('json')}
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                {loading ? 'ExportingJSON Format'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleExport('csv')}
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
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

        {}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000', marginBottom: 12 }}>
            📥 Import Backup
          </Text>
          <Text style={{ fontSize: 14, color: '#000000', marginBottom: 16 }}>
            Restore your data from a backup file
          </Text>
          
          <TouchableOpacity
            onPress={importBackup}
            disabled={loading}
            style={{
              backgroundColor: '#FFFFFF',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              {loading ? 'ImportingSelect Backup File'}
            </Text>
          </TouchableOpacity>
        </View>

        {}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000', marginBottom: 12 }}>
            🔄 Manual Sync
          </Text>
          <Text style={{ fontSize: 14, color: '#000000', marginBottom: 16 }}>
            Synchronize your data with cloud storage
          </Text>
          
          <TouchableOpacity
            onPress={syncData}
            disabled={loading}
            style={{
              backgroundColor: '#FFFFFF',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              {loading ? 'SyncingSync Now'}
            </Text>
          </TouchableOpacity>
        </View>

        {}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 12 }}>
            🔒 Security Features
          </Text>
          <Text style={{ fontSize: 14, color: '#000000', lineHeight: 20, marginBottom: 8 }}>
            • End-to-end encryption for all local data
          </Text>
          <Text style={{ fontSize: 14, color: '#000000', lineHeight: 20, marginBottom: 8 }}>
            • Encrypted backup files with AES-256
          </Text>
          <Text style={{ fontSize: 14, color: '#000000', lineHeight: 20, marginBottom: 8 }}>
            • Local storage with secure key management
          </Text>
          <Text style={{ fontSize: 14, color: '#000000', lineHeight: 20 }}>
            • No data transmitted without encryption
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default BackupScreen;