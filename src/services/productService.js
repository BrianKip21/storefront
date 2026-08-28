import axios from "../lib/axios";

export const getProducts = (params) =>
    axios.get("/products", { params }).then((r) => r.data);

export const getProductById = (id) =>
    axios.get(`/products/${id}`).then((r) => r.data);
