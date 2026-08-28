import { create } from "zustand";
import toast from "react-hot-toast";
import * as cartService from "../services/cartService";

export const useCartStore = create((set, get) => ({
    items: [],
    total: 0,
    loading: true,

    refreshCart: async () => {
        try {
            const res = await cartService.getCart();
            set({ items: res.data.items, total: res.data.total, loading: false });
        } catch (err) {
            toast.error(err.message);
            set({ loading: false });
        }
    },

    addItem: async (productId, variantId, quantity = 1) => {
        try {
            const res = await cartService.addToCart({ productId, variantId, quantity });
            set({ items: res.data.items, total: res.data.total });
            toast.success("Added to cart");
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    },

    updateItem: async (itemId, quantity) => {
        try {
            const res = await cartService.updateCartItem(itemId, quantity);
            set({ items: res.data.items, total: res.data.total });
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    },

    removeItem: async (itemId) => {
        try {
            const res = await cartService.removeCartItem(itemId);
            set({ items: res.data.items, total: res.data.total });
            toast.success("Removed from cart");
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    },

    emptyCart: async () => {
        try {
            await cartService.clearCart();
            set({ items: [], total: 0 });
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    },

    itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
}));
