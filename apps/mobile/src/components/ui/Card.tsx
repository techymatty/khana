import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export function Card({ children, style, padding = SPACING.lg }: CardProps) {
  return (
    <View style={[styles.card, { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
});
