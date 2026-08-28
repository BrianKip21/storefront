import axios from "../lib/axios";

export const getProductReviews = (productId) =>
    axios.get(`/reviews/product/${productId}`).then((r) => r.data);

export const createReview = (payload) => axios.post("/reviews", payload).then((r) => r.data);
