import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

interface SignUpScreenProps {
  onBackToLogin: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onBackToLogin }) => {
  const { theme } = useTheme();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const success = await signUp(email.trim(), username.trim(), password);
    setLoading(false);

    if (success) {
      Alert.alert('Success', 'Account created successfully!');
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
          <Text style={[styles.backIcon]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title]}>Create Account</Text>
        <Text style={[styles.subtitle]}>Join TaskFlow to get organized</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label]}>Email *</Text>
          <TextInput
            style={[styles.input]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={theme.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label]}>Username *</Text>
          <TextInput
            style={[styles.input]}
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label]}>Password *</Text>
          <TextInput
            style={[styles.input]}
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password (min 6 characters)"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label]}>Confirm Password *</Text>
          <TextInput
            style={[styles.input]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry
          />
        </View>

        <View style={styles.securitySection}>
          <Text style={[styles.sectionTitle]}>Security Question (Optional)</Text>
          <Text style={[styles.sectionDescription]}>
            For password recovery if you forget your password
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label]}>Security Question</Text>
            <TextInput
              style={[styles.input]}
              value={securityQuestion}
              onChangeText={setSecurityQuestion}
              placeholder="e.g., What was your first pet's name?"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label]}>Answer</Text>
            <TextInput
              style={[styles.input]}
              value={securityAnswer}
              onChangeText={setSecurityAnswer}
              placeholder="Your answer"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.signUpButton, loading && styles.disabledButton]} 
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.signUpButtonText}>
            {loading ? 'Creating AccountCreate Account'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText]}>Already have an account? </Text>
        <TouchableOpacity onPress={onBackToLogin}>
          <Text style={[styles.loginLink]}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 24,
    color: '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
  },
  securitySection: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 16,
    lineHeight: 20,
  },
  signUpButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 16,
    color: '#000000',
  },
  loginLink: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
});

export default SignUpScreen;