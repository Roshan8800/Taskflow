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
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <View style={[
        styles.inputContainer, 
        { backgroundColor: '#FFFFFF', borderColor: '#CCCCCC' },
        isFocused && { borderColor: '#CCCCCC' }
      ]}>
        <Text style={styles.inputIcon}>✨</Text>
        <TextInput
          style={[styles.input, { color: '#000000' }]}
          placeholder="What needs to be done?"
          placeholderTextColor={theme.textSecondary}
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
          style={[styles.button, { backgroundColor: '#FFFFFF' }]}
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
  container: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginRight: 12,
    borderWidth: 2,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
});

export default AddTodoForm;