import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', onPress: () => {} },
    { icon: 'location-outline', label: 'Saved Addresses', onPress: () => {} },
    { icon: 'card-outline', label: 'Payment Methods', onPress: () => {} },
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => {} },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => {} },
    { icon: 'document-text-outline', label: 'Terms & Conditions', onPress: () => {} },
    { icon: 'information-circle-outline', label: 'About UmmahEats', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userPhone}>+91 {user?.phone}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
      </View>

      {/* Menu Items */}
      <View style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index < menuItems.length - 1 && styles.menuItemBorder,
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon as any} size={20} color={COLORS.textSecondary} />
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>UmmahEats v1.0.0</Text>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  userPhone: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
    backgroundColor: COLORS.error + '08',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.error,
  },
  version: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});
