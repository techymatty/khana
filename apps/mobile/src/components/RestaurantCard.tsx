import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { HalalBadge } from './HalalBadge';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{
          uri: restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <HalalBadge verified={restaurant.halalVerified} size="sm" />
        </View>

        {restaurant.description && (
          <Text style={styles.description} numberOfLines={2}>
            {restaurant.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={COLORS.star} />
            <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({restaurant.totalReviews})</Text>
          </View>

          {restaurant.distance !== null && restaurant.distance !== undefined && (
            <View style={styles.distanceRow}>
              <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.distance}>{restaurant.distance} km</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.divider,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  reviews: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  distance: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
