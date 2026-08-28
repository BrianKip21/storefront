import axios from "../lib/axios";

export const getCategories = () => axios.get("/categories").then((r) => r.data);

export const getCategoryById = (id) =>
    axios.get(`/categories/${id}`).then((r) => r.data);
