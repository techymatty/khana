import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../src/constants/theme';
import { Button } from '../src/components/ui/Button';
import { useCartStore } from '../src/store/cartStore';

export default function CartScreen() {
  const router = useRouter();
  const { items, restaurantName, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={64} color={COLORS.textLight} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>
          Add items from a restaurant to get started
        </Text>
        <Button
          title="Browse Restaurants"
          onPress={() => router.back()}
          variant="primary"
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Restaurant Name */}
        <View style={styles.restaurantHeader}>
          <Ionicons name="restaurant" size={18} color={COLORS.primary} />
          <Text style={styles.restaurantName}>{restaurantName}</Text>
        </View>

        {/* Cart Items */}
        {items.map((item) => (
          <View key={item.menuItem.id} style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.menuItem.name}</Text>
              <Text style={styles.itemPrice}>
                ₹{item.menuItem.price} × {item.quantity} ={' '}
                <Text style={styles.itemTotal}>
                  ₹{item.menuItem.price * item.quantity}
                </Text>
              </Text>
            </View>

            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => {
                  if (item.quantity > 1) {
                    updateQuantity(item.menuItem.id, item.quantity - 1);
                  } else {
                    removeItem(item.menuItem.id);
                  }
                }}
              >
                <Ionicons
                  name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                  size={16}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
              >
                <Ionicons name="add" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Bill Summary */}
        <View style={styles.billCard}>
          <Text style={styles.billTitle}>Bill Summary</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{getTotal()}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={[styles.billValue, { color: COLORS.primary }]}>FREE</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Platform Fee</Text>
            <Text style={styles.billValue}>₹5</Text>
          </View>

          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{getTotal() + 5}</Text>
          </View>
        </View>

        {/* Clear Cart */}
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => {
            Alert.alert('Clear Cart', 'Remove all items?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: clearCart },
            ]);
          }}
        >
          <Ionicons name="trash-outline" size={16} color={COLORS.error} />
          <Text style={styles.clearText}>Clear Cart</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.footer}>
        <Button
          title={`Proceed to Checkout • ₹${getTotal() + 5}`}
          onPress={() => router.push('/checkout')}
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
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  restaurantName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  itemInfo: { flex: 1, marginRight: SPACING.md },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  itemTotal: {
    fontWeight: '700',
    color: COLORS.text,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  qtyBtn: { padding: 6, paddingHorizontal: 10 },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    minWidth: 20,
    textAlign: 'center',
  },
  billCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    ...SHADOWS.small,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  billLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  billValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: 0,
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
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  clearText: {
    fontSize: 13,
    color: COLORS.error,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
});
