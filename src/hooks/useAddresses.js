import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as addressService from "../services/addressService";

export function useAddresses() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch addresses when the hook mounts
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await addressService.getAddresses();
                setAddresses(res.data);
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load addresses"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    // Add a new address
    const addAddress = async (form) => {
        try {
            const res = await addressService.addAddress(form);

            setAddresses(res.data);

            toast.success("Address added successfully");

            return res.data;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to add address"
            );

            throw error;
        }
    };

    // Update an existing address
    const editAddress = async (id, form) => {
        try {
            const res = await addressService.updateAddress(id, form);

            setAddresses(res.data);

            toast.success("Address updated successfully");

            return res.data;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to update address"
            );

            throw error;
        }
    };

    // Delete an address
    const deleteAddress = async (id) => {
        try {
            const res = await addressService.deleteAddress(id);

            setAddresses(res.data);

            toast.success("Address removed successfully");

            return res.data;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to delete address"
            );

            throw error;
        }
    };

    // Make an address the default
    const setDefaultAddress = async (id) => {
        try {
            const res = await addressService.updateAddress(id, {
                isDefault: true
            });

            setAddresses(res.data);

            toast.success("Default address updated");

            return res.data;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to update default address"
            );

            throw error;
        }
    };

    return {
        addresses,
        loading,
        addAddress,
        editAddress,
        deleteAddress,
        setDefaultAddress
    };
}