import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, ActivityIndicator,
  TouchableOpacity, SectionList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { HalalBadge } from '../../src/components/HalalBadge';
import { MenuItemCard } from '../../src/components/MenuItemCard';
import { restaurantsService } from '../../src/services/restaurants';
import { useCartStore } from '../../src/store/cartStore';
import { Restaurant, MenuItem } from '../../src/types';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { items: cartItems, addItem, removeItem, updateQuantity, getItemCount, getTotal } = useCartStore();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const data = await restaurantsService.getById(id!);
      setRestaurant(data);
    } catch (err) {
      console.error('Failed to fetch restaurant:', err);
    } finally {
      setLoading(false);
    }
  };

  const getItemQuantity = (menuItemId: string) => {
    const item = cartItems.find((i) => i.menuItem.id === menuItemId);
    return item?.quantity || 0;
  };

  const handleAddItem = (menuItem: MenuItem) => {
    addItem(menuItem, restaurant.id, restaurant.name);
  };

  const handleRemoveItem = (menuItemId: string) => {
    const item = cartItems.find((i) => i.menuItem.id === menuItemId);
    if (item && item.quantity > 1) {
      updateQuantity(menuItemId, item.quantity - 1);
    } else {
      removeItem(menuItemId);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Restaurant not found</Text>
      </View>
    );
  }

  // Build sections from menuByCategory
  const sections = Object.entries(restaurant.menuByCategory || {}).map(
    ([category, items]) => ({
      title: category,
      data: items as MenuItem[],
    }),
  );

  const cartCount = getItemCount();

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Hero Image */}
            <Image
              source={{
                uri: restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
              }}
              style={styles.heroImage}
            />

            {/* Restaurant Info */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.name}>{restaurant.name}</Text>
                <HalalBadge verified={restaurant.halalVerified} size="md" />
              </View>

              {restaurant.description && (
                <Text style={styles.description}>{restaurant.description}</Text>
              )}

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="star" size={16} color={COLORS.star} />
                  <Text style={styles.metaText}>
                    {restaurant.rating.toFixed(1)} ({restaurant.totalReviews} reviews)
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {restaurant.address}
                  </Text>
                </View>
              </View>
            </View>

            {/* Menu Title */}
            <Text style={styles.menuTitle}>Menu</Text>
          </>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.menuItemWrapper}>
            <MenuItemCard
              item={item}
              quantity={getItemQuantity(item.id)}
              onAdd={() => handleAddItem(item)}
              onRemove={() => handleRemoveItem(item.id)}
            />
          </View>
        )}
        ListFooterComponent={
          restaurant.reviews?.length > 0 ? (
            <View style={styles.reviewsSection}>
              <Text style={styles.reviewsTitle}>Reviews</Text>
              {restaurant.reviews.slice(0, 5).map((review: any) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewUser}>
                      {review.user?.name || 'Anonymous'}
                    </Text>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={10} color="#fff" />
                      <Text style={styles.ratingText}>{review.rating}</Text>
                    </View>
                  </View>
                  {review.comment && (
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={{ height: 100 }} />
          )
        }
      />

      {/* Floating Cart Bar */}
      {cartCount > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          onPress={() => router.push('/cart')}
          activeOpacity={0.9}
        >
          <View style={styles.cartLeft}>
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>{cartCount}</Text>
            </View>
            <Text style={styles.cartLabel}>View Cart</Text>
          </View>
          <Text style={styles.cartTotal}>₹{getTotal()}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, color: COLORS.textSecondary },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: COLORS.divider,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    margin: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: -20,
    ...SHADOWS.medium,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  metaRow: { gap: 8 },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  sectionHeader: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItemWrapper: {
    paddingHorizontal: SPACING.xl,
  },
  reviewsSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: 100,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  reviewComment: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  cartBar: {
    position: 'absolute',
    bottom: 24,
    left: SPACING.xl,
    right: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.large,
  },
  cartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cartCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  cartLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  cartTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});
