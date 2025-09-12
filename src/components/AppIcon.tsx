import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AppIconProps {
  size?: number;
  showText?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({ size = 80, showText = false }) => {
  const iconSize = size;
  const fontSize = size * 0.4;
  const textSize = size * 0.15;

  return (
    <View style={styles.container}>
      <View style={[
        styles.icon,
        {
          width: iconSize,
          height: iconSize,
          borderRadius: iconSize * 0.25,
        }
      ]}>
        <View style={[styles.checkmark, { 
          width: fontSize * 0.8, 
          height: fontSize * 0.8,
          borderRadius: fontSize * 0.1,
        }]}>
          <Text style={[styles.checkText, { fontSize: fontSize * 0.6 }]}>✓</Text>
        </View>
        <View style={[styles.flow, {
          width: fontSize * 1.2,
          height: fontSize * 0.3,
          borderRadius: fontSize * 0.15,
        }]} />
      </View>
      {showText && (
        <Text style={[styles.appName, { fontSize: textSize }]}>TaskFlow</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  icon: {
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmark: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  flow: {
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
  appName: {
    color: '#4A90E2',
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default AppIcon;