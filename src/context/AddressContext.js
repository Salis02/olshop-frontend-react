import { createContext, useState, useCallback } from "react";
import { addressApi } from "../api";
import { useAuth } from "../hooks/useAuth";

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    const fetchAddresses = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            setError(null);
            const data = await addressApi.getAll();
            setAddresses(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch addresses');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const addAddress = async (addressData) => {
        try {
            setLoading(true);
            const newAddress = await addressApi.create(addressData);
            setAddresses(prev => [...prev, newAddress]);
            return { success: true, data: newAddress };
        } catch (err) {
            return { success: false, message: err.message || 'Failed to add address' };
        } finally {
            setLoading(false);
        }
    };

    const updateAddress = async (id, addressData) => {
        try {
            setLoading(true);
            const updatedAddress = await addressApi.update(id, addressData);
            setAddresses(prev => prev.map(addr => addr.uuid === id ? updatedAddress : addr));
            return { success: true, data: updatedAddress };
        } catch (err) {
            return { success: false, message: err.message || 'Failed to update address' };
        } finally {
            setLoading(false);
        }
    };

    const deleteAddress = async (id) => {
        try {
            setLoading(true);
            await addressApi.remove(id);
            setAddresses(prev => prev.filter(addr => addr.uuid !== id));
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message || 'Failed to delete address' };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        addresses,
        loading,
        error,
        fetchAddresses,
        addAddress,
        updateAddress,
        deleteAddress
    };

    return (
        <AddressContext.Provider value={value}>
            {children}
        </AddressContext.Provider>
    );
};
