import api from './api';

export const restaurantsService = {
  getAll: async (params?: { lat?: number; lng?: number; radius?: number; search?: string }) => {
    const { data } = await api.get('/restaurants', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/restaurants/${id}`);
    return data;
  },
};
