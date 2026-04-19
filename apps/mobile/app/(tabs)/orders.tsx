import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { OrderStatusBadge } from '../../src/components/OrderStatusBadge';
import { ordersService } from '../../src/services/orders';
import { Order } from '../../src/types';

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await ordersService.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchOrders(); }}
              tintColor={COLORS.primary}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => router.push(`/tracking/${item.id}`)}
              activeOpacity={0.9}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.restaurantName}>
                    {item.restaurant?.name || 'Restaurant'}
                  </Text>
                  <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
                </View>
                <OrderStatusBadge status={item.status} />
              </View>

              <View style={styles.orderItems}>
                {item.items?.slice(0, 3).map((oi, idx) => (
                  <Text key={idx} style={styles.itemText}>
                    {oi.quantity}x {oi.menuItem?.name || 'Item'}
                  </Text>
                ))}
                {(item.items?.length || 0) > 3 && (
                  <Text style={styles.moreItems}>
                    +{(item.items?.length || 0) - 3} more items
                  </Text>
                )}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.total}>₹{item.total}</Text>
                <View style={styles.paymentBadge}>
                  <Ionicons
                    name={item.payment?.method === 'COD' ? 'cash-outline' : 'card-outline'}
                    size={12}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.paymentText}>
                    {item.payment?.method || 'COD'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="receipt-outline" size={48} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No orders yet</Text>
              <Text style={styles.emptySubtext}>
                Your order history will appear here
              </Text>
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
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
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
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paymentText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
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
