import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const THEME_COLORS = [
  '#4A90E2', '#50C878', '#FF6B6B', '#FFD93D', '#9B59B6', '#FF8C00',
  '#20B2AA', '#FF69B4', '#32CD32', '#FF4500', '#8A2BE2', '#DC143C'
];

const FONT_FAMILIES = ['System', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman'];

export const ThemeSettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme, toggleTheme, setThemeColor, fontSize, setFontSize, fontFamily, setFontFamily } = useTheme();

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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
            <Text style={{ fontSize: 18, color: theme.text }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>Theme Settings</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Dark/Light Mode */}
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>Dark Mode</Text>
              <Text style={{ fontSize: 14, color: theme.textSecondary, marginTop: 2 }}>
                Switch between light and dark themes
              </Text>
            </View>
            <Switch
              value={theme.mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
        </View>

        {/* Theme Colors */}
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
            Primary Color
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {THEME_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                onPress={() => setThemeColor(color)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: color,
                  borderWidth: theme.primary === color ? 3 : 0,
                  borderColor: theme.text,
                }}
              />
            ))}
          </View>
        </View>

        {/* Font Size */}
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
            Font Size: {fontSize}px
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity
              onPress={() => setFontSize(Math.max(12, fontSize - 2))}
              style={{
                backgroundColor: theme.primary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>A-</Text>
            </TouchableOpacity>
            <Text style={{ flex: 1, textAlign: 'center', fontSize, color: theme.text }}>
              Sample Text
            </Text>
            <TouchableOpacity
              onPress={() => setFontSize(Math.min(24, fontSize + 2))}
              style={{
                backgroundColor: theme.primary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Font Family */}
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
            Font Family
          </Text>
          {FONT_FAMILIES.map(family => (
            <TouchableOpacity
              key={family}
              onPress={() => setFontFamily(family)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: fontFamily === family ? theme.primary + '20' : 'transparent',
                marginBottom: 4,
              }}
            >
              <Text style={{
                fontSize: 16,
                color: fontFamily === family ? theme.primary : theme.text,
                fontFamily: family === 'System' ? undefined : family,
              }}>
                {family}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};