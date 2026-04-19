import api from './api';

export const ordersService = {
  create: async (orderData: {
    items: { menuItemId: string; quantity: number }[];
    deliveryAddress: string;
    deliveryLat?: number;
    deliveryLng?: number;
    paymentMethod?: 'COD' | 'RAZORPAY';
  }) => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  getMyOrders: async () => {
    const { data } = await api.get('/orders/my');
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },
};
