import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 6,
  backgroundColor,
  progressColor,
}) => {
  const { theme } = useTheme();
  const animatedWidth = new Animated.Value(0);
  
  const bgColor = backgroundColor || theme.colors.surfaceSecondary;
  const pgColor = progressColor || theme.colors.primary;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={[styles.container, { height, backgroundColor: bgColor }]}>
      <Animated.View
        style={[
          styles.progress,
          {
            height,
            backgroundColor: pgColor,
            width: animatedWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 8,
  },
});