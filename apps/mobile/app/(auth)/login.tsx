import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, Animated, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../../src/constants/theme';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { authService } from '../../src/services/auth';
import { useAuthStore } from '../../src/store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const result = await authService.sendOtp(phone);
      if (result.success) {
        setStep('otp');
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // In dev mode, auto-fill OTP
        if (result.otp_dev) {
          setOtp(result.otp_dev);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const result = await authService.verifyOtp(phone, otp);
      if (result.success) {
        await setAuth(result.token, result.user);
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="restaurant" size={36} color="#fff" />
            </View>
            <Text style={styles.brand}>UmmahEats</Text>
            <Text style={styles.tagline}>
              Halal food you can trust, delivered to your door
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              {step === 'phone' ? 'Login with Phone' : 'Verify OTP'}
            </Text>
            <Text style={styles.formSubtitle}>
              {step === 'phone'
                ? 'Enter your phone number to receive an OTP'
                : `We sent a 6-digit code to +91 ${phone}`}
            </Text>

            {step === 'phone' ? (
              <>
                <Input
                  label="Phone Number"
                  placeholder="Enter 10-digit number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={(t) => { setPhone(t); setError(''); }}
                  error={error}
                  leftIcon={
                    <Text style={styles.countryCode}>+91</Text>
                  }
                />
                <Button
                  title="Send OTP"
                  onPress={handleSendOtp}
                  loading={loading}
                  fullWidth
                  size="lg"
                />
              </>
            ) : (
              <Animated.View
                style={{
                  opacity: slideAnim,
                  transform: [{
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  }],
                }}
              >
                <Input
                  label="OTP Code"
                  placeholder="Enter 6-digit OTP"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={(t) => { setOtp(t); setError(''); }}
                  error={error}
                  leftIcon={
                    <Ionicons name="key-outline" size={20} color={COLORS.textSecondary} />
                  }
                />
                <Button
                  title="Verify & Login"
                  onPress={handleVerifyOtp}
                  loading={loading}
                  fullWidth
                  size="lg"
                />
                <Button
                  title="Change Number"
                  onPress={() => { setStep('phone'); setOtp(''); setError(''); }}
                  variant="ghost"
                  fullWidth
                  style={{ marginTop: 12 }}
                />
              </Animated.View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Ionicons name="shield-checkmark" size={14} color={COLORS.primary} />
            <Text style={styles.footerText}>All restaurants are halal verified</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  keyboardView: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 24,
    lineHeight: 18,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
