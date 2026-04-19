import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../constants/theme';

interface HalalBadgeProps {
  verified: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function HalalBadge({ verified, size = 'md' }: HalalBadgeProps) {
  if (!verified) return null;

  const iconSize = size === 'sm' ? 10 : size === 'md' ? 12 : 16;
  const fontSize = size === 'sm' ? 9 : size === 'md' ? 11 : 13;

  return (
    <View style={[styles.badge, styles[`badge_${size}`]]}>
      <Ionicons name="shield-checkmark" size={iconSize} color="#fff" />
      <Text style={[styles.text, { fontSize }]}>Halal Verified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.halal,
    borderRadius: RADIUS.full,
    gap: 3,
  },
  badge_sm: { paddingHorizontal: 6, paddingVertical: 2 },
  badge_md: { paddingHorizontal: 8, paddingVertical: 3 },
  badge_lg: { paddingHorizontal: 12, paddingVertical: 5 },
  text: {
    color: '#fff',
    fontWeight: '700',
  },
});
