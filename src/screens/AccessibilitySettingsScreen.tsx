import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Slider } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const AccessibilitySettingsScreen: React.FC = () => {
  const { theme, fontSize, setFontSize } = useTheme();
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largeButtons, setLargeButtons] = useState(false);
  const [voiceOver, setVoiceOver] = useState(false);

  const fontSizes = [
    { label: 'Small', value: 12 },
    { label: 'Normal', value: 16 },
    { label: 'Large', value: 20 },
    { label: 'Extra Large', value: 24 },
  ];

  const contrastLevels = [
    { label: 'Normal', value: 'normal' },
    { label: 'High', value: 'high' },
    { label: 'Maximum', value: 'maximum' },
  ];

  const SettingRow = ({ title, description, children }: {
    title: string;
    description?: string;
    children: React.ReactNode;
  }) => (
    <View style={[styles.settingRow, { backgroundColor: theme.surface }]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
        {description && (
          <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
            {description}
          </Text>
        )}
      </View>
      {children}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Accessibility Settings</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Visual</Text>
        
        <SettingRow
          title="Font Size"
          description="Adjust text size for better readability"
        >
          <View style={styles.fontSizeControl}>
            <Text style={[styles.fontSizeLabel, { color: theme.textSecondary }]}>
              {fontSize}px
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={12}
              maximumValue={24}
              value={fontSize}
              onValueChange={setFontSize}
              step={2}
              minimumTrackTintColor={theme.primary}
              maximumTrackTintColor={theme.border}
              thumbTintColor={theme.primary}
            />
          </View>
        </SettingRow>

        <SettingRow
          title="High Contrast"
          description="Increase contrast for better visibility"
        >
          <Switch
            value={highContrast}
            onValueChange={setHighContrast}
            trackColor={{ false: theme.border, true: theme.primary }}
          />
        </SettingRow>

        <SettingRow
          title="Large Touch Targets"
          description="Make buttons and controls larger"
        >
          <Switch
            value={largeButtons}
            onValueChange={setLargeButtons}
            trackColor={{ false: theme.border, true: theme.primary }}
          />
        </SettingRow>

        <SettingRow
          title="Reduce Motion"
          description="Minimize animations and transitions"
        >
          <Switch
            value={reduceMotion}
            onValueChange={setReduceMotion}
            trackColor={{ false: theme.border, true: theme.primary }}
          />
        </SettingRow>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Screen Reader</Text>
        
        <SettingRow
          title="Screen Reader Support"
          description="Enable compatibility with screen readers"
        >
          <Switch
            value={screenReader}
            onValueChange={setScreenReader}
            trackColor={{ false: theme.border, true: theme.primary }}
          />
        </SettingRow>

        <SettingRow
          title="VoiceOver Hints"
          description="Provide additional context for UI elements"
        >
          <Switch
            value={voiceOver}
            onValueChange={setVoiceOver}
            trackColor={{ false: theme.border, true: theme.primary }}
          />
        </SettingRow>
      </View>

      <View style={[styles.previewSection, { backgroundColor: theme.surface }]}>
        <Text style={[styles.previewTitle, { color: theme.text }]}>Preview</Text>
        <View style={[
          styles.previewCard,
          { backgroundColor: theme.background },
          highContrast && { borderWidth: 2, borderColor: theme.text }
        ]}>
          <Text style={[
            styles.previewText,
            { 
              color: theme.text,
              fontSize: fontSize,
              fontWeight: highContrast ? 'bold' : 'normal'
            }
          ]}>
            Sample task text with current settings
          </Text>
          <TouchableOpacity style={[
            styles.previewButton,
            { 
              backgroundColor: theme.primary,
              minHeight: largeButtons ? 48 : 36,
              paddingHorizontal: largeButtons ? 24 : 16
            }
          ]}>
            <Text style={[
              styles.previewButtonText,
              { 
                color: theme.background,
                fontSize: largeButtons ? fontSize + 2 : fontSize
              }
            ]}>
              Sample Button
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.tipsSection, { backgroundColor: theme.surface }]}>
        <Text style={[styles.tipsTitle, { color: theme.text }]}>💡 Accessibility Tips</Text>
        <View style={styles.tipsList}>
          <Text style={[styles.tip, { color: theme.textSecondary }]}>
            • Use voice commands: "Add task" or "Mark complete"
          </Text>
          <Text style={[styles.tip, { color: theme.textSecondary }]}>
            • Swipe gestures work with VoiceOver enabled
          </Text>
          <Text style={[styles.tip, { color: theme.textSecondary }]}>
            • Double-tap to activate buttons and controls
          </Text>
          <Text style={[styles.tip, { color: theme.textSecondary }]}>
            • Use headphones for better audio feedback
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.resetBtn, { backgroundColor: theme.border }]}
        onPress={() => {
          setFontSize(16);
          setHighContrast(false);
          setLargeButtons(false);
          setReduceMotion(false);
          setScreenReader(false);
          setVoiceOver(false);
        }}
      >
        <Text style={[styles.resetBtnText, { color: theme.text }]}>
          Reset to Defaults
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 8, marginBottom: 8 },
  settingInfo: { flex: 1, marginRight: 16 },
  settingTitle: { fontSize: 16, fontWeight: '500', marginBottom: 2 },
  settingDesc: { fontSize: 14, lineHeight: 18 },
  fontSizeControl: { alignItems: 'center', minWidth: 120 },
  fontSizeLabel: { fontSize: 14, marginBottom: 8 },
  slider: { width: 100, height: 40 },
  previewSection: { padding: 16, borderRadius: 8, marginBottom: 16 },
  previewTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  previewCard: { padding: 16, borderRadius: 8 },
  previewText: { marginBottom: 12, lineHeight: 24 },
  previewButton: { paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  previewButtonText: { fontWeight: '600' },
  tipsSection: { padding: 16, borderRadius: 8, marginBottom: 16 },
  tipsTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  tipsList: { gap: 8 },
  tip: { fontSize: 14, lineHeight: 20 },
  resetBtn: { padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  resetBtnText: { fontSize: 16, fontWeight: '500' },
});