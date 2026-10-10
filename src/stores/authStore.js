import { create } from "zustand";
import * as authService from "../services/authService";
import { useCartStore } from "./cartStore";

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,

    init: async () => {
        try {
            const res = await authService.getMe();
            set({ user: res.data, loading: false });
        } catch {
            set({ user: null, loading: false });
        }
    },

    signup: async (payload) => {
        const res = await authService.signup(payload);
        set({ user: res });
        useCartStore.getState().refreshCart(); // pulls in the merged guest cart
        return res;
    },

    login: async (payload) => {
        const res = await authService.login(payload);
        set({ user: res });
        useCartStore.getState().refreshCart(); // pulls in the merged guest cart
        return res;
    },
    
    googleLogin: async (credential) => {
        const res = await authService.googleAuth(credential);
        set({ user: res });
        useCartStore.getState().refreshCart();
        return res;
    },

    logout: async () => {
        await authService.logout();
        set({ user: null });
        useCartStore.getState().refreshCart();
    },

    updateUser: (user) => set({ user })
}));
