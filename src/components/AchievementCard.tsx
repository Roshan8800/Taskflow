import React from 'react';
import { View, Text } from 'react-native';
import { Achievement } from '../hooks/useAnalytics';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const progressPercentage = (achievement.progress / achievement.target) * 100;

  return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      margin: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      opacity: achievement.unlocked ? 1 : 0.6,
      borderWidth: achievement.unlocked ? 2 : 0,
      borderColor: achievement.unlocked ? '#FFD700' : 'transparent',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 32, marginRight: 12 }}>{achievement.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
            {achievement.title}
          </Text>
          <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
            {achievement.description}
          </Text>
        </View>
        {achievement.unlocked && (
          <View style={{
            backgroundColor: '#FFD700',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#333' }}>UNLOCKED</Text>
          </View>
        )}
      </View>
      
      {!achievement.unlocked && (
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 12, color: '#666' }}>Progress</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {achievement.progress}/{achievement.target}
            </Text>
          </View>
          <View style={{ height: 4, backgroundColor: '#f0f0f0', borderRadius: 2 }}>
            <View style={{
              height: 4,
              backgroundColor: '#4A90E2',
              borderRadius: 2,
              width: `${progressPercentage}%`,
            }} />
          </View>
        </View>
      )}
    </View>
  );
};