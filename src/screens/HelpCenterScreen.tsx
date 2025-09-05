import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const HelpCenterScreen: React.FC = () => {
  const { theme } = useTheme();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I create a new task?',
      answer: 'Tap the "+" button on the Tasks screen, enter your task details, set priority and due date, then tap "Save".'
    },
    {
      id: '2',
      question: 'How do I organize tasks into projects?',
      answer: 'Go to Projects screen, create a new project, then when creating tasks, select the project from the dropdown.'
    },
    {
      id: '3',
      question: 'Can I use TaskFlow offline?',
      answer: 'Yes! TaskFlow works completely offline. All your data is stored locally on your device.'
    },
    {
      id: '4',
      question: 'How do I backup my data?',
      answer: 'Go to Settings > Export/Import and choose "Export as JSON" to create a complete backup of your data.'
    },
    {
      id: '5',
      question: 'How do subtasks work?',
      answer: 'Open any task and tap "Add Subtask" to break it down into smaller steps. Track progress as you complete each subtask.'
    },
    {
      id: '6',
      question: 'What are the different priority levels?',
      answer: 'High (red) for urgent tasks, Medium (yellow) for important tasks, Low (green) for less critical tasks.'
    }
  ];

  const guides = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of TaskFlow',
      steps: [
        'Create your first task',
        'Set up projects',
        'Organize with labels',
        'Track your progress'
      ]
    },
    {
      title: 'Productivity Tips',
      description: 'Maximize your efficiency',
      steps: [
        'Use the Kanban view for visual workflow',
        'Set realistic due dates',
        'Break large tasks into subtasks',
        'Review your daily summary'
      ]
    }
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const contactSupport = () => {
    Linking.openURL('mailto:roshan8800jp@gmail.com?subject=TaskFlow Support Request');
  };

  const FAQItem = ({ item }: { item: FAQItem }) => (
    <View style={[styles.faqItem, { backgroundColor: theme.surface }]}>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={() => toggleFAQ(item.id)}
      >
        <Text style={[styles.faqQuestion, { color: theme.text }]}>{item.question}</Text>
        <Text style={[styles.faqToggle, { color: theme.primary }]}>
          {expandedFAQ === item.id ? '−' : '+'}
        </Text>
      </TouchableOpacity>
      {expandedFAQ === item.id && (
        <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>
          {item.answer}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Help Center</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Start Guides</Text>
        
        {guides.map((guide, index) => (
          <View key={index} style={[styles.guideCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.guideTitle, { color: theme.text }]}>{guide.title}</Text>
            <Text style={[styles.guideDescription, { color: theme.textSecondary }]}>
              {guide.description}
            </Text>
            <View style={styles.stepsList}>
              {guide.steps.map((step, stepIndex) => (
                <Text key={stepIndex} style={[styles.step, { color: theme.textSecondary }]}>
                  {stepIndex + 1}. {step}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Frequently Asked Questions</Text>
        
        {faqs.map((faq) => (
          <FAQItem key={faq.id} item={faq} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Need More Help?</Text>
        
        <TouchableOpacity
          style={[styles.contactCard, { backgroundColor: theme.primary }]}
          onPress={contactSupport}
        >
          <Text style={[styles.contactTitle, { color: theme.background }]}>Contact Support</Text>
          <Text style={[styles.contactDescription, { color: theme.background }]}>
            Get help from our support team
          </Text>
          <Text style={[styles.contactEmail, { color: theme.background }]}>
            roshan8800jp@gmail.com
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.tipCard, { backgroundColor: theme.surface }]}>
        <Text style={[styles.tipTitle, { color: theme.text }]}>💡 Pro Tip</Text>
        <Text style={[styles.tipText, { color: theme.textSecondary }]}>
          Use the Memory Bank feature to store important notes, meeting minutes, and ideas alongside your tasks!
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  guideCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  guideDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  stepsList: {
    gap: 6,
  },
  step: {
    fontSize: 14,
    lineHeight: 20,
  },
  faqItem: {
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  faqToggle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    fontSize: 14,
    lineHeight: 20,
  },
  contactCard: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  contactEmail: {
    fontSize: 14,
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