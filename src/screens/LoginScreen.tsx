import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

interface LoginScreenProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onForgotPassword, onSignUp }) => {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateFields = () => {
    const newErrors = { email: '', password: '' };
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;
    
    setLoading(true);
    try {
      const success = await signIn(email.trim(), password);
      if (!success) {
        setErrors({ email: 'Invalid credentials', password: 'Please check your login details' });
      }
    } catch (error) {
      setErrors({ email: 'Login failed', password: 'Please try again' });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.trim() && password.trim() && !errors.email && !errors.password;

  return (
    <View style={styles.container(theme)}>
      <View style={styles.header}>
        <Text style={styles.logo}>📱</Text>
        <Text style={styles.title(theme)}>Welcome Back</Text>
        <Text style={styles.subtitle(theme)}>Sign in to continue to TaskFlow</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label(theme)}>Email</Text>
          <TextInput
            style={styles.input(theme)}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={theme.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label(theme)}>Password</Text>
          <TextInput
            style={styles.input(theme)}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        <TouchableOpacity onPress={onForgotPassword}>
          <Text style={styles.forgotPassword(theme)}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.loginButton(theme), 
            (loading || !isFormValid) && styles.disabledButton(theme)
          ]} 
          onPress={handleLogin}
          disabled={loading || !isFormValid}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText(theme)}>Don't have an account? </Text>
        <TouchableOpacity onPress={onSignUp}>
          <Text style={styles.signUpLink(theme)}>Sign Up</Text>
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
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: (theme: any) => ({
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  }),
  subtitle: (theme: any) => ({
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  }),
  form: {
    flex: 1,
  },
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
  forgotPassword: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.primary,
    textAlign: 'right',
    marginBottom: 30,
    fontWeight: '500',
  }),
  loginButton: (theme: any) => ({
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  }),
  disabledButton: (theme: any) => ({
    opacity: 0.6,
  }),
  loginButtonText: {
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
  signUpLink: (theme: any) => ({
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
  }),
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
});