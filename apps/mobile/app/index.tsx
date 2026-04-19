import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../src/store/authStore';
import { COLORS } from '../src/constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="restaurant" size={48} color="#fff" />
        </View>
        <Text style={styles.title}>UmmahEats</Text>
      </Animated.View>

      <Animated.View style={[styles.subtitleContainer, { opacity: subtitleAnim }]}>
        <View style={styles.halalLine}>
          <Ionicons name="shield-checkmark" size={16} color="#fff" />
          <Text style={styles.subtitle}>100% Halal Verified</Text>
        </View>
        <Text style={styles.tagline}>Trusted food, delivered fresh</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  halalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
});
