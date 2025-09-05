import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { RepeatRule } from '../utils/repeatLogic';

interface Props {
  value?: RepeatRule;
  onChange: (rule: RepeatRule | undefined) => void;
}

export const RepeatRuleSelector: React.FC<Props> = ({ value, onChange }) => {
  const { theme } = useTheme();
  const [isEnabled, setIsEnabled] = useState(!!value);
  const [rule, setRule] = useState<RepeatRule>(value || {
    type: 'daily',
    interval: 1
  });

  const handleToggle = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    onChange(newEnabled ? rule : undefined);
  };

  const handleRuleChange = (updates: Partial<RepeatRule>) => {
    const newRule = { ...rule, ...updates };
    setRule(newRule);
    if (isEnabled) {
      onChange(newRule);
    }
  };

  const repeatTypes = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'yearly', label: 'Yearly' },
    { key: 'custom', label: 'Custom' }
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.toggle} 
        onPress={handleToggle}
      >
        <Text style={[styles.toggleText, { color: theme.text }]}>
          Repeat Task
        </Text>
        <View style={[
          styles.checkbox, 
          { borderColor: theme.border },
          isEnabled && { backgroundColor: theme.primary }
        ]}>
          {isEnabled && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      {isEnabled && (
        <View style={styles.options}>
          <View style={styles.typeSelector}>
            {repeatTypes.map(type => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.typeButton,
                  { borderColor: theme.border },
                  rule.type === type.key && { backgroundColor: theme.primary }
                ]}
                onPress={() => handleRuleChange({ type: type.key as any })}
              >
                <Text style={[
                  styles.typeText,
                  { color: rule.type === type.key ? 'white' : theme.text }
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.intervalRow}>
            <Text style={[styles.label, { color: theme.text }]}>Every</Text>
            <TextInput
              style={[styles.intervalInput, { 
                borderColor: theme.border, 
                color: theme.text,
                backgroundColor: theme.surface 
              }]}
              value={rule.interval?.toString() || '1'}
              onChangeText={text => handleRuleChange({ interval: parseInt(text) || 1 })}
              keyboardType="numeric"
            />
            <Text style={[styles.label, { color: theme.text }]}>
              {rule.type === 'daily' ? 'day(s)' :
               rule.type === 'weekly' ? 'week(s)' :
               rule.type === 'monthly' ? 'month(s)' :
               rule.type === 'yearly' ? 'year(s)' : 'unit(s)'}
            </Text>
          </View>

          {rule.type === 'custom' && (
            <View style={styles.cronRow}>
              <Text style={[styles.label, { color: theme.text }]}>Cron Rule:</Text>
              <TextInput
                style={[styles.cronInput, { 
                  borderColor: theme.border, 
                  color: theme.text,
                  backgroundColor: theme.surface 
                }]}
                value={rule.cronRule || ''}
                onChangeText={text => handleRuleChange({ cronRule: text })}
                placeholder="0 9 * * 1 (9 AM every Monday)"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  toggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  toggleText: { fontSize: 16, fontWeight: '600' },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  checkmark: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  options: { paddingLeft: 16 },
  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  typeButton: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderRadius: 6 },
  typeText: { fontSize: 14, fontWeight: '500' },
  intervalRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  label: { fontSize: 14 },
  intervalInput: { width: 60, height: 36, borderWidth: 1, borderRadius: 6, textAlign: 'center', fontSize: 14 },
  cronRow: { flexDirection: 'column', gap: 8 },
  cronInput: { height: 36, borderWidth: 1, borderRadius: 6, paddingHorizontal: 12, fontSize: 14 }
});