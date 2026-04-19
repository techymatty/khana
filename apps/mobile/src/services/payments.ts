import api from './api';

export const paymentsService = {
  createOrder: async (orderId: string) => {
    const { data } = await api.post('/payments/create', { orderId });
    return data;
  },

  verify: async (payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    const { data } = await api.post('/payments/verify', payload);
    return data;
  },
};
