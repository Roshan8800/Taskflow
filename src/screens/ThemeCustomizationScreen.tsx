import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Slider } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const ThemeCustomizationScreen: React.FC = () => {
  const { theme, isDark, toggleTheme, fontSize, setFontSize } = useTheme();
  const [taskColors, setTaskColors] = useState({
    high: '#FF6B6B',
    medium: '#FFD93D',
    low: '#6BCF7F',
    completed: '#A0A0A0',
  });

  const colorOptions = [
    '#FF6B6B', '#FFD93D', '#6BCF7F', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];

  const ColorPicker = ({ title, currentColor, onColorChange }: {
    title: string;
    currentColor: string;
    onColorChange: (color: string) => void;
  }) => (
    <View style={styles.colorSection}>
      <Text style={[styles.colorTitle, { color: theme.text }]}>{title}</Text>
      <View style={styles.colorGrid}>
        {colorOptions.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              currentColor === color && styles.selectedColor
            ]}
            onPress={() => onColorChange(color)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Theme Mode</Text>
      
      <View style={[styles.row, { backgroundColor: theme.surface }]}>
        <Text style={[styles.rowTitle, { color: theme.text }]}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.border, true: theme.primary }}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Font Size</Text>
      
      <View style={[styles.row, { backgroundColor: theme.surface }]}>
        <Text style={[styles.rowTitle, { color: theme.text }]}>Text Size</Text>
        <View style={styles.sliderContainer}>
          <Text style={[styles.sliderLabel, { color: theme.textSecondary }]}>Small</Text>
          <Slider
            style={styles.slider}
            minimumValue={12}
            maximumValue={20}
            value={fontSize}
            onValueChange={setFontSize}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.border}
            thumbTintColor={theme.primary}
          />
          <Text style={[styles.sliderLabel, { color: theme.textSecondary }]}>Large</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Task Colors</Text>
      
      <ColorPicker
        title="High Priority"
        currentColor={taskColors.high}
        onColorChange={(color) => setTaskColors({ ...taskColors, high: color })}
      />
      
      <ColorPicker
        title="Medium Priority"
        currentColor={taskColors.medium}
        onColorChange={(color) => setTaskColors({ ...taskColors, medium: color })}
      />
      
      <ColorPicker
        title="Low Priority"
        currentColor={taskColors.low}
        onColorChange={(color) => setTaskColors({ ...taskColors, low: color })}
      />
      
      <ColorPicker
        title="Completed Tasks"
        currentColor={taskColors.completed}
        onColorChange={(color) => setTaskColors({ ...taskColors, completed: color })}
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
        onPress={() => console.log('Save theme settings')}
      >
        <Text style={[styles.saveButtonText, { color: theme.background }]}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  slider: {
    flex: 1,
    marginHorizontal: 12,
  },
  sliderLabel: {
    fontSize: 12,
  },
  colorSection: {
    marginBottom: 20,
  },
  colorTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000',
    borderWidth: 3,
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});