import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BSON } from 'realm';
import { useTheme } from '../hooks/useTheme';

interface TodoItemProps {
  id: BSON.ObjectId;
  title: string;
  completed: boolean;
  onToggle: (id: BSON.ObjectId) => void;
  onDelete: (id: BSON.ObjectId) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  completed,
  onToggle,
  onDelete,
}) => {
  const { theme } = useTheme();
  const scaleValue = new Animated.Value(1);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, { duration: 100, toValue: 0.95, useNativeDriver: true }),
      Animated.timing(scaleValue, { duration: 100, toValue: 1, useNativeDriver: true }),
    ]).start();
    onToggle(id);
  };

  return (
    <Animated.View style={[styles.container(theme), { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        style={[styles.checkbox(theme), completed && styles.checked(theme)]}
        onPress={handlePress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
        accessibilityLabel={`Mark ${title} as ${completed ? 'incomplete' : 'complete'}`}
      >
        <Animated.Text style={[styles.checkmark, { opacity: completed ? 1 : 0 }]}>
          ✓
        </Animated.Text>
      </TouchableOpacity>
      
      <Text style={[styles.title(theme), completed && styles.completedTitle(theme)]} numberOfLines={2}>
        {title}
      </Text>
      
      <TouchableOpacity
        style={styles.deleteButton(theme)}
        onPress={() => onDelete(id)}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${title}`}
      >
        <Text style={styles.deleteIcon}>🗑</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: (theme: any) => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.surface,
    marginVertical: 6,
    marginHorizontal: 20,
    borderRadius: 16,
    ...theme.shadows.md,
  }),
  checkbox: (theme: any) => ({
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: theme.colors.primary,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  }),
  checked: (theme: any) => ({
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  }),
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  title: (theme: any) => ({
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    lineHeight: 22,
  }),
  completedTitle: (theme: any) => ({
    textDecorationLine: 'line-through',
    color: theme.colors.textMuted,
  }),
  deleteButton: (theme: any) => ({
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
  }),
  deleteIcon: {
    fontSize: 18,
  },
});