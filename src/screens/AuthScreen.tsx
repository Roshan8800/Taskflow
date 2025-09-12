import React, { useState } from 'react';
import { View } from 'react-native';
import { LoginScreen } from './LoginScreen';
import { SignUpScreen } from './SignUpScreen';
import { PasswordResetScreen } from './PasswordResetScreen';

export const AuthScreen: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup' | 'reset'>('login');

  const showLogin = () => setCurrentScreen('login');
  const showSignUp = () => setCurrentScreen('signup');
  const showPasswordReset = () => setCurrentScreen('reset');

  return (
    <View style={{ flex: 1 }}>
      {currentScreen === 'login' && (
        <LoginScreen 
          onForgotPassword={showPasswordReset}
          onSignUp={showSignUp}
        />
      )}
      {currentScreen === 'signup' && (
        <SignUpScreen 
          onBackToLogin={showLogin}
        />
      )}
      {currentScreen === 'reset' && (
        <PasswordResetScreen 
          onBackToLogin={showLogin}
        />
      )}
    </View>
  );
};

export default AuthScreen;