import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ThemeToggle } from '../components/ThemeToggle';

export const ThemesScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container(theme)}>
      <View style={styles.section(theme)}>
        <Text style={styles.sectionTitle(theme)}>Themes & Customization</Text>
        
        <View style={styles.setting}>
          <Text style={styles.settingLabel(theme)}>Dark Mode</Text>
          <ThemeToggle />
        </View>
        
        <Text style={styles.description(theme)}>
          Switch between light and dark themes for comfortable viewing in any environment.
        </Text>
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
    marginBottom: 16,
  },
  settingLabel: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.text,
  }),
  description: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  }),
});