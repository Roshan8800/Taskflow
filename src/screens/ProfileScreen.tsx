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
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{
        backgroundColor: '#FFFFFF',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 18, color: '#000000' }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000000' }}>Profile</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={{ fontSize: 16, color: '#000000', fontWeight: '600' }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity
            onPress={selectAvatar}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#FFFFFF' + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 48 }}>{avatar || '👤'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={selectAvatar}>
            <Text style={{ color: '#000000', fontSize: 16, fontWeight: '600' }}>
              Change Avatar
            </Text>
          </TouchableOpacity>
        </View>

        {}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000', marginBottom: 8 }}>
            Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={theme.textSecondary}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: '#000000',
              borderWidth: 1,
              borderColor: '#CCCCCC',
            }}
          />
        </View>

        {}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000', marginBottom: 8 }}>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={theme.textSecondary}
            keyboardType="email-address"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: '#000000',
              borderWidth: 1,
              borderColor: '#CCCCCC',
            }}
          />
        </View>

        {}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginTop: 20,
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000', marginBottom: 12 }}>
            App Information
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#000000' }}>Version</Text>
            <Text style={{ color: '#000000' }}>1.0.0</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: '#000000' }}>Developer</Text>
            <Text style={{ color: '#000000' }}>Roshan</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#000000' }}>Email</Text>
            <Text style={{ color: '#000000' }}>roshan8800jp@gmail.com</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;