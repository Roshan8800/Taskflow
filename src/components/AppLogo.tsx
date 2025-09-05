import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AppLogoProps {
  size?: number;
  variant?: 'icon' | 'full' | 'text';
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 80, variant = 'icon' }) => {
  const iconSize = size;
  const fontSize = size * 0.35;

  if (variant === 'text') {
    return (
      <Text style={[styles.textLogo, { fontSize: size * 0.4 }]}>TaskFlow</Text>
    );
  }

  if (variant === 'full') {
    return (
      <View style={styles.fullLogo}>
        <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
          <View style={[styles.checkCircle, { width: fontSize, height: fontSize }]}>
            <Text style={[styles.checkmark, { fontSize: fontSize * 0.6 }]}>✓</Text>
          </View>
          <View style={styles.flowLines}>
            <View style={[styles.line, styles.line1]} />
            <View style={[styles.line, styles.line2]} />
            <View style={[styles.line, styles.line3]} />
          </View>
        </View>
        <Text style={[styles.appTitle, { fontSize: size * 0.25 }]}>TaskFlow</Text>
      </View>
    );
  }

  return (
    <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
      <View style={[styles.checkCircle, { width: fontSize, height: fontSize }]}>
        <Text style={[styles.checkmark, { fontSize: fontSize * 0.6 }]}>✓</Text>
      </View>
      <View style={styles.flowLines}>
        <View style={[styles.line, styles.line1]} />
        <View style={[styles.line, styles.line2]} />
        <View style={[styles.line, styles.line3]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullLogo: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  checkCircle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '25%',
    left: '20%',
  },
  checkmark: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  flowLines: {
    position: 'absolute',
    right: '15%',
    top: '30%',
  },
  line: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginBottom: 4,
  },
  line1: {
    width: 30,
    height: 4,
    opacity: 0.9,
  },
  line2: {
    width: 24,
    height: 4,
    opacity: 0.7,
  },
  line3: {
    width: 28,
    height: 4,
    opacity: 0.8,
  },
  appTitle: {
    color: '#4A90E2',
    fontWeight: 'bold',
    marginTop: 12,
  },
  textLogo: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});