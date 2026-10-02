import axios from "../lib/axios";

export const getCollections = () =>
    axios.get("/collections").then((r) => r.data);

export const getCollectionBySlug = (slug, params) =>
    axios
        .get(`/collections/${slug}`, { params })
        .then((r) => r.data);