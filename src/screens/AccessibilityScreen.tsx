import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';

export const AccessibilityScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { accessibility, appSettings, updateAccessibility, updateAppSettings } = useSettings();

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
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>Accessibility</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Visual Accessibility */}
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
            Visual Accessibility
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>High Contrast</Text>
              <Text style={{ fontSize: 14, color: theme.textSecondary, marginTop: 2 }}>
                Increase contrast for better visibility
              </Text>
            </View>
            <Switch
              value={accessibility.highContrast}
              onValueChange={(value) => updateAccessibility({ highContrast: value })}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>Large Text</Text>
              <Text style={{ fontSize: 14, color: theme.textSecondary, marginTop: 2 }}>
                Use larger text throughout the app
              </Text>
            </View>
            <Switch
              value={accessibility.largeText}
              onValueChange={(value) => updateAccessibility({ largeText: value })}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
        </View>

        {/* Screen Reader Support */}
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
            Screen Reader
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>Screen Reader Support</Text>
              <Text style={{ fontSize: 14, color: theme.textSecondary, marginTop: 2 }}>
                Optimize for screen readers and voice assistants
              </Text>
            </View>
            <Switch
              value={accessibility.screenReader}
              onValueChange={(value) => updateAccessibility({ screenReader: value })}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
        </View>

        {/* Haptic Feedback */}
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
            Haptic Feedback
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>Vibration Feedback</Text>
              <Text style={{ fontSize: 14, color: theme.textSecondary, marginTop: 2 }}>
                Feel vibrations for interactions and notifications
              </Text>
            </View>
            <Switch
              value={appSettings.hapticFeedback}
              onValueChange={(value) => updateAppSettings({ hapticFeedback: value })}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>
        </View>

        {/* Accessibility Tips */}
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 12,
          padding: 16,
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 12 }}>
            💡 Accessibility Tips
          </Text>
          <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20, marginBottom: 8 }}>
            • Use voice commands to create tasks quickly
          </Text>
          <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20, marginBottom: 8 }}>
            • Enable high contrast for better text visibility
          </Text>
          <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20, marginBottom: 8 }}>
            • Adjust font size in Theme Settings for comfortable reading
          </Text>
          <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20 }}>
            • Use haptic feedback to feel app interactions
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};