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
      <Text style={[styles.stepTitle]}>Reset Password</Text>
      <Text style={[styles.stepDescription]}>
        Enter your email address to begin password recovery
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label]}>Email</Text>
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

      <TouchableOpacity 
        style={[styles.submitButton, loading && styles.disabledButton]} 
        onPress={handleEmailSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'SearchingContinue'}
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderSecurityStep = () => (
    <>
      <Text style={[styles.stepTitle]}>Security Question</Text>
      <Text style={[styles.stepDescription]}>
        Answer your security question to verify your identity
      </Text>

      <View style={[styles.questionBox]}>
        <Text style={[styles.questionText]}>{user?.securityQuestion}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label]}>Your Answer</Text>
        <TextInput
          style={[styles.input]}
          value={securityAnswer}
          onChangeText={setSecurityAnswer}
          placeholder="Enter your answer"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity 
        style={[styles.submitButton]} 
        onPress={handleSecuritySubmit}
      >
        <Text style={styles.submitButtonText}>Verify Answer</Text>
      </TouchableOpacity>
    </>
  );

  const renderResetStep = () => (
    <>
      <Text style={[styles.stepTitle]}>New Password</Text>
      <Text style={[styles.stepDescription]}>
        Create a new password for your account
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label]}>New Password</Text>
        <TextInput
          style={[styles.input]}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password (min 6 characters)"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label]}>Confirm Password</Text>
        <TextInput
          style={[styles.input]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, loading && styles.disabledButton]} 
        onPress={handlePasswordReset}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'ResettingReset Password'}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
          <Text style={[styles.backIcon]}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {step === 'email' && renderEmailStep()}
        {step === 'security' && renderSecurityStep()}
        {step === 'reset' && renderResetStep()}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={onBackToLogin}>
          <Text style={[styles.backToLoginText]}>Back to Sign In</Text>
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
  },
  backIcon: {
    fontSize: 24,
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 20,
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
  questionBox: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000000',
  },
  questionText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  backToLoginText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
});

export default PasswordResetScreen;