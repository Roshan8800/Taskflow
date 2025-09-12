import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { useTaskManager } from '../hooks/useTaskManager';
import { useTheme } from '../hooks/useTheme';

type Step = 'onboarding' | 'signup' | 'theme' | 'tutorial' | 'complete';

interface Props {
  onComplete: () => void;
}

export const FirstTimeUserWorkflow: React.FC<Props> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<Step>('onboarding');
  const { addTask } = useTaskManager();

  const createSampleTasks = async () => {
    const sampleTasks = [
      { title: 'Welcome to TaskFlow!', description: 'Complete this task to get started', priority: 'high' as const },
      { title: 'Set up your first projectId', description: 'Organize your tasks with projects', priority: 'medium' as const },
      { title: 'Try the calendar view', description: 'See your tasks in calendar format', priority: 'low' as const }
    ];

    for (const task of sampleTasks) {
      await addTask(task);
    }
  };

  const completeWorkflow = async () => {
    await AsyncStorage.setItem('firstTimeComplete', 'true');
    await createSampleTasks();
    onComplete();
  };

  const nextStep = () => {
    switch (currentStep) {
      case 'onboarding': setCurrentStep('signup'); break;
      case 'signup': setCurrentStep('theme'); break;
      case 'theme': setCurrentStep('tutorial'); break;
      case 'tutorial': completeWorkflow(); break;
    }
  };

  switch (currentStep) {
    case 'onboarding': return <OnboardingScreen onComplete={nextStep} />;
    case 'signup': return <SignUpScreen onComplete={nextStep} />;
    case 'theme': return <ThemePickerScreen onComplete={nextStep} />;
    case 'tutorial': return <TutorialScreen onComplete={nextStep} />;
    default: return null;
  }
};

const ThemePickerScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { theme, setThemeColor } = useTheme();
  const colors = ['#4A90E2', '#50C878', '#FF6B6B', '#FFD93D'];

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, { color: '#000000' }]}>Choose Your Theme</Text>
      <View style={styles.colorGrid}>
        {colors.map(color => (
          <TouchableOpacity
            key={color}
            style={[styles.colorOption, { backgroundColor: color }]}
            onPress={() => setThemeColor(color)}
          />
        ))}
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#FFFFFF' }]} onPress={onComplete}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const TutorialScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, { color: '#000000' }]}>Quick Tutorial</Text>
      <Text style={[styles.text, { color: '#000000' }]}>
        • Tap + to add tasks{'\n'}• Swipe to complete or delete{'\n'}• Use projects to organize{'\n'}• Set reminders for important tasks
      </Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#FFFFFF' }]} onPress={onComplete}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  text: { fontSize: 16, lineHeight: 24, marginBottom: 30 },
  colorGrid: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 30 },
  colorOption: { width: 60, height: 60, borderRadius: 30 },
  button: { padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' }
});

export default FirstTimeUserWorkflow;