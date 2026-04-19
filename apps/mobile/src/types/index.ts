export interface User {
  id: string;
  phone: string;
  name: string | null;
  role: 'USER' | 'RESTAURANT' | 'ADMIN' | 'RIDER';
}

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  halalVerified: boolean;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  distance?: number | null;
  menuItems?: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  category: string | null;
  restaurantId: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  total: number;
  status: OrderStatus;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
  restaurant?: { id: string; name: string; image?: string; phone?: string; address?: string };
  items?: OrderItem[];
  payment?: Payment;
  rider?: { id: string; name: string; phone: string };
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  price: number;
  menuItem?: { id: string; name: string; price: number; image?: string };
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'COD' | 'RAZORPAY';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  razorpayOrderId?: string;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user?: { id: string; name: string };
}

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'PICKED_UP'
  | 'DELIVERED'
  | 'CANCELLED';
