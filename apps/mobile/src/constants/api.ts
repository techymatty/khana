export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';
export const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || '';

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Order Placed',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY: 'Ready',
  PICKED_UP: 'On the Way',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: '#F59E0B',
  ACCEPTED: '#3B82F6',
  PREPARING: '#8B5CF6',
  READY: '#10B981',
  PICKED_UP: '#06B6D4',
  DELIVERED: '#0F9D58',
  CANCELLED: '#EF4444',
};
