import axios from "../lib/axios";

// Get all saved addresses
export const getAddresses = () =>
    axios
        .get("/addresses")
        .then((response) => response.data);

// Add a new address
export const addAddress = (payload) =>
    axios
        .post("/addresses", payload)
        .then((response) => response.data);

// Update an existing address
export const updateAddress = (id, payload) =>
    axios
        .patch(`/addresses/${id}`, payload)
        .then((response) => response.data);

// Delete an address
export const deleteAddress = (id) =>
    axios
        .delete(`/addresses/${id}`)
        .then((response) => response.data);

// Set an address as the default address
export const setDefaultAddress = (id) =>
    axios
        .patch(`/addresses/${id}`, { isDefault: true })
        .then((response) => response.data);
