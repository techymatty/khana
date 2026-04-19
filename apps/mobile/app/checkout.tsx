import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../src/constants/theme';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { useCartStore } from '../src/store/cartStore';
import { ordersService } from '../src/services/orders';
import { paymentsService } from '../src/services/payments';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');
  const [loading, setLoading] = useState(false);

  const total = getTotal() + 5; // + platform fee

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter a delivery address');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const order = await ordersService.create({
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
        })),
        deliveryAddress: address,
        paymentMethod,
      });

      // Handle Razorpay payment
      if (paymentMethod === 'RAZORPAY') {
        try {
          const paymentData = await paymentsService.createOrder(order.id);
          // In a real app with development build, use RazorpayCheckout.open()
          // For now, simulate payment success
          Alert.alert(
            'Razorpay',
            `Payment order created: ${paymentData.razorpayOrderId}\n\nIn production, this opens the Razorpay checkout modal.`,
            [
              {
                text: 'Simulate Success',
                onPress: async () => {
                  clearCart();
                  router.replace(`/tracking/${order.id}`);
                },
              },
            ],
          );
          return;
        } catch (err) {
          Alert.alert('Payment Error', 'Failed to initialize payment. Please try again.');
          return;
        }
      }

      // COD — go directly to tracking
      clearCart();
      router.replace(`/tracking/${order.id}`);
    } catch (err: any) {
      Alert.alert(
        'Order Failed',
        err.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <Input
            placeholder="Enter your full delivery address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            containerStyle={{ marginBottom: 0 }}
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'COD' && styles.paymentSelected,
            ]}
            onPress={() => setPaymentMethod('COD')}
            activeOpacity={0.8}
          >
            <View style={styles.paymentLeft}>
              <Ionicons name="cash-outline" size={22} color={
                paymentMethod === 'COD' ? COLORS.primary : COLORS.textSecondary
              } />
              <View>
                <Text style={styles.paymentLabel}>Cash on Delivery</Text>
                <Text style={styles.paymentSubtext}>Pay when food arrives</Text>
              </View>
            </View>
            <View style={[
              styles.radio,
              paymentMethod === 'COD' && styles.radioSelected,
            ]}>
              {paymentMethod === 'COD' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'RAZORPAY' && styles.paymentSelected,
            ]}
            onPress={() => setPaymentMethod('RAZORPAY')}
            activeOpacity={0.8}
          >
            <View style={styles.paymentLeft}>
              <Ionicons name="card-outline" size={22} color={
                paymentMethod === 'RAZORPAY' ? COLORS.primary : COLORS.textSecondary
              } />
              <View>
                <Text style={styles.paymentLabel}>Pay Online (Razorpay)</Text>
                <Text style={styles.paymentSubtext}>UPI, Cards, Wallets, Net Banking</Text>
              </View>
            </View>
            <View style={[
              styles.radio,
              paymentMethod === 'RAZORPAY' && styles.radioSelected,
            ]}>
              {paymentMethod === 'RAZORPAY' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>

          {items.map((item) => (
            <View key={item.menuItem.id} style={styles.summaryRow}>
              <Text style={styles.summaryItem}>
                {item.quantity}× {item.menuItem.name}
              </Text>
              <Text style={styles.summaryPrice}>
                ₹{item.menuItem.price * item.quantity}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryPrice}>₹{getTotal()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Platform Fee</Text>
            <Text style={styles.summaryPrice}>₹5</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={[styles.summaryPrice, { color: COLORS.primary }]}>FREE</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order */}
      <View style={styles.footer}>
        <Button
          title={`Place Order • ₹${total}`}
          onPress={handlePlaceOrder}
          loading={loading}
          fullWidth
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1, padding: SPACING.xl },
  section: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  paymentSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  paymentSubtext: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: COLORS.primary },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  summaryItem: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  summaryPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
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
  footer: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
});
