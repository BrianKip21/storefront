import axios from "../lib/axios";

export const getBrands = () => axios.get("/brands").then((r) => r.data);

export const getBrandById = (id) => axios.get(`/brands/${id}`).then((r) => r.data);
