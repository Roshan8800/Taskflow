import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getRealm } from '../database/db';
import { hashPassword } from '../utils/auth';

interface PasswordResetScreenProps {
  onBackToLogin: () => void;
}

export const PasswordResetScreen: React.FC<PasswordResetScreenProps> = ({ onBackToLogin }) => {
  const { theme } = useTheme();
  const [step, setStep] = useState<'email' | 'security' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const realm = await getRealm();
      const foundUser = realm.objects('User').filtered('email == $0', email.trim())[0];
      
      if (!foundUser) {
        Alert.alert('Error', 'No account found with this email');
        setLoading(false);
        return;
      }

      setUser(foundUser);
      
      if (foundUser.securityQuestion) {
        setStep('security');
      } else {
        Alert.alert(
          'No Security Question',
          'This account does not have a security question set up. Please contact support or create a new account.',
          [{ text: 'OK', onPress: onBackToLogin }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to find account');
    }
    setLoading(false);
  };

  const handleSecuritySubmit = () => {
    if (!securityAnswer.trim()) {
      Alert.alert('Error', 'Please enter your security answer');
      return;
    }

    if (securityAnswer.trim().toLowerCase() === user.securityAnswer?.toLowerCase()) {
      setStep('reset');
    } else {
      Alert.alert('Error', 'Incorrect security answer');
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const realm = await getRealm();
      const newPasswordHash = hashPassword(newPassword);
      
      realm.write(() => {
        user.passwordHash = newPasswordHash;
      });

      Alert.alert(
        'Success',
        'Password reset successfully! You can now sign in with your new password.',
        [{ text: 'OK', onPress: onBackToLogin }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password');
    }
    setLoading(false);
  };

  const renderEmailStep = () => (
    <>
      <Text style={styles.stepTitle(theme)}>Reset Password</Text>
      <Text style={styles.stepDescription(theme)}>
        Enter your email address to begin password recovery
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label(theme)}>Email</Text>
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

      <TouchableOpacity 
        style={[styles.submitButton(theme), loading && styles.disabledButton(theme)]} 
        onPress={handleEmailSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Searching...' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderSecurityStep = () => (
    <>
      <Text style={styles.stepTitle(theme)}>Security Question</Text>
      <Text style={styles.stepDescription(theme)}>
        Answer your security question to verify your identity
      </Text>

      <View style={styles.questionBox(theme)}>
        <Text style={styles.questionText(theme)}>{user?.securityQuestion}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label(theme)}>Your Answer</Text>
        <TextInput
          style={styles.input(theme)}
          value={securityAnswer}
          onChangeText={setSecurityAnswer}
          placeholder="Enter your answer"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity 
        style={styles.submitButton(theme)} 
        onPress={handleSecuritySubmit}
      >
        <Text style={styles.submitButtonText}>Verify Answer</Text>
      </TouchableOpacity>
    </>
  );

  const renderResetStep = () => (
    <>
      <Text style={styles.stepTitle(theme)}>New Password</Text>
      <Text style={styles.stepDescription(theme)}>
        Create a new password for your account
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label(theme)}>New Password</Text>
        <TextInput
          style={styles.input(theme)}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password (min 6 characters)"
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label(theme)}>Confirm Password</Text>
        <TextInput
          style={styles.input(theme)}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        style={[styles.submitButton(theme), loading && styles.disabledButton(theme)]} 
        onPress={handlePasswordReset}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container(theme)}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
          <Text style={styles.backIcon(theme)}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {step === 'email' && renderEmailStep()}
        {step === 'security' && renderSecurityStep()}
        {step === 'reset' && renderResetStep()}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={onBackToLogin}>
          <Text style={styles.backToLoginText(theme)}>Back to Sign In</Text>
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
  },
  backIcon: (theme: any) => ({
    fontSize: 24,
    color: theme.colors.text,
  }),
  content: {
    flex: 1,
  },
  stepTitle: (theme: any) => ({
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  }),
  stepDescription: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 30,
    lineHeight: 22,
  }),
  inputGroup: {
    marginBottom: 20,
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
  questionBox: (theme: any) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }),
  questionText: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  }),
  submitButton: (theme: any) => ({
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  }),
  disabledButton: (theme: any) => ({
    opacity: 0.6,
  }),
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  backToLoginText: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
  }),
});