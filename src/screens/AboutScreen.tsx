import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { AppLogo } from '../components/AppLogo';

export const AboutScreen: React.FC = () => {
  const { theme } = useTheme();

  const openEmail = () => {
    Linking.openURL('mailto:roshan8800jp@gmail.com?subject=TaskFlow App Feedback');
  };

  const showPrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'TaskFlow stores all data locally on your device. No personal information is collected or transmitted to external servers. Your tasks, projects, and personal data remain private and secure on your device.',
      [{ text: 'OK' }]
    );
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={[styles.infoRow, { backgroundColor: theme.surface }]}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <AppLogo size={80} variant="full" />
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
          Organize your life, one task at a time
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>App Information</Text>
        
        <InfoRow label="Version" value="1.0.0" />
        <InfoRow label="Build" value="2024.01.15" />
        <InfoRow label="Platform" value="React Native" />
        <InfoRow label="Database" value="Realm" />
        <InfoRow label="App ID" value="com.roshan.taskflow" />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Developer</Text>
        
        <InfoRow label="Created by" value="Roshan 💗" />
        <InfoRow label="Developer" value="Passionate about productivity" />
        <InfoRow label="Email" value="roshan8800jp@gmail.com" />
        <InfoRow label="Support" value="roshan8800jp@gmail.com" />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Features</Text>
        
        <View style={[styles.featureList, { backgroundColor: theme.surface }]}>
          <Text style={[styles.feature, { color: theme.text }]}>✅ Offline-first data storage</Text>
          <Text style={[styles.feature, { color: theme.text }]}>✅ Real-time UI updates</Text>
          <Text style={[styles.feature, { color: theme.text }]}>✅ Project organization</Text>
          <Text style={[styles.feature, { color: theme.text }]}>✅ Task priorities & labels</Text>
          <Text style={[styles.feature, { color: theme.text }]}>✅ Analytics & insights</Text>
          <Text style={[styles.feature, { color: theme.text }]}>✅ Dark/Light themes</Text>
          <Text style={[styles.feature, { color: theme.text }]}>✅ Memory bank system</Text>
          <Text style={[styles.feature, { color: theme.text }]}>✅ Export/Import data</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={openEmail}
        >
          <Text style={[styles.buttonText, { color: theme.background }]}>Contact Developer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.surface }]}
          onPress={showPrivacyPolicy}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Made with 💗 by Roshan for productivity enthusiasts
        </Text>
        <Text style={[styles.copyright, { color: theme.textSecondary }]}>
          © 2024 Roshan. All rights reserved.
        </Text>
        <Text style={[styles.dedication, { color: theme.primary }]}>
          🚀 Crafted with passion for better productivity 🚀
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
  },
  featureList: {
    padding: 16,
    borderRadius: 8,
  },
  feature: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  actions: {
    gap: 12,
    marginBottom: 30,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  copyright: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  dedication: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});