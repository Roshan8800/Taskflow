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
      Animated.timing(scaleValue, { duration: 100, toValue: 1, useNativeDriver: true })]).start();
    onToggle(id);
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        style={[styles.checkbox, completed && styles.checked]}
        onPress={handlePress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
        accessibilityLabel={`Mark ${title} as ${completed ? 'incomplete' : 'complete'}`}
      >
        <Animated.Text style={[styles.checkmark, { opacity: completed ? 1 : 0 }]}>
          ✓
        </Animated.Text>
      </TouchableOpacity>
      
      <Text style={[styles.title, completed && styles.completedTitle]} numberOfLines={2}>
        {title}
      </Text>
      
      <TouchableOpacity
        style={[styles.deleteButton]}
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
    marginVertical: 6,
    marginHorizontal: 20,
    borderRadius: 16,
    ,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#000000',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checked: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 22,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#000000',
  },
  deleteButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 12,
  },
  deleteIcon: {
    fontSize: 18,
  },
});

export default TodoItem;