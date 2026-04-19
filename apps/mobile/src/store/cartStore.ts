import { create } from 'zustand';
import { CartItem, MenuItem } from '../types';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;

  addItem: (menuItem: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: null,

  addItem: (menuItem: MenuItem, restaurantId: string, restaurantName: string) => {
    const state = get();

    // If cart has items from a different restaurant, clear first
    if (state.restaurantId && state.restaurantId !== restaurantId) {
      set({ items: [], restaurantId: null, restaurantName: null });
    }

    const existing = state.items.find((i) => i.menuItem.id === menuItem.id);

    if (existing) {
      set({
        items: state.items.map((i) =>
          i.menuItem.id === menuItem.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        ),
        restaurantId,
        restaurantName,
      });
    } else {
      set({
        items: [...state.items, { menuItem, quantity: 1, restaurantId, restaurantName }],
        restaurantId,
        restaurantName,
      });
    }
  },

  removeItem: (menuItemId: string) => {
    const state = get();
    const newItems = state.items.filter((i) => i.menuItem.id !== menuItemId);
    set({
      items: newItems,
      restaurantId: newItems.length ? state.restaurantId : null,
      restaurantName: newItems.length ? state.restaurantName : null,
    });
  },

  updateQuantity: (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(menuItemId);
      return;
    }
    set({
      items: get().items.map((i) =>
        i.menuItem.id === menuItemId ? { ...i, quantity } : i,
      ),
    });
  },

  clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

  getTotal: () => {
    return get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },
}));
