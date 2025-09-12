import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Linking } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FeedbackScreen: React.FC = () => {
  const { theme } = useTheme();
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general'>('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const feedbackTypes = [
    { id: 'bug', label: 'Bug Report', icon: '🐛' },
    { id: 'feature', label: 'Feature Request', icon: '💡' },
    { id: 'general', label: 'General Feedback', icon: '💬' }];

  const submitFeedback = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      // Save feedback locally
      const feedback = {
        id: Date.now().toString(),
        type: feedbackType,
        subject: subject.trim(),
        message: message.trim(),
        email: email.trim(),
        timestamp: new Date().toISOString(),
      };

      const existingFeedback = await AsyncStorage.getItem('feedback_history');
      const feedbackHistory = existingFeedback ? JSON.parse(existingFeedback) : [];
      feedbackHistory.push(feedback);
      await AsyncStorage.setItem('feedback_history', JSON.stringify(feedbackHistory));

      // Compose email
      const emailSubject = `TaskFlow ${feedbackTypes.find(t => t.id === feedbackType)?.label}: ${subject}`;
      const emailBody = `
Feedback Type: ${feedbackTypes.find(t => t.id === feedbackType)?.label}
Subject: ${subject}

Message:
${message}

${email ? `Contact Email: ${email}` : ''}

---
Sent from TaskFlow Mobile App
      `.trim();

      const emailUrl = `mailto:roshan8800jp@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      await Linking.openURL(emailUrl);

      // Clear form
      setSubject('');
      setMessage('');
      setEmail('');
      
      Alert.alert('Success', 'Thank you for your feedback! Your email app should open with the feedback ready to send.');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const TypeSelector = () => (
    <View style={styles.typeSelector}>
      {feedbackTypes.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={[
            styles.typeButton,
            { backgroundColor: feedbackType === type.id ? theme.primary : theme.surface }
          ]}
          onPress={() => setFeedbackType(type.id as any)}
        >
          <Text style={styles.typeIcon}>{type.icon}</Text>
          <Text style={[
            styles.typeLabel,
            { color: feedbackType === type.id ? theme.background : theme.text }
          ]}>
            {type.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, { color: '#000000' }]}>Send Feedback</Text>
      
      <Text style={[styles.description, { color: '#000000' }]}>
        Help us improve TaskFlow by sharing your thoughts, reporting bugs, or suggesting new features.
      </Text>

      <View style={styles.section}>
        <Text style={[styles.label, { color: '#000000' }]}>Feedback Type</Text>
        <TypeSelector />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: '#000000' }]}>Subject *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#FFFFFF', color: '#000000' }]}
          placeholder="Brief description of your feedback"
          placeholderTextColor={theme.textSecondary}
          value={subject}
          onChangeText={setSubject}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: '#000000' }]}>Message *</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: '#FFFFFF', color: '#000000' }]}
          placeholder="Please provide detailed information about your feedbacktop"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: '#000000' }]}>Your Email (optional)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#FFFFFF', color: '#000000' }]}
          placeholder="your.email@example.com"
          placeholderTextColor={theme.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={[styles.hint, { color: '#000000' }]}>
          Provide your email if you'd like a response
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: '#FFFFFF' },
          submitting && { opacity: 0.6 }
        ]}
        onPress={submitFeedback}
        disabled={submitting}
      >
        <Text style={[styles.submitButtonText, { color: '#000000' }]}>
          {submitting ? 'SubmittingSend Feedback'}
        </Text>
      </TouchableOpacity>

      <View style={[styles.contactInfo, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.contactTitle, { color: '#000000' }]}>Direct Contact</Text>
        <Text style={[styles.contactText, { color: '#000000' }]}>
          For urgent issues or direct support:
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:roshan8800jp@gmail.com')}>
          <Text style={[styles.contactEmail, { color: '#000000' }]}>
            roshan8800jp@gmail.com
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.tipCard, { backgroundColor: '#E8F5E8' }]}>
        <Text style={[styles.tipTitle, { color: '#2E7D32' }]}>💡 Tip</Text>
        <Text style={[styles.tipText, { color: '#2E7D32' }]}>
          When reporting bugs, please include steps to reproduce the issue and your device information.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeSelector: {
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 120,
  },
  hint: {
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactInfo: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    marginBottom: 8,
  },
  contactEmail: {
    fontSize: 16,
    fontWeight: '500',
  },
  tipCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default FeedbackScreen;