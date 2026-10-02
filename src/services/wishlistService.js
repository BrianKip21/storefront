import axios from "../lib/axios";

export const getWishlist = () =>
    axios.get("/wishlist").then((r) => r.data);

export const toggleWishlistItem = (productId) =>
    axios.post(`/wishlist/${productId}`).then((r) => r.data);

export const removeWishlistItem = (productId) =>
    axios.delete(`/wishlist/${productId}`).then((r) => r.data);