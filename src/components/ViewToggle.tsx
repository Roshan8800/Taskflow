import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

type ViewType = 'list' | 'kanban' | 'calendar' | 'checklist' | 'focus';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const views = [
    { key: 'list', icon: '☰', label: 'List' },
    { key: 'kanban', icon: '📋', label: 'Board' },
    { key: 'calendar', icon: '📅', label: 'Calendar' },
    { key: 'checklist', icon: '✓', label: 'Check' },
    { key: 'focus', icon: '🎯', label: 'Focus' },
  ];

  return (
    <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 8, padding: 2 }}>
      {views.map(view => (
        <TouchableOpacity
          key={view.key}
          onPress={() => onViewChange(view.key as ViewType)}
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 4,
            borderRadius: 6,
            backgroundColor: currentView === view.key ? '#4A90E2' : 'transparent',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, marginBottom: 2 }}>{view.icon}</Text>
          <Text style={{
            fontSize: 10,
            color: currentView === view.key ? 'white' : '#666',
            fontWeight: currentView === view.key ? '600' : 'normal',
          }}>
            {view.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};