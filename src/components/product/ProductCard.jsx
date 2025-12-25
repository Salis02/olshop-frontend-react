import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "../common/Button";

export const ProductCard = ({ product }) => {
    const primaryImage = product.images?.find(img => img.is_primary)?.url || '/placeholder.png';
    const avgRating = product.avg_rating || 0;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Product Image */}
            <Link to={`/products/${product.uuid}`} className="block relative pb-[100%] bg-gray-100">
                <img
                    src={primaryImage}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                    }}
                />

                {/* Wishlist Button - Top Right */}
                <div className="absolute top-2 right-2 z-10">
                    <div className="bg-white rounded-full p-2 shadow-md">
                        <WishlistButton productId={product.uuid} size="sm" />
                    </div>
                </div>
                
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">Out of Stock</span>
                    </div>
                )}
            </Link>

            {/* Product Info */}
            <div className="p-4">
                {/* Category */}
                <div className="text-xs text-gray-500 mb-1">
                    {product.category?.name || 'Uncategorized'}
                </div>

                {/* Product Name */}
                <Link to={`/products/${product.uuid}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary transition line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                        {avgRating.toFixed(1)} ({product.reviews?.length || 0})
                    </span>
                </div>

                {/* Price */}
                <div className="mb-3">
                    <span className="text-2xl font-bold text-primary">
                        {formatPrice(product.price)}
                    </span>
                </div>

                {/* Stock Info */}
                <div className="text-sm text-gray-600 mb-3">
                    Stock: <span className="font-medium">{product.stock}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        disabled={product.stock === 0}
                    >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                    </Button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    )
}