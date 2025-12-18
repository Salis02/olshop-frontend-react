import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

export const CartSummary = ({ cart, onClearCart }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
            </h2>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Items ({totalItems})</span>
                    <span>{formatPrice(cart?.total || 0)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(cart?.total || 0)}</span>
                </div>
            </div>

            <Link to="/checkout">
                <Button
                    className="w-full mb-3"
                    size="lg"
                    disabled={!cart?.items || cart.items.length === 0}
                >
                    Proceed to Checkout
                </Button>
            </Link>

            <button
                onClick={onClearCart}
                disabled={!cart?.items || cart.items.length === 0}
                className="w-full text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Clear Cart
            </button>
        </div>
    );
};