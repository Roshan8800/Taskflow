import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: '✅',
    title: 'Organize Your Tasks',
    description: 'Create, manage, and track your tasks with ease. Set priorities and due dates to stay on top of everything.',
  },
  {
    icon: '📊',
    title: 'Track Your Progress',
    description: 'Visualize your productivity with analytics, streaks, and completion rates. See how much you accomplish.',
  },
  {
    icon: '📁',
    title: 'Organize by Projects',
    description: 'Group related tasks into projects. Keep work, personal, and other areas of life organized.',
  },
  {
    icon: '📱',
    title: 'Works Offline',
    description: 'All your data is stored locally. No internet required. Your tasks are always available.',
  }];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
        <Text style={[styles.skipText]}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.slideContainer}>
        <Text style={styles.slideIcon}>{slides[currentSlide].icon}</Text>
        <Text style={[styles.slideTitle]}>{slides[currentSlide].title}</Text>
        <Text style={[styles.slideDescription]}>{slides[currentSlide].description}</Text>
      </View>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentSlide === index && styles.activeDot
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.nextButton]} onPress={nextSlide}>
          <Text style={styles.nextButtonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginTop: 60,
    padding: 12,
  },
  skipText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  slideIcon: {
    fontSize: 80,
    marginBottom: 40,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  slideDescription: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000000',
    width: 24,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;