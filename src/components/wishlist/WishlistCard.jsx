import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { showToast } from '../../utils/toast';
import { useState } from 'react';
import { Button } from '../common/Button';

export const WishlistCard = ({ item }) => {
    const { removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [isRemoving, setIsRemoving] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleRemove = async (e) => {
        e.preventDefault();
        setIsRemoving(true);

        const result = await removeFromWishlist(item.product_id);

        if (result.success) {
            showToast.success('Removed from wishlist');
        } else {
            showToast.error(result.message);
            setIsRemoving(false);
        }
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();

        if (item.product.stock === 0) {
            showToast.error('Product is out of stock');
            return;
        }

        setIsAddingToCart(true);

        const result = await addToCart(item.product_id, null, 1);

        if (result.success) {
            showToast.success('Added to cart');
            // Optionally remove from wishlist after adding to cart
            await removeFromWishlist(item.product_id);
        } else {
            showToast.error(result.message);
        }

        setIsAddingToCart(false);
    };

    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow ${isRemoving ? 'opacity-50' : ''
            }`}>
            <Link to={`/products/${item.product_id}`} className="block">
                {/* Product Image */}
                <div className="relative pb-[100%] bg-gray-100">
                    <img
                        src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = '/placeholder.jpg';
                        }}
                    />
                    {item.product.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-semibold">Out of Stock</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition">
                        {item.product.name}
                    </h3>

                    <div className="mb-3">
                        <span className="text-xl font-bold text-primary">
                            {formatPrice(item.product.price)}
                        </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                        Stock: <span className="font-medium">{item.product.stock}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                        <Button
                            onClick={handleAddToCart}
                            disabled={item.product.stock === 0 || isAddingToCart}
                            isLoading={isAddingToCart}
                            variant="primary"
                            size="sm"
                            className="flex-1"
                        >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add to Cart
                        </Button>

                        <button
                            onClick={handleRemove}
                            disabled={isRemoving}
                            className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};