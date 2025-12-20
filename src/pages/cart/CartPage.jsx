import { Layout } from '../../components/layout/Layout';
import { useCart } from '../../hooks/useCart';
import { CartItem } from '../../components/cart/CartItem';
import { CartSummary } from '../../components/cart/CartSummary';
import { Loading } from '../../components/common/Loading';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { showConfirm, showToast } from '../../utils/toast';

export const CartPage = () => {
    const { cart, loading, clearCart } = useCart();

    const handleClearCart = async () => {
        showConfirm('Are you sure you want to clear your cart?', async () => {
            const toastId = showToast.loading('Clearing cart...');
            const result = await clearCart();
            showToast.dismiss(toastId);

            if (result.success) {
                showToast.success('Cart cleared successfully');
            } else {
                showToast.error(result.message);
            }
        });
    };

    if (loading) {
        return (
            <Layout>
                <Loading fullScreen />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/products"
                        className="inline-flex items-center text-primary hover:text-blue-600 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                </div>

                {/* Empty Cart */}
                {!cart?.items || cart.items.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Add some products to get started!
                        </p>
                        <Link
                            to="/products"
                            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    /* Cart Content */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="lg:col-span-1">
                            <CartSummary cart={cart} onClearCart={handleClearCart} />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};