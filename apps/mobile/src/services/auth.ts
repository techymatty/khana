import api from './api';

export const authService = {
  sendOtp: async (phone: string) => {
    const { data } = await api.post('/auth/send-otp', { phone });
    return data;
  },

  verifyOtp: async (phone: string, otp: string) => {
    const { data } = await api.post('/auth/verify-otp', { phone, otp });
    return data;
  },
};
