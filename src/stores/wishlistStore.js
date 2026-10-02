import { create } from "zustand";
import toast from "react-hot-toast";

import * as wishlistService from "../services/wishlistService";

export const useWishlistStore = create((set, get) => ({
    items: [],
    loading: false,

    // Load the user's wishlist
    refreshWishlist: async () => {
        try {
            set({ loading: true });

            const res = await wishlistService.getWishlist();

            set({
                items: res.data?.items || [],
                loading: false
            });
        } catch (error) {
            set({
                items: [],
                loading: false
            });

            console.error(
                "Failed to load wishlist:",
                error
            );
        }
    },

    // Check whether a product is currently wishlisted
    isWishlisted: (productId) => {
        return get().items.some(
            (item) =>
                item.product?._id === productId
        );
    },

    // Add/remove a product from the wishlist
    toggle: async (productId) => {
        try {
            const res =
                await wishlistService.toggleWishlistItem(
                    productId
                );

            const { wishlisted } = res.data;

            if (wishlisted) {
                // The API only returns the state/count,
                // so refresh to get the populated product.
                await get().refreshWishlist();

                toast.success("Added to wishlist");
            } else {
                // Remove locally without another API request
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            item.product?._id !== productId
                    )
                }));

                toast.success("Removed from wishlist");
            }
        } catch (error) {
            console.error(
                "Failed to toggle wishlist:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update wishlist"
            );
        }
    },

    // Explicitly remove a product
    remove: async (productId) => {
        try {
            await wishlistService.removeWishlistItem(
                productId
            );

            set((state) => ({
                items: state.items.filter(
                    (item) =>
                        item.product?._id !== productId
                )
            }));

            toast.success("Removed from wishlist");
        } catch (error) {
            console.error(
                "Failed to remove wishlist item:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to remove item"
            );
        }
    }
}));