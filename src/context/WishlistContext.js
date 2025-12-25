import { createContext, useState, useEffect } from 'react';
import { wishlistApi } from '../api';
import { useAuth } from '../hooks/useAuth';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { isAuthenticated, loading: authLoading, user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch wishlist when user is authenticated AND is CUSTOMER
    useEffect(() => {
        if (!authLoading) {
            if (isAuthenticated && user?.role_name === 'CUSTOMER') {
                fetchWishlist();
            } else {
                setWishlist([]);
                setLoading(false);
            }
        }
    }, [isAuthenticated, authLoading, user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await wishlistApi.get();
            setWishlist(response);
        } catch (err) {
            setError(err.message);
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId) => {
        try {
            setError(null);
            await wishlistApi.add(productId);
            await fetchWishlist(); // Refresh wishlist
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            setError(null);
            await wishlistApi.remove(productId);
            await fetchWishlist(); // Refresh wishlist
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        }
    };

    const toggleWishlist = async (productId) => {
        const isInWishlist = wishlist.some(item => item.product_id === productId);

        if (isInWishlist) {
            return await removeFromWishlist(productId);
        } else {
            return await addToWishlist(productId);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.product_id === productId);
    };

    const getWishlistCount = () => {
        return wishlist.length;
    };

    const value = {
        wishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist,
        wishlistCount: getWishlistCount()
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};