import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { user, updateProfile, signOut } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    setLoading(true);
    const success = await updateProfile(username.trim());
    if (success) {
      onClose();
    } else {
      Alert.alert('Error', 'Failed to update profile');
    }
    setLoading(false);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal(theme)}>
          <Text style={styles.title(theme)}>Profile</Text>
          
          <View style={styles.form}>
            <Text style={styles.label(theme)}>Email</Text>
            <Text style={styles.emailText(theme)}>{user?.email}</Text>
            
            <Text style={styles.label(theme)}>Username</Text>
            <TextInput
              style={styles.input(theme)}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.saveButton(theme)}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signOutButton(theme)}
              onPress={handleSignOut}
            >
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText(theme)}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modal: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 24,
    ...theme.shadows.lg,
  }),
  title: (theme: any) => ({
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 24,
  }),
  form: {
    marginBottom: 24,
  },
  label: (theme: any) => ({
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
    marginTop: 16,
  }),
  emailText: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.textMuted,
    padding: 16,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
  }),
  input: (theme: any) => ({
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }),
  buttons: {
    gap: 12,
  },
  saveButton: (theme: any) => ({
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  }),
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: (theme: any) => ({
    backgroundColor: theme.colors.error,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  }),
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: (theme: any) => ({
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  }),
});