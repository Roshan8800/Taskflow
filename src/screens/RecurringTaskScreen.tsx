import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const RecurringTaskScreen: React.FC = () => {
  const { theme } = useTheme();
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [enabled, setEnabled] = useState(true);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, { color: '#000000' }]}>Recurring Task Settings</Text>

      <View style={[styles.section, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.sectionTitle, { color: '#000000' }]}>Frequency</Text>
        <View style={styles.frequencyButtons}>
          {['daily', 'weekly', 'monthly'].map((freq) => (
            <TouchableOpacity
              key={freq}
              style={[
                styles.frequencyBtn,
                { backgroundColor: frequency === freq ? theme.primary : theme.border }
              ]}
              onPress={() => setFrequency(freq as any)}
            >
              <Text style={[
                styles.frequencyText,
                { color: frequency === freq ? theme.background : theme.text }
              ]}>
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {frequency === 'weekly' && (
        <View style={[styles.section, { backgroundColor: '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: '#000000' }]}>Days of Week</Text>
          <View style={styles.daysGrid}>
            {weekDays.map((day, index) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayBtn,
                  { 
                    backgroundColor: selectedDays.includes(index) ? theme.primary : theme.border,
                    borderColor: '#CCCCCC' 
                  }
                ]}
                onPress={() => toggleDay(index)}
              >
                <Text style={[
                  styles.dayText,
                  { color: selectedDays.includes(index) ? theme.background : theme.text }
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={[styles.section, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.row}>
          <Text style={[styles.sectionTitle, { color: '#000000' }]}>Enable Recurring</Text>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: theme.border, true: theme.primary }}
          />
        </View>
      </View>

      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.saveBtnText, { color: '#000000' }]}>Save Recurring Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { padding: 16, borderRadius: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  frequencyButtons: { flexDirection: 'row', gap: 8 },
  frequencyBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  frequencyText: { fontSize: 14, fontWeight: '500' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  dayText: { fontSize: 12, fontWeight: '500' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  saveBtn: { padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  saveBtnText: { fontSize: 16, fontWeight: '600' },
});

export default RecurringTaskScreen;