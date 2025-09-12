import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
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
      <Text style={[styles.colorTitle, { color: '#000000' }]}>{title}</Text>
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
    <ScrollView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.sectionTitle, { color: '#000000' }]}>Theme Mode</Text>
      
      <View style={[styles.row, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.rowTitle, { color: '#000000' }]}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.border, true: theme.primary }}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: '#000000' }]}>Font Size</Text>
      
      <View style={[styles.row, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.rowTitle, { color: '#000000' }]}>Text Size</Text>
        <View style={styles.sliderContainer}>
          <Text style={[styles.sliderLabel, { color: '#000000' }]}>Small</Text>
          <View style={styles.fontSizeButtons}>
            {[12, 14, 16, 18, 20].map(size => (
              <TouchableOpacity
                key={size}
                style={[styles.fontSizeButton, { backgroundColor: fontSize === size ? theme.primary : theme.border }]}
                onPress={() => setFontSize(size)}
              >
                <Text style={[styles.fontSizeButtonText, { color: fontSize === size ? theme.background : theme.text }]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.sliderLabel, { color: '#000000' }]}>Large</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: '#000000' }]}>Task Colors</Text>
      
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
        style={[styles.saveButton, { backgroundColor: '#FFFFFF' }]}
        onPress={() => console.log('Save theme settings')}
      >
        <Text style={[styles.saveButtonText, { color: '#000000' }]}>Save Changes</Text>
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
  fontSizeButtons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  fontSizeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeButtonText: {
    fontSize: 12,
    fontWeight: '500',
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

export default ThemeCustomizationScreen;