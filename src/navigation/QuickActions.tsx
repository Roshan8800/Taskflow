import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface QuickActionsProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onAction?: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  currentScreen,
  onNavigate,
  onAction,
}) => {
  const { theme } = useTheme();

  const getQuickActions = (screen: string) => {
    switch (screen) {
      case 'Tasks':
        return [
          { id: 'add', icon: '+', label: 'Add Task' },
          { id: 'search', icon: '🔍', label: 'Search' },
          { id: 'filter', icon: '🔽', label: 'Filter' },
          { id: 'multiselect', icon: '☑️', label: 'Multi-Select' },
        ];
      case 'Projects':
        return [
          { id: 'add', icon: '+', label: 'New Project' },
          { id: 'search', icon: '🔍', label: 'Search' },
          { id: 'archive', icon: '📦', label: 'Archive' },
        ];
      case 'Analytics':
        return [
          { id: 'reports', icon: '📊', label: 'Reports' },
          { id: 'statistics', icon: '📈', label: 'Statistics' },
          { id: 'export', icon: '📤', label: 'Export' },
        ];
      case 'Home':
        return [
          { id: 'focus', icon: '🍅', label: 'Focus Mode' },
          { id: 'checklist', icon: '☑️', label: 'Checklist' },
          { id: 'notes', icon: '📝', label: 'Notes' },
        ];
      default:
        return [];
    }
  };

  const actions = getQuickActions(currentScreen);

  if (actions.length === 0) return null;

  const handleActionPress = (actionId: string) => {
    switch (actionId) {
      case 'search':
        onNavigate('Search');
        break;
      case 'reports':
        onNavigate('Reports');
        break;
      case 'statistics':
        onNavigate('StatisticsBreakdown');
        break;
      case 'archive':
        onNavigate('Archive');
        break;
      case 'focus':
        onNavigate('FocusMode');
        break;
      case 'checklist':
        onNavigate('Checklist');
        break;
      case 'notes':
        onNavigate('Notes');
        break;
      default:
        onAction?.(actionId);
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={[styles.actionButton, { backgroundColor: theme.background }]}
          onPress={() => handleActionPress(action.id)}
        >
          <Text style={styles.actionIcon}>{action.icon}</Text>
          <Text style={[styles.actionLabel, { color: theme.text }]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minHeight: 60,
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});