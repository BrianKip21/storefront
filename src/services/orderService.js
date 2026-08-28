import axios from "../lib/axios";

export const placeOrder = (payload) => axios.post("/orders", payload).then((r) => r.data);

export const getMyOrders = () => axios.get("/orders/my-orders").then((r) => r.data);

export const getOrderById = (id) => axios.get(`/orders/${id}`).then((r) => r.data);

// Payments live under /payments on the backend, but conceptually belong to
// the order lifecycle, so they're grouped here rather than a separate service.
export const payForOrder = (payload) => axios.post("/payments/pay", payload).then((r) => r.data);

export const getPaymentStatus = (checkoutRequestId) =>
    axios.get(`/payments/status/${checkoutRequestId}`).then((r) => r.data);
