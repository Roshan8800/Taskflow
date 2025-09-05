import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export const HelpScreen: React.FC = () => {
  const { theme } = useTheme();

  const handleFeedback = () => {
    Alert.alert('Feedback', 'Thank you for your interest in providing feedback!');
  };

  return (
    <View style={styles.container(theme)}>
      <View style={styles.section(theme)}>
        <Text style={styles.sectionTitle(theme)}>Help & Feedback</Text>
        
        <View style={styles.helpItem}>
          <Text style={styles.helpTitle(theme)}>Getting Started</Text>
          <Text style={styles.helpText(theme)}>
            Create tasks, organize by projects, and track your progress.
          </Text>
        </View>
        
        <View style={styles.helpItem}>
          <Text style={styles.helpTitle(theme)}>Managing Tasks</Text>
          <Text style={styles.helpText(theme)}>
            Tap to complete tasks, swipe to delete, or use the calendar view.
          </Text>
        </View>
        
        <TouchableOpacity style={styles.feedbackButton(theme)} onPress={handleFeedback}>
          <Text style={styles.feedbackIcon}>💬</Text>
          <Text style={styles.feedbackText(theme)}>Send Feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: (theme: any) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  }),
  section: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    ...theme.shadows.md,
  }),
  sectionTitle: (theme: any) => ({
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 20,
  }),
  helpItem: {
    marginBottom: 20,
  },
  helpTitle: (theme: any) => ({
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  }),
  helpText: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  }),
  feedbackButton: (theme: any) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  }),
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