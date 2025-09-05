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
    <View style={styles.container(theme)}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
          <Text style={styles.backIcon(theme)}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title(theme)}>Create Account</Text>
        <Text style={styles.subtitle(theme)}>Join TaskFlow to get organized</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label(theme)}>Email *</Text>
          <TextInput
            style={styles.input(theme)}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label(theme)}>Username *</Text>
          <TextInput
            style={styles.input(theme)}
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label(theme)}>Password *</Text>
          <TextInput
            style={styles.input(theme)}
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password (min 6 characters)"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label(theme)}>Confirm Password *</Text>
          <TextInput
            style={styles.input(theme)}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
          />
        </View>

        <View style={styles.securitySection}>
          <Text style={styles.sectionTitle(theme)}>Security Question (Optional)</Text>
          <Text style={styles.sectionDescription(theme)}>
            For password recovery if you forget your password
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label(theme)}>Security Question</Text>
            <TextInput
              style={styles.input(theme)}
              value={securityQuestion}
              onChangeText={setSecurityQuestion}
              placeholder="e.g., What was your first pet's name?"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label(theme)}>Answer</Text>
            <TextInput
              style={styles.input(theme)}
              value={securityAnswer}
              onChangeText={setSecurityAnswer}
              placeholder="Your answer"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.signUpButton(theme), loading && styles.disabledButton(theme)]} 
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.signUpButtonText}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText(theme)}>Already have an account? </Text>
        <TouchableOpacity onPress={onBackToLogin}>
          <Text style={styles.loginLink(theme)}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: (theme: any) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  }),
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 20,
  },
  backIcon: (theme: any) => ({
    fontSize: 24,
    color: theme.colors.text,
  }),
  title: (theme: any) => ({
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  }),
  subtitle: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.textSecondary,
  }),
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: (theme: any) => ({
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 8,
  }),
  input: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }),
  securitySection: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: (theme: any) => ({
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  }),
  sectionDescription: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  }),
  signUpButton: (theme: any) => ({
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  }),
  disabledButton: (theme: any) => ({
    opacity: 0.6,
  }),
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
  footerText: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.textSecondary,
  }),
  loginLink: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  }),
});