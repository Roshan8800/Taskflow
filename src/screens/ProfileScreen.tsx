import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { profile, updateProfile } = useSettings();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [avatar, setAvatar] = useState(profile.avatar);

  const handleSave = async () => {
    try {
      await updateProfile({ name, email, avatar });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const selectAvatar = () => {
    const avatars = ['👤', '👨‍💻', '👩‍💻', '🧑‍💼', '👨‍🎨', '👩‍🎨', '🧑‍🔬', '👨‍🏫', '👩‍🏫'];
    Alert.alert(
      'Choose Avatar',
      '',
      avatars.map(emoji => ({
        text: emoji,
        onPress: () => setAvatar(emoji),
      }))
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 18, color: theme.text }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>Profile</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={{ fontSize: 16, color: theme.primary, fontWeight: '600' }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Avatar */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity
            onPress={selectAvatar}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: theme.primary + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 48 }}>{avatar || '👤'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={selectAvatar}>
            <Text style={{ color: theme.primary, fontSize: 16, fontWeight: '600' }}>
              Change Avatar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Name */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 8 }}>
            Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={theme.textSecondary}
            style={{
              backgroundColor: theme.surface,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: theme.text,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          />
        </View>

        {/* Email */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 8 }}>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={theme.textSecondary}
            keyboardType="email-address"
            style={{
              backgroundColor: theme.surface,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: theme.text,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          />
        </View>

        {/* App Info */}
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 12,
          padding: 16,
          marginTop: 20,
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
            App Information
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: theme.textSecondary }}>Version</Text>
            <Text style={{ color: theme.text }}>1.0.0</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: theme.textSecondary }}>Developer</Text>
            <Text style={{ color: theme.text }}>Roshan</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: theme.textSecondary }}>Email</Text>
            <Text style={{ color: theme.text }}>roshan8800jp@gmail.com</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};