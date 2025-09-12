import React from 'react';
import { View, Text } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, color = '#4A90E2', icon }) => {
  return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      margin: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: color,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        {icon && <Text style={{ fontSize: 20, marginRight: 8 }}>{icon}</Text>}
        <Text style={{ fontSize: 14, color: '#666', flex: 1 }}>{title}</Text>
      </View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>
        {value}
      </Text>
      {subtitle && (
        <Text style={{ fontSize: 12, color: '#999' }}>{subtitle}</Text>
      )}
    </View>
  );
};

export default StatsCard;