import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { OrderStatusBadge } from '../../src/components/OrderStatusBadge';
import { ordersService } from '../../src/services/orders';
import { useSocket } from '../../src/hooks/useSocket';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../src/constants/api';
import { Order, OrderStatus } from '../../src/types';

const TRACKING_STEPS: OrderStatus[] = [
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'READY',
  'PICKED_UP',
  'DELIVERED',
];

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { joinOrder, leaveOrder, onOrderUpdate } = useSocket();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder();
      joinOrder(id);

      const cleanup = onOrderUpdate((data) => {
        if (data.orderId === id) {
          setOrder((prev) =>
            prev ? { ...prev, status: data.status, updatedAt: data.updatedAt } : prev,
          );
        }
      });

      return () => {
        leaveOrder(id);
        cleanup?.();
      };
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await ordersService.getById(id!);
      setOrder(data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Order not found</Text>
      </View>
    );
  }

  const currentStepIndex = TRACKING_STEPS.indexOf(order.status as OrderStatus);
  const isCancelled = order.status === 'CANCELLED';
  const isDelivered = order.status === 'DELIVERED';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Status Header */}
      <View style={[styles.statusCard, isDelivered && styles.deliveredCard]}>
        <Ionicons
          name={isDelivered ? 'checkmark-circle' : isCancelled ? 'close-circle' : 'time'}
          size={48}
          color={isDelivered ? COLORS.success : isCancelled ? COLORS.error : COLORS.warning}
        />
        <Text style={styles.statusTitle}>
          {isCancelled
            ? 'Order Cancelled'
            : isDelivered
            ? 'Order Delivered!'
            : ORDER_STATUS_LABELS[order.status] || order.status}
        </Text>
        <Text style={styles.statusSubtext}>
          {isCancelled
            ? 'This order has been cancelled'
            : isDelivered
            ? 'Thank you for ordering with UmmahEats!'
            : 'Your order is being processed'}
        </Text>
        <OrderStatusBadge status={order.status} />
      </View>

      {/* Tracking Steps */}
      {!isCancelled && (
        <View style={styles.stepsCard}>
          <Text style={styles.cardTitle}>Order Progress</Text>
          {TRACKING_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isLast = index === TRACKING_STEPS.length - 1;

            return (
              <View key={step} style={styles.stepRow}>
                <View style={styles.stepIndicator}>
                  <View
                    style={[
                      styles.stepDot,
                      isCompleted && styles.stepDotCompleted,
                      isCurrent && styles.stepDotCurrent,
                    ]}
                  >
                    {isCompleted && (
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    )}
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.stepLine,
                        isCompleted && index < currentStepIndex && styles.stepLineCompleted,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepLabel,
                      isCompleted && styles.stepLabelCompleted,
                      isCurrent && styles.stepLabelCurrent,
                    ]}
                  >
                    {ORDER_STATUS_LABELS[step]}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Order Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Order Details</Text>

        <View style={styles.detailRow}>
          <Ionicons name="restaurant" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>{order.restaurant?.name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>{order.deliveryAddress}</Text>
        </View>

        {order.rider && (
          <View style={styles.detailRow}>
            <Ionicons name="bicycle" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>
              Rider: {order.rider.name} ({order.rider.phone})
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        {order.items?.map((item) => (
          <View key={item.id} style={styles.orderItemRow}>
            <Text style={styles.orderItemText}>
              {item.quantity}× {item.menuItem?.name || 'Item'}
            </Text>
            <Text style={styles.orderItemPrice}>₹{item.price * item.quantity}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{order.total}</Text>
        </View>

        <View style={styles.paymentRow}>
          <Ionicons
            name={order.payment?.method === 'COD' ? 'cash-outline' : 'card-outline'}
            size={14}
            color={COLORS.textSecondary}
          />
          <Text style={styles.paymentText}>
            {order.payment?.method === 'COD' ? 'Cash on Delivery' : 'Paid Online'} •{' '}
            {order.payment?.status}
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statusCard: {
    backgroundColor: COLORS.card,
    margin: SPACING.xl,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  deliveredCard: {
    backgroundColor: COLORS.primaryLight,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  stepsCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  stepRow: {
    flexDirection: 'row',
  },
  stepIndicator: {
    alignItems: 'center',
    width: 24,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotCompleted: {
    backgroundColor: COLORS.primary,
  },
  stepDotCurrent: {
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  stepLine: {
    width: 2,
    height: 28,
    backgroundColor: COLORS.divider,
  },
  stepLineCompleted: {
    backgroundColor: COLORS.primary,
  },
  stepContent: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 20,
  },
  stepLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  stepLabelCompleted: {
    color: COLORS.text,
    fontWeight: '600',
  },
  stepLabelCurrent: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderItemText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  orderItemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.sm,
  },
  paymentText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
