import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RADIUS } from '../constants/theme';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../constants/api';

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const color = ORDER_STATUS_COLORS[status] || '#6B7280';
  const label = ORDER_STATUS_LABELS[status] || status;

  return (
    <View style={[styles.badge, { backgroundColor: color + '18' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
