import { createContext, useState, useEffect, Children } from "react";
import { cartApi } from "../api/cart.api";
import { useAuth } from '../hooks/useAuth'

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { isAuthenticated, loading: authLoading } = useAuth()
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch cart when user is authenticated
    useEffect(() => {
        if (!authLoading) {
            if (isAuthenticated) {
                fetchCart();
            } else {
                setCart(null)
                setLoading(false)
            }
        }
    }, [isAuthenticated, authLoading])

    const fetchCart = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await cartApi.get()
            setCart(response)
        } catch (err) {
            setError(err.message)
            setCart(null)
        } finally {
            setLoading(false)
        }
    }

    const addItemToCart = async (productId, variantId = null, quantity = 1) => {
        try {
            setError(null)
            await cartApi.addItem({
                product_id: productId,
                variant_id: variantId,
                quantity
            })
            await fetchCart()
            return { success: true }
        } catch (err) {
            setError(err.message)
            return {
                success: false,
                message: err.message
            }
        }
    }

    const updateQuantity = async (itemId, quantity) => {
        try {
            setError(null)
            await cartApi.updateItem(itemId, quantity)
            await fetchCart()
            return { success: true }
        } catch (err) {
            setError(err.message)
            return {
                success: false,
                message: err.message
            }
        }
    }

    const removeItem = async (itemId) => {
        try {
            setError(null);
            await cartApi.removeItem(itemId);
            await fetchCart(); // Refresh cart
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        }
    };

    const clearCart = async () => {
        try {
            setError(null);
            await cartApi.clear();
            await fetchCart(); // Refresh cart
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        }
    };

    const getCartCount = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        return cart?.total || 0;
    };

    const value = {
        cart,
        loading,
        error,
        addItemToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
        cartCount: getCartCount(),
        cartTotal: getCartTotal()
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}