import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { showToast, showConfirm } from '../../utils/toast';

export const CartItem = ({ item }) => {
    const { updateQuantity, removeItem } = useCart();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity < 1) return;
        if (newQuantity > item.product.stock) {
            showToast.error(`Only ${item.product.stock} items available`);
            return;
        }

        setIsUpdating(true);
        const result = await updateQuantity(item.id, newQuantity);
        if (!result.success) {
            showToast.error(result.message);
        }
        setIsUpdating(false);
    };

    const handleRemove = async () => {
        showConfirm('Remove this item from cart?', async () => {
            setIsRemoving(true);
            const result = await removeItem(item.id);
            if (!result.success) {
                showToast.error(result.message);
                setIsRemoving(false);
            }
        })
    };

    return (
        <div className={`flex items-center space-x-4 bg-white p-4 rounded-lg border ${isRemoving ? 'opacity-50' : ''
            }`}>
            {/* Product Image */}
            <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                <img
                    src={item.product.image || '/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                    }}
                />
            </div>

            {/* Product Info */}
            <div className="flex-grow">
                <h3 className="font-semibold text-gray-900 mb-1">
                    {item.product.name}
                </h3>

                {item.variant && (
                    <p className="text-sm text-gray-600 mb-1">
                        Variant: {item.variant.name}
                    </p>
                )}

                <p className="text-sm text-gray-500 mb-2">
                    SKU: {item.product.sku}
                </p>

                <div className="flex items-center justify-between">
                    {/* Price */}
                    <div>
                        <span className="text-lg font-bold text-primary">
                            {formatPrice(item.current_price)}
                        </span>
                        {item.price_snapshot !== item.current_price && (
                            <span className="ml-2 text-sm text-gray-400 line-through">
                                {formatPrice(item.price_snapshot)}
                            </span>
                        )}
                    </div>

                    {/* Stock Info */}
                    <div className="text-sm text-gray-600">
                        Stock: {item.product.stock}
                    </div>
                </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={isUpdating || item.quantity <= 1}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Minus className="w-4 h-4" />
                </button>

                <span className="w-12 text-center font-medium">
                    {item.quantity}
                </span>

                <button
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={isUpdating || item.quantity >= item.product.stock}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Subtotal & Remove */}
            <div className="flex flex-col items-end space-y-2">
                <div className="font-bold text-gray-900">
                    {formatPrice(item.subtotal)}
                </div>

                <button
                    onClick={handleRemove}
                    disabled={isRemoving}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};