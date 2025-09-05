import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, PanGestureHandler, State } from 'react-native';
import { BSON } from 'realm';
import { useTheme } from '../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';

interface SwipeableTodoItemProps {
  id: BSON.ObjectId;
  title: string;
  completed: boolean;
  priority: string;
  status: string;
  onToggle: (id: BSON.ObjectId) => void;
  onDelete: (id: BSON.ObjectId) => void;
  onLongPress: (id: BSON.ObjectId) => void;
}

export const SwipeableTodoItem: React.FC<SwipeableTodoItemProps> = ({
  id,
  title,
  completed,
  priority,
  status,
  onToggle,
  onDelete,
  onLongPress,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const translateX = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      
      if (translationX > 100) {
        // Swipe right - delete
        onDelete(id);
      } else if (translationX < -100) {
        // Swipe left - complete
        onToggle(id);
      }
      
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.success;
      default: return theme.colors.textMuted;
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View style={[styles.container(theme), { transform: [{ translateX }] }]}>
        <TouchableOpacity
          style={styles.content}
          onPress={() => navigation.navigate('TaskDetail' as never, { taskId: id.toString() } as never)}
          onLongPress={() => onLongPress(id)}
          delayLongPress={500}
        >
          <View style={[styles.priorityBar, { backgroundColor: getPriorityColor() }]} />
          
          <TouchableOpacity
            style={[styles.checkbox(theme), completed && styles.checked(theme)]}
            onPress={() => onToggle(id)}
          >
            {completed && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          
          <View style={styles.taskContent}>
            <Text style={[styles.title(theme), completed && styles.completedTitle(theme)]}>
              {title}
            </Text>
            <Text style={styles.status(theme)}>{status.toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
    ...theme.shadows.sm,
  }),
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  priorityBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  checkbox: (theme: any) => ({
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  checked: (theme: any) => ({
    backgroundColor: theme.colors.primary,
  }),
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  taskContent: {
    flex: 1,
  },
  title: (theme: any) => ({
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  }),
  completedTitle: (theme: any) => ({
    textDecorationLine: 'line-through',
    color: theme.colors.textMuted,
  }),
  status: (theme: any) => ({
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  }),
});