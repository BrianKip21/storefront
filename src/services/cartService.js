import axios from "../lib/axios";

export const getCart = () => axios.get("/carts").then((r) => r.data);

export const addToCart = (payload) => axios.post("/carts/items", payload).then((r) => r.data);

export const updateCartItem = (itemId, quantity) =>
    axios.patch(`/carts/items/${itemId}`, { quantity }).then((r) => r.data);

export const removeCartItem = (itemId) =>
    axios.delete(`/carts/items/${itemId}`).then((r) => r.data);

export const clearCart = () => axios.delete("/carts").then((r) => r.data);
