import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { RestaurantCard } from '../../src/components/RestaurantCard';
import { restaurantsService } from '../../src/services/restaurants';
import { useAuthStore } from '../../src/store/authStore';
import { useCartStore } from '../../src/store/cartStore';
import { Restaurant } from '../../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartStore((s) => s.getItemCount());

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchRestaurants = useCallback(async () => {
    try {
      const data = await restaurantsService.getAll({
        search: search || undefined,
      });
      setRestaurants(data);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRestaurants();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>
            Assalamu Alaikum{user?.name ? `, ${user.name}` : ''} 👋
          </Text>
          <Text style={styles.headerTitle}>What would you like to eat?</Text>
        </View>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => router.push('/cart')}
        >
          <Ionicons name="cart" size={24} color={COLORS.text} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants or cuisines..."
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing={fetchRestaurants}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Halal Banner */}
      <View style={styles.banner}>
        <Ionicons name="shield-checkmark" size={18} color={COLORS.primary} />
        <Text style={styles.bannerText}>
          All restaurants on UmmahEats are halal verified
        </Text>
      </View>

      {/* Restaurant List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() => router.push(`/restaurant/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="restaurant-outline" size={48} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No restaurants found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerLeft: { flex: 1 },
  greeting: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  searchWrapper: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    marginLeft: 8,
    marginRight: 8,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    flex: 1,
  },
  list: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
