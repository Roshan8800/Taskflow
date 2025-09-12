import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, TextInput, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';

export const SecurityScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { setPIN, disableAppLock, authenticateWithBiometric } = useAuth();
  const { appSettings, updateAppSettings } = useSettings();
  const [newPIN, setNewPIN] = useState('');
  const [confirmPIN, setConfirmPIN] = useState('');

  const handleSetPIN = async () => {
    if (newPIN.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }
    
    if (newPIN !== confirmPIN) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }

    const success = await setPIN(newPIN);
    if (success) {
      Alert.alert('Success', 'PIN set successfully');
      setNewPIN('');
      setConfirmPIN('');
      await updateAppSettings({ appLock: true });
    } else {
      Alert.alert('Error', 'Failed to set PIN');
    }
  };

  const handleDisableLock = async () => {
    Alert.alert(
      'Disable App Lock',
      'Are you sure you want to disable app lock?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            const success = await disableAppLock();
            if (success) {
              await updateAppSettings({ appLock: false });
              Alert.alert('Success', 'App lock disabled');
            }
          },
        }]
    );
  };

  const testBiometric = async () => {
    const success = await authenticateWithBiometric();
    Alert.alert(
      success ? 'Success' : 'Failed',
      success ? 'Biometric authentication successful' : 'Biometric authentication failed'
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
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000000' }}>Security</Text>
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
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000', marginBottom: 16 }}>
            🔒 App Lock
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000' }}>Enable App Lock</Text>
              <Text style={{ fontSize: 14, color: '#000000', marginTop: 2 }}>
                Require PIN or biometric to open app
              </Text>
            </View>
            <Switch
              value={appSettings.appLock}
              onValueChange={(value) => {
                if (!value) {
                  handleDisableLock();
                } else {
                  updateAppSettings({ appLock: value });
                }
              }}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>

          {!appSettings.appLock && (
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000', marginBottom: 12 }}>
                Set PIN Code
              </Text>
              <TextInput
                value={newPIN}
                onChangeText={setNewPIN}
                placeholder="Enter 4-digit PIN"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  color: '#000000',
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  marginBottom: 12,
                }}
              />
              <TextInput
                value={confirmPIN}
                onChangeText={setConfirmPIN}
                placeholder="Confirm PIN"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  color: '#000000',
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  marginBottom: 12,
                }}
              />
              <TouchableOpacity
                onPress={handleSetPIN}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Set PIN</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000', marginBottom: 16 }}>
            👆 Biometric Authentication
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000' }}>Biometric Unlock</Text>
              <Text style={{ fontSize: 14, color: '#000000', marginTop: 2 }}>
                Use fingerprint or face recognition
              </Text>
            </View>
            <Switch
              value={appSettings.biometric}
              onValueChange={(value) => updateAppSettings({ biometric: value })}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>

          <TouchableOpacity
            onPress={testBiometric}
            style={{
              backgroundColor: '#FFFFFF',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Test Biometric</Text>
          </TouchableOpacity>
        </View>

        {}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000', marginBottom: 16 }}>
            🔐 Data Encryption
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000' }}>End-to-End Encryption</Text>
              <Text style={{ fontSize: 14, color: '#000000', marginTop: 2 }}>
                Encrypt all local data with AES-256
              </Text>
            </View>
            <Switch
              value={appSettings.encryption}
              onValueChange={(value) => updateAppSettings({ encryption: value })}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
        </View>

        {}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 12 }}>
            🛡️ Security Information
          </Text>
          <Text style={{ fontSize: 14, color: '#000000', lineHeight: 20, marginBottom: 8 }}>
            • All data is stored locally on your device
          </Text>
          <Text style={{ fontSize: 14, color: '#000000', lineHeight: 20, marginBottom: 8 }}>
            • PIN and biometric data never leave your device
          </Text>
          <Text style={{ fontSize: 14, color: '#000000', lineHeight: 20, marginBottom: 8 }}>
            • Encryption keys are generated and stored securely
          </Text>
          <Text style={{ fontSize: 14, color: '#000000', lineHeight: 20 }}>
            • No personal data is transmitted to external servers
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SecurityScreen;