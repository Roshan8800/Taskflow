import { Animated, Easing } from 'react-native';

export const animations = {
  // Smooth scale animation for button presses
  pressScale: (value: Animated.Value, callback?: () => void) => {
    return Animated.sequence([
      Animated.timing(value, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })]);
  },

  // Fade in animation
  fadeIn: (value: Animated.Value, duration = 600) => {
    return Animated.timing(value, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
  },

  // Slide up animation
  slideUp: (value: Animated.Value, duration = 400, delay = 0) => {
    return Animated.timing(value, {
      toValue: 0,
      duration,
      delay,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    });
  },

  // Spring animation for interactive elements
  spring: (value: Animated.Value, toValue: number) => {
    return Animated.spring(value, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    });
  },
};