import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ThemeToggle } from '../components/ThemeToggle';

export const ThemesScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container]}>
      <View style={[styles.section]}>
        <Text style={[styles.sectionTitle]}>Themes & Customization</Text>
        
        <View style={styles.setting}>
          <Text style={[styles.settingLabel]}>Dark Mode</Text>
          <ThemeToggle />
        </View>
        
        <Text style={[styles.description]}>
          Switch between light and dark themes for comfortable viewing in any environment.
        </Text>
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
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#000000',
  },
  description: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
});

export default ThemesScreen;