import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  quantity?: number;
  onAdd: () => void;
  onRemove?: () => void;
}

export function MenuItemCard({ item, quantity = 0, onAdd, onRemove }: MenuItemCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <View style={styles.vegIndicator}>
          <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <Text style={styles.price}>₹{item.price}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {quantity > 0 ? (
          <View style={styles.quantityControl}>
            <TouchableOpacity style={styles.qtyBtn} onPress={onRemove} activeOpacity={0.7}>
              <Ionicons name="remove" size={16} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={onAdd} activeOpacity={0.7}>
              <Ionicons name="add" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.7}>
            <Text style={styles.addText}>ADD</Text>
            <Ionicons name="add" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    marginRight: SPACING.md,
  },
  vegIndicator: {
    marginTop: 4,
    marginRight: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  details: { flex: 1 },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  actions: {
    alignItems: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 2,
  },
  addText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  qtyBtn: {
    padding: 6,
    paddingHorizontal: 10,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    minWidth: 20,
    textAlign: 'center',
  },
});
