import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setAuth: async (token: string, user: User) => {
    await SecureStore.setItemAsync('auth_token', token);
    await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('auth_user');
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  loadToken: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userStr = await SecureStore.getItemAsync('auth_user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ token, user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
