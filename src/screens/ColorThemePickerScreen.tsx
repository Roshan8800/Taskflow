import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ThemePreset {
  id: string;
  name: string;
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export const ColorThemePickerScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState('default');

  const themePresets: ThemePreset[] = [
    {
      id: 'default',
      name: 'Default Blue',
      primary: '#4A90E2',
      background: isDark ? '#121212' : '#FFFFFF',
      surface: isDark ? '#1E1E1E' : '#F8F9FA',
      text: isDark ? '#FFFFFF' : '#212529',
      textSecondary: isDark ? '#B0B0B0' : '#6C757D',
    },
    {
      id: 'ocean',
      name: 'Ocean Breeze',
      primary: '#00BCD4',
      background: isDark ? '#0D1B2A' : '#F0F8FF',
      surface: isDark ? '#1B263B' : '#E6F3FF',
      text: isDark ? '#FFFFFF' : '#1A365D',
      textSecondary: isDark ? '#94A3B8' : '#4A5568',
    },
    {
      id: 'forest',
      name: 'Forest Green',
      primary: '#4CAF50',
      background: isDark ? '#1B2F1B' : '#F1F8E9',
      surface: isDark ? '#2E4A2E' : '#E8F5E8',
      text: isDark ? '#FFFFFF' : '#1B5E20',
      textSecondary: isDark ? '#A5D6A7' : '#388E3C',
    },
    {
      id: 'sunset',
      name: 'Sunset Orange',
      primary: '#FF9800',
      background: isDark ? '#2D1B0E' : '#FFF8E1',
      surface: isDark ? '#4A2C17' : '#FFECB3',
      text: isDark ? '#FFFFFF' : '#E65100',
      textSecondary: isDark ? '#FFCC80' : '#F57C00',
    },
    {
      id: 'purple',
      name: 'Royal Purple',
      primary: '#9C27B0',
      background: isDark ? '#1A0E1A' : '#F3E5F5',
      surface: isDark ? '#2D1B2D' : '#E1BEE7',
      text: isDark ? '#FFFFFF' : '#4A148C',
      textSecondary: isDark ? '#CE93D8' : '#7B1FA2',
    },
    {
      id: 'rose',
      name: 'Rose Gold',
      primary: '#E91E63',
      background: isDark ? '#2D0A1A' : '#FCE4EC',
      surface: isDark ? '#4A1729' : '#F8BBD9',
      text: isDark ? '#FFFFFF' : '#880E4F',
      textSecondary: isDark ? '#F48FB1' : '#AD1457',
    },
  ];

  const screenWidth = Dimensions.get('window').width;
  const previewWidth = screenWidth - 32;

  const ThemePreview = ({ themePreset }: { themePreset: ThemePreset }) => (
    <TouchableOpacity
      style={[
        styles.themePreview,
        { backgroundColor: themePreset.background },
        selectedTheme === themePreset.id && { borderColor: themePreset.primary, borderWidth: 3 }
      ]}
      onPress={() => setSelectedTheme(themePreset.id)}
    >
      <View style={[styles.previewHeader, { backgroundColor: themePreset.surface }]}>
        <View style={[styles.previewIcon, { backgroundColor: themePreset.primary }]} />
        <Text style={[styles.previewTitle, { color: themePreset.text }]}>TaskFlow</Text>
      </View>
      
      <View style={styles.previewContent}>
        <View style={[styles.previewCard, { backgroundColor: themePreset.surface }]}>
          <Text style={[styles.previewCardTitle, { color: themePreset.text }]}>
            Sample Task
          </Text>
          <Text style={[styles.previewCardText, { color: themePreset.textSecondary }]}>
            This is how your tasks will look
          </Text>
        </View>
        
        <View style={[styles.previewButton, { backgroundColor: themePreset.primary }]}>
          <Text style={[styles.previewButtonText, { color: themePreset.background }]}>
            Button
          </Text>
        </View>
      </View>
      
      <Text style={[styles.themeName, { color: themePreset.text }]}>
        {themePreset.name}
      </Text>
    </TouchableOpacity>
  );

  const CustomColorPicker = () => (
    <View style={[styles.customSection, { backgroundColor: theme.surface }]}>
      <Text style={[styles.customTitle, { color: theme.text }]}>Custom Colors</Text>
      <View style={styles.colorRow}>
        <Text style={[styles.colorLabel, { color: theme.text }]}>Primary Color</Text>
        <View style={styles.colorOptions}>
          {['#4A90E2', '#FF6B6B', '#4ECDC4', '#FFD93D', '#96CEB4', '#DDA0DD'].map((color) => (
            <TouchableOpacity
              key={color}
              style={[styles.colorOption, { backgroundColor: color }]}
            />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Color & Theme Picker</Text>
      
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Choose a theme that matches your style
      </Text>

      <View style={styles.themesGrid}>
        {themePresets.map((themePreset) => (
          <ThemePreview key={themePreset.id} themePreset={themePreset} />
        ))}
      </View>

      <CustomColorPicker />

      <TouchableOpacity
        style={[styles.applyBtn, { backgroundColor: theme.primary }]}
        onPress={() => console.log('Apply theme:', selectedTheme)}
      >
        <Text style={[styles.applyBtnText, { color: theme.background }]}>
          Apply Theme
        </Text>
      </TouchableOpacity>

      <View style={[styles.info, { backgroundColor: theme.surface }]}>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          💡 Themes are applied instantly. You can always change them later in settings.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 24 },
  themesGrid: { gap: 16, marginBottom: 24 },
  themePreview: { padding: 16, borderRadius: 12, borderWidth: 2, borderColor: 'transparent' },
  previewHeader: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 6, marginBottom: 12 },
  previewIcon: { width: 20, height: 20, borderRadius: 4, marginRight: 8 },
  previewTitle: { fontSize: 14, fontWeight: '600' },
  previewContent: { marginBottom: 12 },
  previewCard: { padding: 12, borderRadius: 6, marginBottom: 8 },
  previewCardTitle: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  previewCardText: { fontSize: 12 },
  previewButton: { padding: 8, borderRadius: 6, alignItems: 'center' },
  previewButtonText: { fontSize: 12, fontWeight: '600' },
  themeName: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  customSection: { padding: 16, borderRadius: 8, marginBottom: 24 },
  customTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  colorRow: { marginBottom: 12 },
  colorLabel: { fontSize: 16, marginBottom: 8 },
  colorOptions: { flexDirection: 'row', gap: 8 },
  colorOption: { width: 32, height: 32, borderRadius: 16 },
  applyBtn: { padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  applyBtnText: { fontSize: 16, fontWeight: '600' },
  info: { padding: 16, borderRadius: 8, marginBottom: 20 },
  infoText: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
});