import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const HelpScreen: React.FC = () => {
  const { theme } = useTheme();

  const handleFeedback = () => {
    Alert.alert('Feedback', 'Thank you for your interest in providing feedback!');
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.section]}>
        <Text style={[styles.sectionTitle]}>Help & Feedback</Text>
        
        <View style={styles.helpItem}>
          <Text style={[styles.helpTitle]}>Getting Started</Text>
          <Text style={[styles.helpText]}>
            Create tasks, organize by projects, and track your progress.
          </Text>
        </View>
        
        <View style={styles.helpItem}>
          <Text style={[styles.helpTitle]}>Managing Tasks</Text>
          <Text style={[styles.helpText]}>
            Tap to complete tasks, swipe to delete, or use the calendar view.
          </Text>
        </View>
        
        <TouchableOpacity style={[styles.feedbackButton]} onPress={handleFeedback}>
          <Text style={styles.feedbackIcon}>💬</Text>
          <Text style={[styles.feedbackText]}>Send Feedback</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  helpItem: {
    marginBottom: 20,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  feedbackIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  feedbackText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default HelpScreen;