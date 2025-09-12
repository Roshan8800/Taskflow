import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export const AppLockScreen: React.FC = () => {
  const [pin, setPin] = useState('');
  const [showBiometric, setShowBiometric] = useState(true);
  const { authenticateWithPIN, authenticateWithBiometric, pinAttempts, cooldownUntil } = useAuth();
  const { theme } = useTheme();
  
  const isInCooldown = cooldownUntil && new Date() < cooldownUntil;
  const remainingMinutes = isInCooldown ? Math.ceil((cooldownUntil!.getTime() - Date.now()) / 60000) : 0;

  const handlePinPress = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length === 4) {
      const success = await authenticateWithPIN(pin);
      if (!success) {
        Alert.alert('Error', 'Invalid PIN');
        setPin('');
      }
    }
  };

  const handleBiometric = async () => {
    const success = await authenticateWithBiometric();
    if (!success) {
      // Biometric failed, show PIN input
      setShowBiometric(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      {isInCooldown ? (
        <View style={styles.cooldownContainer}>
          <Text style={[styles.title, { color: '#000000' }]}>Too Many Attempts</Text>
          <Text style={[styles.cooldownText, { color: '#000000' }]}>
            Try again in {remainingMinutes} minutes
          </Text>
        </View>
      ) : (
        <>
          <Text style={[styles.title, { color: '#000000' }]}>Enter PIN</Text>
          {pinAttempts > 0 && (
            <Text style={[styles.attemptsText, { color: '#000000' }]}>
              {5 - pinAttempts} attempts remaining
            </Text>
          )}
      
      <View style={styles.pinDisplay}>
        {[0, 1, 2, 3].map(i => (
          <View
            key={i}
            style={[
              styles.pinDot,
              { borderColor: '#CCCCCC' },
              pin.length > i && { backgroundColor: '#FFFFFF' }
            ]}
          />
        ))}
      </View>

      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <TouchableOpacity
            key={num}
            style={[styles.key, { borderColor: '#CCCCCC' }]}
            onPress={() => handlePinPress(num.toString())}
          >
            <Text style={[styles.keyText, { color: '#000000' }]}>{num}</Text>
          </TouchableOpacity>
        ))}
        
        {showBiometric && (
          <TouchableOpacity
            style={[styles.key, { borderColor: '#CCCCCC' }]}
            onPress={handleBiometric}
          >
            <Text style={[styles.keyText, { color: '#000000' }]}>👆</Text>
          </TouchableOpacity>
        )}
        
        {!showBiometric && (
          <TouchableOpacity
            style={[styles.key, { borderColor: '#CCCCCC' }]}
            onPress={() => setPin('')}
          >
            <Text style={[styles.keyText, { color: '#000000' }]}>⌫</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.key, { borderColor: '#CCCCCC' }]}
          onPress={() => handlePinPress('0')}
        >
          <Text style={[styles.keyText, { color: '#000000' }]}>0</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.key, { borderColor: '#CCCCCC' }]}
          onPress={() => setPin(pin.slice(0, -1))}
        >
          <Text style={[styles.keyText, { color: '#000000' }]}>⌫</Text>
        </TouchableOpacity>
      </View>

          {pin.length === 4 && !isInCooldown && (
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: '#FFFFFF' }]}
              onPress={handlePinSubmit}
            >
              <Text style={styles.submitText}>Unlock</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
  pinDisplay: { flexDirection: 'row', marginBottom: 40 },
  pinDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, marginHorizontal: 10 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 240, justifyContent: 'space-between' },
  key: { width: 70, height: 70, borderRadius: 35, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  keyText: { fontSize: 24, fontWeight: 'bold' },
  submitButton: { marginTop: 20, paddingHorizontal: 40, paddingVertical: 12, borderRadius: 8 },
  submitText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cooldownContainer: { alignItems: 'center', marginBottom: 40 },
  cooldownText: { fontSize: 16, textAlign: 'center', marginTop: 8 },
  attemptsText: { fontSize: 14, textAlign: 'center', marginBottom: 20 }
});

export default AppLockScreen;