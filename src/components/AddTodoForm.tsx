import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';

interface AddTodoFormProps {
  onAdd: (title: string) => void;
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const scaleValue = new Animated.Value(1);

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  const handleQuickAdd = () => {
    navigation.navigate('NewTask' as never);
  };

  return (
    <View style={styles.container(theme)}>
      <View style={[styles.inputContainer(theme), isFocused && styles.inputFocused(theme)]}>
        <Text style={styles.inputIcon}>✨</Text>
        <TextInput
          style={styles.input(theme)}
          placeholder="What needs to be done?"
          placeholderTextColor={theme.colors.textMuted}
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleSubmit}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="done"
          accessibilityLabel="Add new task input"
        />
      </View>
      
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity
          style={styles.button(theme)}
          onPress={handleQuickAdd}
          accessibilityRole="button"
          accessibilityLabel="Add new task"
        >
          <Text style={styles.buttonIcon}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: (theme: any) => ({
    flexDirection: 'row',
    padding: 20,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  }),
  inputContainer: (theme: any) => ({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  }),
  inputFocused: (theme: any) => ({
    borderColor: theme.colors.borderFocus,
  }),
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  input: (theme: any) => ({
    flex: 1,
    height: 52,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  }),
  button: (theme: any) => ({
    width: 52,
    height: 52,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  }),
  buttonDisabled: (theme: any) => ({
    backgroundColor: theme.colors.textMuted,
    shadowOpacity: 0,
  }),
  buttonIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
});